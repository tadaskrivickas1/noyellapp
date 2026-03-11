'use client';

import { useState } from 'react';
import TaskModal from '@/components/app/TaskModal';

interface Lesson { id: string; day_number: number; title: string; excerpt: string | null; }

interface Props {
  lessons: Lesson[];
  completedIds: string[];
  streak: number;
  nextLesson: Lesson | null;
  completedCount: number;
  total: number;
}

export default function HomeClient({ lessons, completedIds, streak, nextLesson, completedCount, total }: Props) {
  const [modalLesson, setModalLesson] = useState<string | null>(null);
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set(completedIds));

  const completedSet = localCompleted;
  const currentDay = completedCount + 1;
  const pct = Math.round((completedCount / total) * 100);
  const upcomingLessons = lessons.filter(l => !completedSet.has(l.id) && l.id !== nextLesson?.id).slice(0, 2);

  function handleMarkDone(id: string) {
    setLocalCompleted(prev => new Set([...prev, id]));
    setModalLesson(null);
  }

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>Your No-Yell Plan</h1>
        <span style={{ background: '#eef0fd', color: '#3b4fd8', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
          Day {currentDay} / {total}
        </span>
      </div>

      {/* Streak card */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <span style={{ fontSize: 32 }}>🔥</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>{streak} day streak</div>
          <div style={{ fontSize: 13, color: '#888' }}>{streak > 0 ? 'Keep it going!' : 'Complete today\'s lesson to start your streak'}</div>
        </div>
      </div>

      {/* Today's lesson */}
      {nextLesson && (
        <div style={{ background: '#3b4fd8', borderRadius: 14, padding: 20, marginBottom: 16, color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, marginBottom: 8 }}>Today&apos;s lesson</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{nextLesson.title}</div>
          {nextLesson.excerpt && <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16, lineHeight: 1.5 }}>{nextLesson.excerpt}</div>}
          <button
            onClick={() => setModalLesson(nextLesson.id)}
            style={{ background: '#fff', color: '#3b4fd8', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Read today&apos;s lesson →
          </button>
        </div>
      )}

      {!nextLesson && (
        <div style={{ background: '#22a34a', borderRadius: 14, padding: 20, marginBottom: 16, color: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>All lessons completed!</div>
          <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>You&apos;ve finished your 28-day No-Yell Plan</div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Your progress</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#3b4fd8' }}>{completedCount}/{total}</span>
        </div>
        <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#3b4fd8', borderRadius: 4, transition: 'width 0.4s' }} />
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>{pct}% complete</div>
      </div>

      {/* Upcoming lessons */}
      {upcomingLessons.length > 0 && (
        <>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 10 }}>Up next</h2>
          {upcomingLessons.map(l => (
            <div
              key={l.id}
              onClick={() => setModalLesson(l.id)}
              style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', flex: 1, paddingRight: 8 }}>{l.title}</div>
                <span style={{ background: '#f5f5f5', color: '#666', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, flexShrink: 0 }}>Day {l.day_number}</span>
              </div>
              {l.excerpt && <div style={{ fontSize: 13, color: '#888', lineHeight: 1.4 }}>{l.excerpt}</div>}
            </div>
          ))}
        </>
      )}

      {modalLesson && (
        <TaskModal
          lessonId={modalLesson}
          isCompleted={localCompleted.has(modalLesson)}
          onClose={() => setModalLesson(null)}
          onMarkDone={handleMarkDone}
        />
      )}
    </div>
  );
}
