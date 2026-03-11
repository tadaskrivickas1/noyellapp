'use client';

import { useState } from 'react';
import Link from 'next/link';
import TaskModal from '@/components/app/TaskModal';

interface Lesson { id: string; day_number: number; title: string; excerpt: string | null; }
interface Tip { title: string; body: string; }

interface Props {
  email: string;
  lessons: Lesson[];
  completedIds: string[];
  streak: number;
  nextLesson: Lesson | null;
  completedCount: number;
  total: number;
  tip: Tip | null;
  affirmation: string | null;
}

const QUICK_LINKS = [
  { href: '/en/tools', label: 'Tools', bg: '#e8f0fd', color: '#3b4fd8' },
  { href: '/en/library', label: 'Library', bg: '#e8f0fd', color: '#3b4fd8' },
  { href: '/en/ai', label: 'AI Help', bg: '#d4f5ea', color: '#1a7a4a' },
  { href: '/en/library', label: 'Situations', bg: '#fef3cc', color: '#7a5c00' },
];

export default function HomeClient({ email, lessons, completedIds, streak, nextLesson, completedCount, total, tip, affirmation }: Props) {
  const [modalLesson, setModalLesson] = useState<string | null>(null);
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set(completedIds));

  const completedSet = localCompleted;

  function handleMarkDone(id: string) {
    setLocalCompleted(prev => new Set([...prev, id]));
    setModalLesson(null);
  }

  const displayName = email.split('@')[0];

  return (
    <div style={{ padding: '24px 16px 8px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: '#3b4fd8',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>Hello, {displayName}</div>
          <div style={{ fontSize: 13, color: '#888' }}>Every journey starts with a first step</div>
        </div>
      </div>

      {/* Stats card */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
        {/* Top row: streak + tasks completed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          {/* Streak badge */}
          <div style={{
            background: '#3b4fd8', borderRadius: 12, padding: '10px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64, flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{streak}</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              {streak === 0 ? 'Start!' : 'Keep going!'}
            </div>
          </div>

          {/* Tasks completed */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 2 }}>Tasks completed</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#3b4fd8', lineHeight: 1 }}>{completedSet.size}</div>
          </div>
        </div>

        {/* Quick link buttons 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href} style={{
              background: link.bg, color: link.color,
              borderRadius: 10, padding: '10px 0', textAlign: 'center',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              display: 'block',
            }}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Your task */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 10 }}>Your task</h2>

        {nextLesson ? (
          <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111', flex: 1, paddingRight: 10 }}>{nextLesson.title}</div>
              <span style={{ background: '#eef0fd', color: '#3b4fd8', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 10, flexShrink: 0 }}>Day {nextLesson.day_number}</span>
            </div>
            {nextLesson.excerpt && (
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 14 }}>{nextLesson.excerpt}</div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setModalLesson(nextLesson.id)}
                style={{
                  background: '#fff', color: '#3b4fd8', border: '1.5px solid #3b4fd8',
                  borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b4fd8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
                Start
              </button>
              <button
                onClick={() => handleMarkDone(nextLesson.id)}
                style={{
                  background: '#3b4fd8', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit', flex: 1,
                }}
              >
                Mark as done
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#22a34a', borderRadius: 14, padding: 20, color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>All tasks completed!</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>You&apos;ve finished your No-Yell Plan</div>
          </div>
        )}
      </div>

      {/* Today's tip */}
      {tip && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 10 }}>Today&apos;s tip</h2>
          <div style={{ background: '#dbeeff', borderRadius: 14, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: '#b3d9ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1565c0', marginBottom: 4 }}>Today&apos;s tip</div>
              <div style={{ fontSize: 13, color: '#1a2e4a', lineHeight: 1.5, fontWeight: 500 }}>{tip.title}</div>
              {tip.body && <div style={{ fontSize: 12, color: '#2c4a6e', lineHeight: 1.5, marginTop: 4 }}>{tip.body}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Daily affirmation */}
      {affirmation && (
        <div style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 10 }}>Daily affirmation</h2>
          <div style={{ background: '#d4f5ea', borderRadius: 14, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: '#a3e8cc',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a7a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a7a4a', marginBottom: 4 }}>Daily affirmation</div>
              <div style={{ fontSize: 13, color: '#1a3a2a', lineHeight: 1.5 }}>{affirmation}</div>
            </div>
          </div>
        </div>
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
