import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SituationsClient from './SituationsClient';

export default async function SituationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/en/login');

  const { data: situations } = await supabase
    .from('situations')
    .select('id, title, excerpt, content, order_index')
    .order('order_index');

  return <SituationsClient situations={situations ?? []} />;
}
