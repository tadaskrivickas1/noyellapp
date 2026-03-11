'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import TaskModal from '@/components/app/TaskModal';

interface Lesson { id: string; day_number: number; title: string; excerpt: string | null; }
interface Situation { id: string; title: string; excerpt: string | null; content: string; age_groups: string[]; }

interface Props {
  lessons: Lesson[];
  situations: Situation[];
  completedIds: string[];
  bookmarkedIds: string[];
}

const AGE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'toddler', label: 'Toddler (1-3)' },
  { key: 'child', label: 'Child (4-12)' },
  { key: 'teen', label: 'Teen (13+)' },
];

export default function LibraryClient({ lessons, situations, completedIds, bookmarkedIds }: Props) {
  const [tab, setTab] = useState<'tasks' | 'situations'>('tasks');
  const [modalId, setModalId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(new Set(completedIds));
  const [bookmarked, setBookmarked] = useState(new Set(bookmarkedIds));
  const [ageFilter, setAgeFilter] = useState('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleMarkDone(id: string) {
    setCompleted(prev => new Set([...prev, id]));
    setModalId(null);
    showToast('Task completed! New tasks unlock daily.');
  }

  async function toggleBookmark(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (bookmarked.has(id)) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('situation_id', id);
      setBookmarked(prev => { const n = new Set(prev); n.delete(id); return n; });
    } else {
      await supabase.from('bookmarks').upsert({ user_id: user.id, situation_id: id });
      setBookmarked(prev => new Set([...prev, id]));
    }
  }

  const completedLessons = lessons.filter(l => completed.has(l.id));
  const pendingLessons = lessons.filter(l => !completed.has(l.id));
  const filteredSituations = ageFilter === 'all'
    ? situations
    : situations.filter(s => s.age_groups.includes(ageFilter));

  const AGE_LABEL: Record<string, string> = { toddler: 'Toddler (1-3)', child: 'Child (4-12)', teen: 'Teen (13+)' };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: '#22a34a', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 400, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '24px 16px 0' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4 }}>
          Situation Library
        </h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          {tab === 'tasks' ? 'Daily content for your parenting journey.' : 'What to do when...'}
        </p>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: 10, padding: 3, marginBottom: 20 }}>
          {(['tasks', 'situations'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: tab === t ? '#fff' : 'transparent', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', color: tab === t ? '#111' : '#888', boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            >
              {t === 'tasks' ? 'Your Tasks' : 'Situations'}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks tab */}
      {tab === 'tasks' && (
        <div style={{ padding: '0 16px' }}>
          {/* Completed section */}
          {completedLessons.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: '#666' }}>Completed tasks ({completedLessons.length})</span>
                <span style={{ color: '#888', fontSize: 18 }}>{showCompleted ? '▲' : '▼'}</span>
              </button>
              {showCompleted && completedLessons.map(l => (
                <div key={l.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 10, opacity: 0.7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111', flex: 1, paddingRight: 8 }}>{l.title}</div>
                    <span style={{ background: '#f5f5f5', fontSize: 11, fontWeight: 600, color: '#666', padding: '2px 8px', borderRadius: 10 }}>Day {l.day_number}</span>
                  </div>
                  {l.excerpt && <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.4 }}>{l.excerpt}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <button onClick={() => setModalId(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#3b4fd8', fontFamily: 'inherit', fontWeight: 600, padding: 0 }}>
                      📖 Read again
                    </button>
                    <span style={{ fontSize: 13, color: '#22a34a', fontWeight: 600 }}>✓ Done</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending lessons */}
          {pendingLessons.map(l => (
            <div key={l.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', flex: 1, paddingRight: 8 }}>{l.title}</div>
                <span style={{ background: '#eef0fd', color: '#3b4fd8', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>Day {l.day_number}</span>
              </div>
              {l.excerpt && <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.4 }}>{l.excerpt}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <button onClick={() => setModalId(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#3b4fd8', fontFamily: 'inherit', fontWeight: 600, padding: 0 }}>
                  📖 Start
                </button>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) await supabase.from('user_progress').upsert({ user_id: user.id, lesson_id: l.id });
                    handleMarkDone(l.id);
                  }}
                  style={{ background: '#3b4fd8', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Mark done
                </button>
              </div>
            </div>
          ))}

          {pendingLessons.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>All tasks completed!</div>
            </div>
          )}
        </div>
      )}

      {/* Situations tab */}
      {tab === 'situations' && (
        <div style={{ padding: '0 16px' }}>
          {/* Age filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {AGE_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setAgeFilter(f.key)}
                style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: 'none', background: ageFilter === f.key ? '#3b4fd8' : '#f0f0f0', color: ageFilter === f.key ? '#fff' : '#666', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredSituations.map(s => {
            const isExpanded = expanded.has(s.id);
            const isBookmarked = bookmarked.has(s.id);
            return (
              <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: '16px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111', flex: 1, paddingRight: 8 }}>{s.title}</div>
                  <button onClick={() => toggleBookmark(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? '#3b4fd8' : 'none'} stroke={isBookmarked ? '#3b4fd8' : '#aaa'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {s.age_groups.map(g => (
                    <span key={g} style={{ background: '#eef0fd', color: '#3b4fd8', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>{AGE_LABEL[g] || g}</span>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, margin: 0 }}>
                  {isExpanded ? s.content : s.excerpt}
                </p>
                <button
                  onClick={() => setExpanded(prev => { const n = new Set(prev); isExpanded ? n.delete(s.id) : n.add(s.id); return n; })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#3b4fd8', fontWeight: 600, padding: '8px 0 0', fontFamily: 'inherit' }}
                >
                  {isExpanded ? '▲ Show less' : '▼ Show more'}
                </button>
              </div>
            );
          })}

          {filteredSituations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888', fontSize: 14 }}>
              No situations for this age group yet.
            </div>
          )}
        </div>
      )}

      {modalId && (
        <TaskModal
          lessonId={modalId}
          isCompleted={completed.has(modalId)}
          onClose={() => setModalId(null)}
          onMarkDone={handleMarkDone}
        />
      )}
    </div>
  );
}
