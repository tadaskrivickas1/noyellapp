'use client';

import { useEffect, useRef, useState } from 'react';
import { PLAN_DATA } from '@/lib/quiz-types';

interface SalesScreenProps {
  plan: '1wk' | '4wk' | '12wk';
  onSelectPlan: (plan: '1wk' | '4wk' | '12wk') => void;
  onOrder: () => void;
}

export default function SalesScreen({ plan, onSelectPlan, onOrder }: SalesScreenProps) {
  const [seconds, setSeconds] = useState(600);
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const orderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');

  function scrollToOrder() {
    orderRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleOrder() {
    if (!termsChecked) { setTermsError(true); return; }
    setTermsError(false);
    onOrder();
  }

  const PLANS: Array<{ key: '1wk' | '4wk' | '12wk'; name: string; orig: string; price: string; perDay: string; note: string; popular?: boolean }> = [
    { key: '1wk',  name: '1-week plan',  orig: '$20.97', price: '$8.18',  perDay: '$1.17', note: 'for first 7 days' },
    { key: '4wk',  name: '4-week plan',  orig: '$45.96', price: '$17.92', perDay: '$0.64', note: 'for first month', popular: true },
    { key: '12wk', name: '12-week plan', orig: '$78.85', price: '$29.74', perDay: '$0.35', note: 'for first 3 months' },
  ];

  return (
    <div className="screen-enter">
      {/* Award badge */}
      <div style={{
        background: '#FFF8E1', border: '1px solid #FFE082',
        borderRadius: 'var(--radius)', padding: '12px 16px',
        marginBottom: 20, textAlign: 'center',
        fontSize: 13, color: 'var(--gray-800)', lineHeight: 1.5,
      }}>
        🏆 <strong>NoYell.app</strong> has been nominated for <strong>Parenting App of the Year</strong> at the International Family Association Awards.
      </div>

      {/* Sticky bar */}
      <div style={{
        position: 'sticky', top: 57, zIndex: 90,
        background: 'var(--white)', borderBottom: '1px solid var(--gray-200)',
        padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        margin: '0 -24px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Discount expires in</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--red)', fontFamily: 'inherit' }}>{m}:{s}</div>
          <div style={{ fontSize: 10, color: 'var(--gray-500)' }}>min sec</div>
        </div>
        <button onClick={scrollToOrder} style={{ background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          Order now
        </button>
      </div>

      {/* NOW / GOAL */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { badge: 'NOW', badgeColor: 'var(--red)', emoji: '😤', stats: [{ label: 'Anger level', val: 'High', bad: true, w: 82 }, { label: 'Confidence', val: 'Insecure', bad: true, w: 22 }, { label: 'Stress level', val: 'Overwhelmed', bad: true, w: 90 }] },
            { badge: 'GOAL', badgeColor: 'var(--green)', emoji: '🕊️', stats: [{ label: 'Anger level', val: 'Low', bad: false, w: 15 }, { label: 'Confidence', val: 'Self-Assured', bad: false, w: 88 }, { label: 'Stress level', val: 'Balanced', bad: false, w: 20 }] },
          ].map(col => (
            <div key={col.badge} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '16px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: 10, color: col.badgeColor }}>{col.badge}</div>
              <span style={{ fontSize: 46, textAlign: 'center', display: 'block', marginBottom: 12 }}>{col.emoji}</span>
              {col.stats.map(st => (
                <div key={st.label} style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 2 }}>{st.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: st.bad ? 'var(--red)' : 'var(--green)' }}>{st.val}</div>
                  <div style={{ height: 4, background: 'var(--gray-200)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, background: st.bad ? 'var(--red)' : 'var(--green)', width: st.w + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <button onClick={scrollToOrder} style={{ display: 'block', width: '100%', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Order now →
        </button>
      </div>

      {/* Stats */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16, textAlign: 'center' }}>
        <span style={{ fontSize: 46, fontWeight: 800, color: 'var(--green)', display: 'block', lineHeight: 1 }}>87%</span>
        <span style={{ fontSize: 14, color: 'var(--gray-600)', fontWeight: 500, marginTop: 4, display: 'block', marginBottom: 16 }}>of parents reported major progress within 3 months</span>
        <div style={{ textAlign: 'left' }}>
          {[
            { pct: '73%', desc: 'noticed a drop in outbursts and meltdowns' },
            { pct: '68%', desc: 'improved connection with their child' },
            { pct: '75%', desc: 'began using simple strategies to support focus and calm at home' },
          ].map(row => (
            <div key={row.pct} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue)', minWidth: 44 }}>{row.pct}</span>
              <span style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.4 }}>{row.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollToOrder} style={{ display: 'block', width: '100%', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20 }}>
        Order now →
      </button>

      {/* Testimonials */}
      <div style={{ marginBottom: 20 }}>
        {[
          { initials: 'Ie', name: 'Ieva', role: 'mom of 4', text: 'I\'ve already taken 4 courses and I find it very useful. The info I get in just a couple of minutes of reading. For a busy mom, that\'s a lifesaver. I give 5 🌟!' },
          { initials: 'To', name: 'Tomas', role: 'dad of 2', text: 'My sister showed me this, and she said she wished it had been available when our parents were raising us. After using it, I absolutely agree ✅' },
          { initials: 'Gr', name: 'Greta', role: 'mom of 2', text: 'I\'m so glad I found this ❤️ It\'s so nicely put together and the information is so practical I can\'t recommend this enough.' },
        ].map(t => (
          <div key={t.name} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--blue-light)', fontSize: 14, fontWeight: 700, color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{t.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.role}</div>
              </div>
            </div>
            <div style={{ color: '#F59F00', fontSize: 13, letterSpacing: 1, marginBottom: 6 }}>★★★★★</div>
            <p style={{ fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.55 }}>{t.text}</p>
          </div>
        ))}
      </div>

      {/* Plan selector */}
      <div ref={orderRef}>
        <h3 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', color: 'var(--gray-900)', marginBottom: 14 }}>Select your plan</h3>
        {PLANS.map(p => (
          <div
            key={p.key}
            onClick={() => onSelectPlan(p.key)}
            style={{
              position: 'relative',
              border: `2px solid ${plan === p.key ? 'var(--green)' : 'var(--gray-200)'}`,
              borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 10,
              cursor: 'pointer', background: plan === p.key ? 'var(--green-light)' : 'var(--white)',
              display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.18s',
            }}
          >
            {p.popular && (
              <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--red)', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                POPULAR CHOICE
              </div>
            )}
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${plan === p.key ? 'var(--green)' : 'var(--gray-300)'}`, flexShrink: 0, position: 'relative' }}>
              {plan === p.key && <div style={{ position: 'absolute', inset: 3, background: 'var(--green)', borderRadius: '50%' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                <s style={{ color: 'var(--red)' }}>{p.orig}</s> {p.price}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{p.note}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{p.perDay}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.3 }}>per<br />day</div>
            </div>
          </div>
        ))}

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--gray-500)', margin: '14px 0', cursor: 'pointer', lineHeight: 1.45 }}>
          <input type="checkbox" checked={termsChecked} onChange={e => { setTermsChecked(e.target.checked); setTermsError(false); }} style={{ accentColor: 'var(--blue)', flexShrink: 0, marginTop: 2 }} />
          I agree to the{' '}
          <a href="https://noyellplan.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>T&amp;Cs</a>
          {' '}and{' '}
          <a href="https://noyellplan.com/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>Privacy Policy</a>
        </label>
        {termsError && <p style={{ color: 'var(--red)', fontSize: 13, textAlign: 'center', marginBottom: 8 }}>Please agree to the Terms & Conditions.</p>}

        <button onClick={handleOrder} style={{ display: 'block', width: '100%', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Order now →
        </button>
        <p style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5, marginTop: 12, textAlign: 'center' }}>
          By clicking ORDER NOW, I agree to pay for my plan. If I don&apos;t cancel before the end of the introductory period, my subscription will automatically renew at the regular price.
        </p>
      </div>

      {/* Money back */}
      <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: 20, marginTop: 24, marginBottom: 16, textAlign: 'center' }}>
        <span style={{ fontSize: 52, marginBottom: 10, display: 'block' }}>🏅</span>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>100% Money-Back Guarantee</div>
        <p style={{ fontSize: 13.5, color: 'var(--gray-600)', lineHeight: 1.6 }}>
          Try the 4-week plan for 14 days. If you don&apos;t see progress — no fighting, no yelling — we&apos;ll give you a full refund. No questions asked.
        </p>
      </div>

      {/* Trust logos */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500, marginBottom: 12 }}>Trusted by parents, covered in media</div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {['CNN', 'TRUSTPILOT', 'Aptoide', 'techsagar'].map(logo => (
            <span key={logo} style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '0.5px' }}>{logo}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
