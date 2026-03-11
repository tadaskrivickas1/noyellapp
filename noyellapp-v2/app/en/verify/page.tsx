'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const router = useRouter();

  useEffect(() => { refs[0].current?.focus(); }, []);

  function handleChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 7) refs[i + 1].current?.focus();
    if (next.every(d => d)) submitCode(next.join(''));
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (!pasted) return;
    const next = ['', '', '', '', '', '', '', ''];
    pasted.split('').forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 7);
    refs[focusIdx].current?.focus();
    if (pasted.length === 8) submitCode(pasted);
  }

  async function submitCode(code: string) {
    const email = sessionStorage.getItem('otp_email') || '';
    if (!email) { setError('Session expired. Please log in again.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error) {
      setError('Invalid or expired code. Please try again.');
      setDigits(['', '', '', '', '', '', '', '']);
      refs[0].current?.focus();
      setLoading(false);
    } else {
      router.push('/en/home');
    }
  }

  async function resend() {
    const email = sessionStorage.getItem('otp_email') || '';
    if (!email) return;
    const supabase = createClient();
    await supabase.auth.signInWithOtp({ email });
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, background: '#3b4fd8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🕊️</div>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>NoYell</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Enter your code</h1>
        <p style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 28, lineHeight: 1.5 }}>
          We sent an 8-digit code to<br />
          <strong>{typeof window !== 'undefined' ? (sessionStorage.getItem('otp_email') || 'your email') : 'your email'}</strong>
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              style={{ width: 44, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 700, border: '2px solid', borderColor: d ? '#3b4fd8' : '#e5e7eb', borderRadius: 10, outline: 'none', fontFamily: 'inherit' }}
            />
          ))}
        </div>

        {error && <p style={{ color: '#e53e3e', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{error}</p>}
        {resent && <p style={{ color: '#22a34a', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>Code resent!</p>}

        {loading && <p style={{ textAlign: 'center', fontSize: 14, color: '#888' }}>Verifying...</p>}

        <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 16 }}>
          Didn&apos;t receive it?{' '}
          <button onClick={resend} style={{ background: 'none', border: 'none', color: '#3b4fd8', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
            Resend code
          </button>
        </p>
        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 8 }}>
          <a href="/en/login" style={{ color: '#888', textDecoration: 'none' }}>← Back to login</a>
        </p>
      </div>
    </div>
  );
}
