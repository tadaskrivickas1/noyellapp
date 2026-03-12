'use client';

import { useEffect, useRef, useState } from 'react';

interface SalesScreenProps {
  plan: '1wk' | '4wk' | '12wk';
  onSelectPlan: (plan: '1wk' | '4wk' | '12wk') => void;
  onOrder: () => void;
}

const VIDEO_URLS = [
  'https://fxrriqbkdtxttxykczqp.supabase.co/storage/v1/object/public/testimonial-videos/NoYellApp-VAR-EN-1.mp4',
  'https://fxrriqbkdtxttxykczqp.supabase.co/storage/v1/object/public/testimonial-videos/NoYellApp-VAR-EN-2.mp4',
  'https://fxrriqbkdtxttxykczqp.supabase.co/storage/v1/object/public/testimonial-videos/NoYellApp-VAR-EN-3.mp4',
  'https://fxrriqbkdtxttxykczqp.supabase.co/storage/v1/object/public/testimonial-videos/NoYellApp-VAR-EN-4.mp4',
];

const STAR_RATINGS = [
  { label: 'Relatable content', stars: 4.7 },
  { label: 'Practical application', stars: 4.8 },
  { label: 'Additional resources', stars: 4.6 },
  { label: 'User experience', stars: 4.9 },
  { label: 'Course variety', stars: 4.9 },
];

const TESTIMONIALS = [
  {
    name: 'Ieva',
    role: 'Mom of Kastas (4) and Emilija (6)',
    text: "I'm only on day 4, but I already love this. The lessons are short but packed — in just a few minutes I get so much useful info. For a busy mom of 2, this is a lifesaver. 5 🌟!",
  },
  {
    name: 'Tomas',
    role: 'Dad of Matas (13) and Austeja (6)',
    text: "My sister showed me this and said she wished she'd had it when our parents were raising us. After 4 courses, I completely agree ✅✅",
  },
  {
    name: 'Greta',
    role: 'Mom of Emile (2)',
    text: "So happy I found this ❤️❤️ Everything is so well put together, the info is super practical — I truly recommend it.",
  },
];

const PLANS: Array<{
  key: '1wk' | '4wk' | '12wk';
  name: string;
  orig: string;
  price: string;
  perDay: string;
  note: string;
  popular?: boolean;
}> = [
  { key: '1wk',  name: '1-week plan',  orig: '$20.97', price: '$8.18',  perDay: '$1.17', note: 'for first 7 days' },
  { key: '4wk',  name: '4-week plan',  orig: '$45.96', price: '$17.92', perDay: '$0.64', note: 'for first month', popular: true },
  { key: '12wk', name: '12-week plan', orig: '$78.85', price: '$29.74', perDay: '$0.35', note: 'for first 3 months' },
];

function StarRow({ stars }: { stars: number }) {
  const full = Math.floor(stars);
  const empty = 5 - full;
  return (
    <span style={{ color: '#F59F00', fontSize: 14, letterSpacing: 1 }}>
      {'★'.repeat(full)}
      <span style={{ color: 'var(--gray-300)' }}>{'★'.repeat(empty)}</span>
    </span>
  );
}

function PriceDisplay({ perDay }: { perDay: string }) {
  const dotIdx = perDay.indexOf('.');
  const int = dotIdx !== -1 ? perDay.slice(0, dotIdx) : perDay;
  const dec = dotIdx !== -1 ? perDay.slice(dotIdx + 1) : '';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, lineHeight: 1 }}>
      <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{int}.</span>
      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.2 }}>{dec}</span>
    </div>
  );
}

function MoneyBackCard() {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 10 }}>🏅</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 10 }}>100% Money-Back Guarantee</div>
      <p style={{ fontSize: 13.5, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 10 }}>
        We believe our 4-week plan can show you real, visible results within 4 weeks. If you don&apos;t see progress, we&apos;ll give you a full refund within 14 days of purchase — no questions asked.
      </p>
      <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>
        Learn about the terms that apply to our{' '}
        <a href="https://noyellplan.com/refund-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>refund policy</a>.
      </p>
    </div>
  );
}

interface PlanSelectorProps {
  plan: '1wk' | '4wk' | '12wk';
  onSelectPlan: (p: '1wk' | '4wk' | '12wk') => void;
  termsChecked: boolean;
  setTermsChecked: (v: boolean) => void;
  termsError: boolean;
  setTermsError: (v: boolean) => void;
  onOrder: () => void;
  planRef?: React.RefObject<HTMLDivElement | null>;
}

function PlanSelectorCard({ plan, onSelectPlan, termsChecked, setTermsChecked, termsError, setTermsError, onOrder, planRef }: PlanSelectorProps) {
  const selectedPlan = PLANS.find(p => p.key === plan)!;
  return (
    <div ref={planRef} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', color: 'var(--gray-900)', marginBottom: 18 }}>Select your plan</h3>

      {PLANS.map(p => (
        <div
          key={p.key}
          onClick={() => onSelectPlan(p.key)}
          style={{
            position: 'relative',
            border: `2px solid ${plan === p.key ? 'var(--green)' : 'var(--gray-200)'}`,
            borderRadius: 'var(--radius)', padding: '14px', marginBottom: 10,
            cursor: 'pointer', background: plan === p.key ? 'var(--green-light)' : 'var(--white)',
            display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.18s',
            marginTop: p.popular ? 14 : 0,
          }}
        >
          {p.popular && (
            <div style={{ position: 'absolute', top: -11, left: 12, background: 'var(--red)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              POPULAR CHOICE
            </div>
          )}
          <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${plan === p.key ? 'var(--green)' : 'var(--gray-300)'}`, flexShrink: 0, background: plan === p.key ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {plan === p.key && <span style={{ color: 'white', fontSize: 13, lineHeight: 1 }}>✓</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
              <s style={{ color: 'var(--red)' }}>{p.orig}</s>{' '}{p.price}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{p.note}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <PriceDisplay perDay={p.perDay} />
            <div style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.3, marginTop: 2 }}>per<br />day</div>
          </div>
        </div>
      ))}

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--gray-500)', margin: '14px 0 10px', cursor: 'pointer', lineHeight: 1.45 }}>
        <input type="checkbox" checked={termsChecked} onChange={e => { setTermsChecked(e.target.checked); setTermsError(false); }} style={{ accentColor: 'var(--blue)', flexShrink: 0, marginTop: 2 }} />
        I agree to the{' '}
        <a href="https://noyellplan.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>T&amp;Cs</a>
        {' '}and{' '}
        <a href="https://noyellplan.com/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>Privacy Policy</a>
      </label>
      {termsError && <p style={{ color: 'var(--red)', fontSize: 13, textAlign: 'center', marginBottom: 8 }}>Please agree to the Terms &amp; Conditions.</p>}

      <button onClick={onOrder} style={{ display: 'block', width: '100%', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        Order now →
      </button>

      <p style={{ fontSize: 11, color: 'var(--gray-400)', lineHeight: 1.5, marginTop: 10, textAlign: 'center' }}>
        By clicking ORDER NOW, you agree to pay <strong>{selectedPlan.price}</strong> for your plan. If you don&apos;t cancel before the end of the introductory period, your subscription will automatically renew at <strong>{selectedPlan.orig}</strong> each billing cycle, until cancelled. To cancel, contact hello@noyellplan.com.
      </p>

      <div style={{ marginTop: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>Guaranteed Secure Payment</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#635BFF', letterSpacing: '-0.5px' }}>stripe</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#1A1F71', letterSpacing: '1px', fontStyle: 'italic' }}>VISA</span>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', background: '#EB001B' }} />
            <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', background: '#F79E1B', marginLeft: -8, opacity: 0.9 }} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'white', background: '#2E77BC', borderRadius: 4, padding: '3px 7px', letterSpacing: '0.3px' }}>AMEX</span>
        </div>
      </div>
    </div>
  );
}

export default function SalesScreen({ plan, onSelectPlan, onOrder }: SalesScreenProps) {
  const [seconds, setSeconds] = useState(600);
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const orderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  function scrollToOrder() {
    orderRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleOrder() {
    if (!termsChecked) { setTermsError(true); return; }
    setTermsError(false);
    onOrder();
  }

  const planSelectorProps: PlanSelectorProps = {
    plan, onSelectPlan,
    termsChecked, setTermsChecked,
    termsError, setTermsError,
    onOrder: handleOrder,
  };

  return (
    <div className="screen-enter">

      {/* ── Sticky timer bar ── */}
      <div style={{
        position: 'sticky', top: 57, zIndex: 90,
        background: 'var(--white)', borderBottom: '1px solid var(--gray-200)',
        padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, borderRadius: 'var(--radius)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Discount expires in</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--red)' }}>{mm}:{ss}</div>
          <div style={{ fontSize: 10, color: 'var(--gray-500)' }}>min sec</div>
        </div>
        <button onClick={scrollToOrder} style={{ background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          Order now
        </button>
      </div>

      {/* ── NOW / GOAL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          {
            badge: 'NOW', badgeColor: 'var(--red)',
            img: 'https://fxrriqbkdtxttxykczqp.supabase.co/storage/v1/object/public/tools-illustrations/before_yell.jpg',
            stats: [
              { label: 'Anger level', val: 'High', bad: true, w: 82 },
              { label: 'Confidence', val: 'Insecure', bad: true, w: 22 },
              { label: 'Stress level', val: 'Overwhelmed', bad: true, w: 90 },
            ],
          },
          {
            badge: 'GOAL', badgeColor: 'var(--green)',
            img: 'https://fxrriqbkdtxttxykczqp.supabase.co/storage/v1/object/public/tools-illustrations/after_yell.jpg',
            stats: [
              { label: 'Anger level', val: 'Low', bad: false, w: 15 },
              { label: 'Confidence', val: 'Self-Assured', bad: false, w: 88 },
              { label: 'Stress level', val: 'Balanced', bad: false, w: 20 },
            ],
          },
        ].map(col => (
          <div key={col.badge} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <img src={col.img} alt={col.badge} style={{ width: '100%', height: 120, objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            <div style={{ padding: '10px 10px 12px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: col.badgeColor, marginBottom: 10 }}>{col.badge}</div>
              {col.stats.map(st => (
                <div key={st.label} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--gray-500)', marginBottom: 1 }}>{st.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: st.bad ? 'var(--red)' : 'var(--green)', marginBottom: 3 }}>{st.val}</div>
                  <div style={{ height: 3, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: st.w + '%', background: st.bad ? 'var(--red)' : 'var(--green)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA button ── */}
      <button onClick={scrollToOrder} style={{ display: 'block', width: '100%', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20 }}>
        Order now →
      </button>

      {/* ── Stats ── */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16, textAlign: 'center' }}>
        <span style={{ fontSize: 52, fontWeight: 800, color: 'var(--green)', display: 'block', lineHeight: 1 }}>87%</span>
        <span style={{ fontSize: 14, color: 'var(--gray-600)', fontWeight: 500, marginTop: 4, display: 'block', marginBottom: 16 }}>of parents reported major progress within 3 months</span>
        <div style={{ textAlign: 'left' }}>
          {[
            { pct: '73%', desc: 'noticed fewer outbursts and meltdowns' },
            { pct: '68%', desc: 'improved mornings with their children' },
            { pct: '75%', desc: 'started using simple strategies for focus and calm at home' },
          ].map(row => (
            <div key={row.pct} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)', minWidth: 44 }}>{row.pct}</span>
              <span style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.4 }}>{row.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Plan selector #1 ── */}
      <PlanSelectorCard {...planSelectorProps} planRef={orderRef} />

      {/* ── Money-back #1 ── */}
      <MoneyBackCard />

      {/* ── Press mentions ── */}
      <div style={{ background: '#2C3E50', borderRadius: 'var(--radius)', padding: 20, marginBottom: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 14 }}>Featured in media</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {[
            { label: 'common sense', style: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 } as React.CSSProperties },
            { label: 'CNN', style: { fontSize: 15, color: 'rgba(255,255,255,0.9)', fontWeight: 800, letterSpacing: '1px' } as React.CSSProperties },
            { label: '★ Trustpilot', style: { fontSize: 12, color: '#00B67A', fontWeight: 700 } as React.CSSProperties },
            { label: 'Aptoide', style: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 600 } as React.CSSProperties },
            { label: 'techeazi.com', style: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 400 } as React.CSSProperties },
          ].map(({ label, style }) => (
            <span key={label} style={style}>{label}</span>
          ))}
        </div>
      </div>

      {/* ── Award nomination ── */}
      <div style={{ background: 'var(--green-light)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>🏆</span>
        <p style={{ fontSize: 13, color: 'var(--gray-800)', lineHeight: 1.55, margin: 0 }}>
          <strong>NoYell.app</strong> has been nominated for <strong>Parenting App of the Year</strong> at the{' '}
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>International Family Association Awards</span>
        </p>
      </div>

      {/* ── App mockup ── */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 16 }}>Use NoYell anywhere</h3>
        <div style={{ display: 'inline-block', border: '8px solid var(--gray-800)', borderRadius: 32, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', maxWidth: 200 }}>
          <div style={{ background: 'var(--gray-800)', height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 48, height: 5, background: 'var(--gray-600)', borderRadius: 3 }} />
          </div>
          <div style={{ background: 'var(--gray-50)', padding: '16px 12px', minHeight: 280 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>NoYell Plan</div>
            <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 14 }}>Your parenting coach</div>
            <div style={{ background: 'var(--blue)', color: 'white', borderRadius: 8, padding: '8px 10px', fontSize: 11, fontWeight: 600, marginBottom: 8, textAlign: 'left' }}>
              Today&apos;s lesson ready ✓
            </div>
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 8, padding: '8px 10px', fontSize: 10, color: 'var(--gray-600)', marginBottom: 8, textAlign: 'left', lineHeight: 1.5 }}>
              🧠 Understanding your child&apos;s emotional triggers...
            </div>
            <div style={{ background: 'var(--green-light)', border: '1px solid var(--green)', borderRadius: 8, padding: '8px 10px', fontSize: 10, color: 'var(--green)', fontWeight: 600, textAlign: 'left' }}>
              ✓ Day 3 of 28 complete
            </div>
          </div>
        </div>
        {/* Nav dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 3, background: i === 0 ? 'var(--blue)' : 'var(--gray-300)' }} />
          ))}
        </div>
      </div>

      {/* ── Star ratings ── */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '20px 20px 16px', marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>4.8 stars</div>
        <div style={{ color: '#F59F00', fontSize: 22, letterSpacing: 2, margin: '8px 0 4px' }}>★★★★★</div>
        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>Based on 7,391 reviews</div>
        <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 14 }}>
          {STAR_RATINGS.map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--gray-700)', textAlign: 'left', flex: 1 }}>{r.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StarRow stars={r.stars} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)', minWidth: 24, textAlign: 'right' }}>{r.stars}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Video testimonials (first 2 only) ── */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', color: 'var(--gray-900)', marginBottom: 14 }}>
          Thousands of happy parents
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {VIDEO_URLS.slice(0, 2).map((url, i) => (
            <div
              key={i}
              onClick={() => setActiveVideo(url)}
              style={{ position: 'relative', cursor: 'pointer', borderRadius: 12, overflow: 'hidden', aspectRatio: '9/16', background: '#111' }}
            >
              <video src={url} preload="metadata" muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.18)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
                  <span style={{ fontSize: 18, marginLeft: 3 }}>▶</span>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 8, left: 8, color: '#F59F00', fontSize: 11, letterSpacing: 0.5 }}>★★★★★</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Text testimonials ── */}
      <div style={{ marginBottom: 16 }}>
        {TESTIMONIALS.map(t => (
          <div key={t.name} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '18px 20px', marginBottom: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 3 }}>{t.name}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', fontStyle: 'italic', marginBottom: 10 }}>{t.role}</div>
            <p style={{ fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>{t.text}</p>
          </div>
        ))}
      </div>

      {/* ── Plan selector #2 ── */}
      <PlanSelectorCard {...planSelectorProps} />

      {/* ── Money-back #2 ── */}
      <MoneyBackCard />

      {/* ── Video popup modal ── */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 360, width: '100%' }}>
            <video src={activeVideo} controls autoPlay playsInline style={{ width: '100%', borderRadius: 16, display: 'block', maxHeight: '80vh', objectFit: 'contain' }} />
            <button
              onClick={() => setActiveVideo(null)}
              style={{ position: 'absolute', top: -14, right: -14, width: 32, height: 32, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', fontFamily: 'inherit' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
