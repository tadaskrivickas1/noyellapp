import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/en/login');

  // Fetch all lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, day_number, title, excerpt')
    .order('day_number');

  // Fetch completed lessons for this user
  const { data: progress } = await supabase
    .from('user_progress')
    .select('lesson_id, completed_at')
    .eq('user_id', user.id)
    .order('completed_at');

  const completedIds = new Set((progress || []).map(p => p.lesson_id));

  // Calculate streak
  const completedDates = (progress || [])
    .map(p => new Date(p.completed_at).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .reverse();

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (completedDates[0] === today || completedDates[0] === yesterday) {
    streak = 1;
    for (let i = 1; i < completedDates.length; i++) {
      const prev = new Date(new Date(completedDates[i - 1]).getTime() - 86400000).toDateString();
      if (completedDates[i] === prev) streak++;
      else break;
    }
  }

  const allLessons = lessons || [];
  const nextLesson = allLessons.find(l => !completedIds.has(l.id));
  const completedCount = completedIds.size;
  const currentDay = completedCount + 1;

  // Fetch daily tip and affirmation by current lesson day
  const [{ data: tipData }, { data: affirmationData }] = await Promise.all([
    supabase
      .from('daily_tips')
      .select('title, body')
      .eq('day_number', currentDay)
      .maybeSingle(),
    supabase
      .from('daily_affirmations')
      .select('body')
      .eq('day_number', currentDay)
      .maybeSingle(),
  ]);

  return (
    <HomeClient
      email={user.email ?? ''}
      lessons={allLessons}
      completedIds={[...completedIds]}
      streak={streak}
      nextLesson={nextLesson ?? null}
      completedCount={completedCount}
      total={allLessons.length || 28}
      tip={tipData ?? null}
      affirmation={affirmationData ? affirmationData.body : null}
    />
  );
}
