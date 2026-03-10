'use client';

import { useEffect, useRef, useState } from 'react';

interface BuilderScreenProps {
  onContinue: (nextScreen: string) => void;
}

const STEPS = [
  { key: 'goals',   label: 'Goals' },
  { key: 'growth',  label: 'Growth areas' },
  { key: 'content', label: 'Content' },
  { key: 'topics',  label: 'Topics' },
];

export default function BuilderScreen({ onContinue }: BuilderScreenProps) {
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const [doneSteps, setDoneSteps] = useState<string[]>([]);
  const [pcts, setPcts] = useState<Record<string, number>>({});
  const [showReview, setShowReview] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    let i = 0;

    function runStep(key: string, cb: () => void) {
      setVisibleSteps(prev => [...prev, key]);
      let pct = 0;
      const speed = 55 + Math.random() * 30;
      const iv = setInterval(() => {
        pct += Math.random() * 8 + 4;
        if (pct >= 100) pct = 100;
        setPcts(prev => ({ ...prev, [key]: Math.round(pct) }));
        if (pct >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            setDoneSteps(prev => [...prev, key]);
            cb();
          }, 200);
        }
      }, speed);
    }

    function next() {
      if (i >= STEPS.length) {
        setTimeout(() => {
          setShowReview(true);
          setTimeout(() => setShowBtn(true), 300);
        }, 400);
        return;
      }
      const delay = i === 0 ? 300 : 250;
      setTimeout(() => {
        const key = STEPS[i].key;
        i++;
        runStep(key, next);
      }, delay);
    }

    next();
  }, []);

  return (
    <div className="screen-enter">
      <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', color: 'var(--blue)', marginBottom: 24, lineHeight: 1.3 }}>
        Your Child&apos;s Custom NoYell Plan is Ready!
      </h2>

      <div style={{ background: 'var(--white)', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {STEPS.map(step => {
          const visible = visibleSteps.includes(step.key);
          const done = doneSteps.includes(step.key);
          const pct = pcts[step.key] ?? 0;
          if (!visible) return null;
          return (
            <div key={step.key} className="slide-in" style={{ padding: '20px 22px', borderBottom: '1px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: done ? 0 : 10 }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)', flex: 1 }}>{step.label}</span>
                {!done && <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue)', minWidth: 44, textAlign: 'right' }}>{pct}%</span>}
                {done && (
                  <div style={{
                    width: 32, height: 32, background: 'var(--blue)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M2 7l3.5 3.5 6.5-6.5" />
                    </svg>
                  </div>
                )}
              </div>
              {!done && (
                <div style={{ height: 5, background: 'var(--gray-200)', borderRadius: 5, overflow: 'hidden' }}>
                  <div className="build-bar-fill" style={{ width: pct + '%' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showReview && (
        <div className="slide-in" style={{
          background: 'var(--white)', borderRadius: 16, padding: 20, marginBottom: 20,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EEF0FF', fontSize: 14, fontWeight: 700, color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>LP</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>Laura Petraitienė</span>
                <span style={{ color: '#F59F00', fontSize: 16, letterSpacing: 1, marginLeft: 6 }}>★★★★★</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>2 days ago</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6, marginTop: 12, fontStyle: 'italic' }}>
            &ldquo;I cried reading the first lesson. I finally felt understood — someone gets what it&apos;s like to raise a child who lives on the edge. Thank you.&rdquo;
          </p>
        </div>
      )}

      {showBtn && (
        <button
          onClick={() => onContinue('email')}
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
      )}
    </div>
  );
}
