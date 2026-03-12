'use client';

import { useState } from 'react';
import { PLAN_DATA } from '@/lib/quiz-types';

interface CheckoutScreenProps {
  plan: '1wk' | '4wk' | '12wk';
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function CheckoutScreen({ plan, email, onBack, onSuccess }: CheckoutScreenProps) {
  const [loading, setLoading] = useState(false);
  const d = PLAN_DATA[plan];

  async function handlePay() {
    setLoading(true);
    // Demo mode — simulate payment processing delay
    await new Promise(r => setTimeout(r, 2200));
    // User is not authenticated yet — store in pending_access via server route
    await fetch('/api/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan_type: plan }),
    });
    onSuccess();
  }

  return (
    <div className="screen-enter">
      {/* 3-step progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24, padding: '0 20px' }}>
        {['Select plan', 'Payment', 'Profile'].map((label, i) => (
          <div key={label} style={{ display: 'contents' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? 'var(--green)' : i === 1 ? 'var(--blue)' : 'var(--gray-300)' }} />
              <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 500, textAlign: 'center' }}>{label}</div>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: i === 0 ? 'var(--green)' : 'var(--gray-200)', margin: '0 4px', alignSelf: 'flex-start', marginTop: 4 }} />}
          </div>
        ))}
      </div>

      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--blue)', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', padding: 0, marginBottom: 18 }}>
        ← Back
      </button>

      {/* Order summary */}
      <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 16 }}>
        {[
          { label: d.label, value: <><s style={{ color: 'var(--gray-400)', marginRight: 6 }}>{d.orig}</s><strong>{d.price}</strong></>, },
          { label: "Today's total", value: <strong>{d.total}</strong> },
          { label: d.renewal, value: '', small: true },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', fontSize: row.small ? 12 : 14, color: row.small ? 'var(--gray-500)' : 'var(--gray-700)', borderBottom: i < 2 ? '1px solid var(--gray-100)' : 'none' }}>
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center', lineHeight: 1.5, marginBottom: 18 }}>
        Pay securely. Your subscription will be activated immediately after payment.
      </p>

      {/* Card form (demo placeholders) */}
      <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: 18, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)' }}>Payment card</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {['VISA', 'MC', 'AMEX'].map(b => (
              <span key={b} style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-500)', border: '1px solid var(--gray-200)', borderRadius: 4, padding: '2px 5px' }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Demo card fields */}
        {[
          { placeholder: '4242 4242 4242 4242', label: 'Card number' },
        ].map(field => (
          <div key={field.label} style={{ border: '1.5px solid var(--gray-300)', borderRadius: 8, padding: '13px 14px', background: 'var(--white)', marginBottom: 12, minHeight: 46 }}>
            <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>{field.placeholder}</span>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {['MM / YY', 'CVC'].map(ph => (
            <div key={ph} style={{ border: '1.5px solid var(--gray-300)', borderRadius: 8, padding: '13px 14px', background: 'var(--white)', minHeight: 46 }}>
              <span style={{ fontSize: 14, color: 'var(--gray-400)' }}>{ph}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', background: 'var(--blue)', color: 'white',
            border: 'none', borderRadius: 'var(--radius)', padding: 16,
            fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <><span className="spinner" /> Processing…</>
          ) : (
            <>🔒 Pay {d.total}</>
          )}
        </button>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--green)', fontWeight: 500, marginTop: 8 }}>✓ Secure payment</p>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', marginTop: 8 }}>🔒 All transactions are secure and encrypted</p>
      </div>
    </div>
  );
}
