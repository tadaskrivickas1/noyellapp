import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const INTRO_PRICES: Record<string, string> = {
  '1wk':  process.env.STRIPE_PRICE_1WK_INTRO!,
  '4wk':  process.env.STRIPE_PRICE_4WK_INTRO!,
  '12wk': process.env.STRIPE_PRICE_12WK_INTRO!,
};

export async function POST(request: Request) {
  const { email, plan_type } = await request.json();
  if (!email || !plan_type) {
    return NextResponse.json({ error: 'email and plan_type required' }, { status: 400 });
  }

  const introPrice = INTRO_PRICES[plan_type];
  if (!introPrice) {
    return NextResponse.json({ error: 'invalid plan_type' }, { status: 400 });
  }

  // Find or create Stripe customer
  const existing = await stripe.customers.list({ email, limit: 1 });
  const customer = existing.data[0] ?? await stripe.customers.create({ email });

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: 'subscription',
    line_items: [{ price: introPrice, quantity: 1 }],
    metadata: { email, plan_type },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.noyellplan.com'}/en/verify?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.noyellplan.com'}/en/onboarding`,
  });

  return NextResponse.json({ url: session.url });
}
