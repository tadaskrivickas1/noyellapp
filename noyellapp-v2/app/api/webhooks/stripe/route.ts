import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const REGULAR_PRICES: Record<string, string> = {
  '1wk':  process.env.STRIPE_PRICE_1WK_REGULAR!,
  '4wk':  process.env.STRIPE_PRICE_4WK_REGULAR!,
  '12wk': process.env.STRIPE_PRICE_12WK_REGULAR!,
};

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = supabase();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.metadata?.email;
    const plan_type = session.metadata?.plan_type;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (email && plan_type) {
      // Store Stripe fields in pending_access for later migration to profiles
      await db.from('pending_access').upsert({
        email: email.toLowerCase(),
        plan_type,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      });

      // Set up subscription schedule: intro price phase → regular price phase
      const regularPrice = REGULAR_PRICES[plan_type];
      if (regularPrice && subscriptionId) {
        await stripe.subscriptionSchedules.create({
          from_subscription: subscriptionId,
          end_behavior: 'release',
          phases: [
            {
              items: [{ price: (await stripe.subscriptions.retrieve(subscriptionId)).items.data[0].price.id, quantity: 1 }],
              iterations: 1,
            },
            {
              items: [{ price: regularPrice, quantity: 1 }],
            },
          ],
        });
      }
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;
    const periodEnd = (invoice as any).lines?.data?.[0]?.period?.end;
    await db.from('profiles')
      .update({
        has_access: true,
        ...(periodEnd ? { plan_expires_at: new Date(periodEnd * 1000).toISOString() } : {}),
      })
      .eq('stripe_customer_id', customerId);
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;
    await db.from('profiles')
      .update({ has_access: false })
      .eq('stripe_customer_id', customerId);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    await db.from('profiles')
      .update({ has_access: false })
      .eq('stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}
