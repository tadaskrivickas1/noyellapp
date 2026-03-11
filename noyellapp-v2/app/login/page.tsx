'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      sessionStorage.setItem('otp_email', email);
      router.push('/verify');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 40, height: 40, background: '#3b4fd8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🕊️</div>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>NoYell</span>
      </div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 32 }}>Expert-backed child behavior insights</p>

      {/* Card */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Welcome back</h1>
        <p style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
          Enter your email to receive a 6-digit verification code
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 6 }}>Email</label>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>✉️</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {error && <p style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#3b4fd8', color: '#fff', border: 'none', borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Sending...' : 'Continue'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
          Don&apos;t have an account?{' '}
          <a href="/onboarding" style={{ color: '#3b4fd8', fontWeight: 600, textDecoration: 'none' }}>Start</a>
        </p>
      </div>
    </div>
  );
}
