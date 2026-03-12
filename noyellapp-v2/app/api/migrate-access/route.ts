import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, user_id } = await request.json();
  if (!email || !user_id) return NextResponse.json({ error: 'email and user_id required' }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: pending } = await supabase
    .from('pending_access')
    .select('plan_type')
    .eq('email', email.toLowerCase())
    .single();

  if (pending) {
    await supabase.from('profiles').upsert({
      id: user_id, has_access: true, plan_type: pending.plan_type, email,
    });
    await supabase.from('pending_access').delete().eq('email', email.toLowerCase());
  }

  return NextResponse.json({ ok: true, migrated: !!pending });
}
