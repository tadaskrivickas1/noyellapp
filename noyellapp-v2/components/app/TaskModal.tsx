'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';

interface Props {
  lessonId: string;
  isCompleted: boolean;
  onClose: () => void;
  onMarkDone: (id: string) => void;
}

interface Lesson {
  id: string;
  day_number: number;
  title: string;
  content: string;
}

export default function TaskModal({ lessonId, isCompleted, onClose, onMarkDone }: Props) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('lessons').select('id, day_number, title, content').eq('id', lessonId).single()
      .then(({ data }) => setLesson(data));
  }, [lessonId]);

  async function markDone() {
    if (isCompleted) { onClose(); return; }
    setMarking(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_progress').upsert({ user_id: user.id, lesson_id: lessonId });
    }
    onMarkDone(lessonId);
    setMarking(false);
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 16px 0' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888', padding: 4 }}>✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
          {!lesson ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading...</div>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#3b4fd8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Day {lesson.day_number}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16, lineHeight: 1.4 }}>{lesson.title}</h2>
              <div style={{ fontSize: 15, color: '#333', lineHeight: 1.7 }}>
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: 'none', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#666' }}
          >
            Close
          </button>
          <button
            onClick={markDone}
            disabled={marking}
            style={{ flex: 2, background: isCompleted ? '#22a34a' : '#3b4fd8', color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: marking ? 0.7 : 1 }}
          >
            {isCompleted ? '✓ Completed' : marking ? 'Saving...' : 'Mark done'}
          </button>
        </div>
      </div>
    </div>
  );
}
