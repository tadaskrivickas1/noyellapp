import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LibraryClient from './LibraryClient';

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: lessons }, { data: situations }, { data: progress }, { data: bookmarks }] = await Promise.all([
    supabase.from('lessons').select('id, day_number, title, excerpt').order('day_number'),
    supabase.from('situations').select('id, title, excerpt, content, age_groups').order('created_at'),
    supabase.from('user_progress').select('lesson_id').eq('user_id', user.id),
    supabase.from('bookmarks').select('situation_id').eq('user_id', user.id),
  ]);

  return (
    <LibraryClient
      lessons={lessons || []}
      situations={situations || []}
      completedIds={(progress || []).map(p => p.lesson_id)}
      bookmarkedIds={(bookmarks || []).map(b => b.situation_id)}
    />
  );
}
