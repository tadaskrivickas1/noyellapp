'use client';

import { useEffect, useRef } from 'react';

interface ResultsScreenProps {
  onContinue: (nextScreen: string) => void;
}

export default function ResultsScreen({ onContinue }: ResultsScreenProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let n = 0;
    const target = 36;
    const iv = setInterval(() => {
      n = Math.min(n + 1, target);
      if (countRef.current) {
        countRef.current.innerHTML = `${n} <span style="font-size:22px;color:var(--gray-400);font-weight:500">/ 50</span>`;
      }
      if (n === target) clearInterval(iv);
    }, 40);

    setTimeout(() => {
      if (barRef.current) barRef.current.style.width = '72%';
      let p = 0;
      const iv2 = setInterval(() => {
        p = Math.min(p + 1, 91);
        if (pctRef.current) {
          pctRef.current.innerHTML = `${p}% <span style="font-size:16px;color:var(--gray-500);font-weight:400">match</span>`;
        }
        if (p === 91) clearInterval(iv2);
      }, 18);
    }, 600);

    return () => clearInterval(iv);
  }, []);

  return (
    <div className="screen-enter" style={{ paddingTop: 10 }}>
      <h2 style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 14 }}>
        Nervous System Stress Score
      </h2>
      <div ref={countRef} style={{ textAlign: 'center', fontSize: 54, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1, marginBottom: 4 }}>
        0 <span style={{ fontSize: 22, color: 'var(--gray-400)', fontWeight: 500 }}>/ 50</span>
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
        Indicates how often your child becomes overwhelmed by everyday demands.
      </p>
      <div style={{ height: 8, background: 'var(--gray-200)', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
        <div ref={barRef} className="stress-bar-fill" />
      </div>

      {/* Profile card */}
      <div style={{
        background: 'var(--white)', border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius)', padding: 20, marginBottom: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500, marginBottom: 6, textAlign: 'center' }}>
          Your Child&apos;s Emotional Type:
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)', textAlign: 'center', marginBottom: 8 }}>
          High-Reactivity Profile
        </div>
        <div ref={pctRef} style={{ fontSize: 48, fontWeight: 800, color: 'var(--blue)', textAlign: 'center', lineHeight: 1, marginBottom: 4 }}>
          0% <span style={{ fontSize: 16, color: 'var(--gray-500)', fontWeight: 400 }}>match</span>
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--blue)', fontWeight: 500, marginBottom: 18 }}>
          This is one of the most regulation-intensive nervous system patterns.
        </p>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 12 }}>What this means</div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            'Highly creative and independent (strong drive, low tolerance for control)',
            'Emotionally intense (feels everything fast and deeply)',
            'Quick to react under stress or overload (needs help slowing the reaction loop)',
          ].map(trait => (
            <li key={trait} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--gray-700)', marginBottom: 8, lineHeight: 1.45 }}>
              <div style={{
                width: 18, height: 18, flexShrink: 0, marginTop: 1,
                background: 'var(--green)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              {trait}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onContinue('summary')}
        style={{
          display: 'block', width: '100%',
          background: 'var(--blue)', color: 'white',
          border: 'none', borderRadius: 'var(--radius)',
          padding: 16, fontSize: 16, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        See Your Personalized Summary
      </button>
    </div>
  );
}
