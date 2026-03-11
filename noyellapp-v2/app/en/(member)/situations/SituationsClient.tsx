'use client';

import { useState } from 'react';

interface Situation {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  order_index: number;
}

interface Props {
  situations: Situation[];
}

export default function SituationsClient({ situations }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openSituation = situations.find(s => s.id === openId) ?? null;

  return (
    <div style={{ padding: '24px 16px 8px' }}>
      {/* Header */}
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 4 }}>Situations</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Common parenting scenarios and how to handle them calmly.</p>

      {situations.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 32, textAlign: 'center', color: '#aaa', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🌱</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#666' }}>Situations coming soon</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Check back later for practical guidance.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {situations.map(s => (
          <button
            key={s.id}
            onClick={() => setOpenId(s.id)}
            style={{
              background: '#fff', borderRadius: 14, padding: '16px', textAlign: 'left',
              border: 'none', cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
              width: '100%', fontFamily: 'inherit',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: s.excerpt ? 6 : 0 }}>{s.title}</div>
            {s.excerpt && <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{s.excerpt}</div>}
            <div style={{ fontSize: 12, color: '#3b4fd8', fontWeight: 600, marginTop: 8 }}>Read more →</div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {openSituation && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end',
          }}
          onClick={() => setOpenId(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '20px 20px 0 0',
              width: '100%', maxHeight: '85vh', overflowY: 'auto',
              padding: '24px 20px 40px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', flex: 1, paddingRight: 12 }}>{openSituation.title}</h2>
              <button
                onClick={() => setOpenId(null)}
                style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{openSituation.content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
