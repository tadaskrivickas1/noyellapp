'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NoAccessPage() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/en/login');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, background: '#3b4fd8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🕊️</div>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>NoYell</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '36px 28px', width: '100%', maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 10 }}>Access required</h1>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 28 }}>
          Your account doesn&apos;t have an active plan.<br />
          Complete the quiz to choose and activate your plan.
        </p>

        <button
          onClick={() => router.push('/en/onboarding')}
          style={{ width: '100%', background: '#3b4fd8', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}
        >
          Get started →
        </button>

        <button
          onClick={signOut}
          style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
