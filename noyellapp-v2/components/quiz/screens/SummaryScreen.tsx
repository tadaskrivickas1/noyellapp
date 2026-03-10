'use client';

import { useEffect, useRef } from 'react';

interface SummaryScreenProps {
  onContinue: (nextScreen: string) => void;
}

const ROWS = [
  { icon: '🎯', label: 'Main Goal',          value: 'Calm your child\'s nervous system before you ask for cooperation' },
  { icon: '⚠️', label: 'Biggest Challenge',  value: 'Stopping escalation in the moment (before it turns into yelling)' },
  { icon: '🚩', label: 'Secondary Goal',      value: 'Build daily "no yelling" routines that reduce triggers over time' },
  { icon: '🔍', label: 'Focus Area',          value: 'Better communication under stress (so your child can hear you)' },
  { icon: '⏰', label: 'Time Commitment',     value: '5 minutes a day feels realistic' },
];

export default function SummaryScreen({ onContinue }: SummaryScreenProps) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    ROWS.forEach((_, i) => {
      setTimeout(() => {
        const el = rowRefs.current[i];
        if (el) el.classList.add('show');
      }, i * 150);
    });
  }, []);

  return (
    <div className="screen-enter">
      <div style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', color: 'var(--gray-900)', marginBottom: 6 }}>
        Summary of Your Quiz Results
      </div>
      <p style={{ fontSize: 14, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 20 }}>
        Based on your answers, we&apos;ve mapped the key patterns affecting your child.
      </p>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', overflow: 'hidden', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        {ROWS.map((row, i) => (
          <div
            key={row.label}
            ref={el => { rowRefs.current[i] = el; }}
            className="summary-row-enter"
            style={{
              display: 'grid',
              gridTemplateColumns: '130px 1fr',
              alignItems: 'center',
              padding: '15px 18px',
              borderBottom: i < ROWS.length - 1 ? '1px solid var(--gray-100)' : 'none',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{row.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.3 }}>
                {row.label}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', lineHeight: 1.45 }}>
              {row.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--green)', borderRadius: 'var(--radius)',
        padding: '16px 20px', marginBottom: 20,
        textAlign: 'center', fontSize: 14, color: 'white',
        fontWeight: 500, lineHeight: 1.55,
      }}>
        This combination is typical for families with a High-Reactivity Profile — and it&apos;s exactly what your plan is designed for.
      </div>

      <button
        onClick={() => onContinue('builder')}
        style={{
          display: 'block', width: '100%',
          background: 'var(--blue)', color: 'white',
          border: 'none', borderRadius: 'var(--radius)',
          padding: 16, fontSize: 16, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Continue
      </button>
    </div>
  );
}
