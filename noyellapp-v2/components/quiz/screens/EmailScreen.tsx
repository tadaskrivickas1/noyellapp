'use client';

import { useState } from 'react';

interface EmailScreenProps {
  onSubmit: (email: string, nextScreen: string) => void;
}

export default function EmailScreen({ onSubmit }: EmailScreenProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState(false);

  function handleSubmit() {
    if (!email || !email.includes('@')) {
      setError(true);
      return;
    }
    setError(false);
    onSubmit(email, 'sales');
  }

  return (
    <div className="screen-enter">
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 28 }}>
        📧
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', color: 'var(--gray-900)', marginBottom: 6 }}>
        Where should we send the plan?
      </h2>
      <p style={{ fontSize: 14, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 24 }}>
        Enter your email to receive your child&apos;s custom No-Yell Plan.
      </p>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6, display: 'block' }}>
          Email address
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(false); }}
          style={{
            width: '100%', padding: '13px 14px',
            border: `1.5px solid ${error ? 'var(--red)' : 'var(--gray-300)'}`,
            borderRadius: 'var(--radius)',
            fontFamily: 'inherit', fontSize: 15, color: 'var(--gray-900)',
            outline: 'none', background: 'white',
          }}
        />
      </div>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.45, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          style={{ marginTop: 2, accentColor: 'var(--blue)', flexShrink: 0 }}
        />
        I agree to receive helpful parenting tips and product updates via email. You can unsubscribe anytime.
      </label>

      <button
        onClick={handleSubmit}
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

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        🔒 Your information is secure and private
      </p>
    </div>
  );
}
