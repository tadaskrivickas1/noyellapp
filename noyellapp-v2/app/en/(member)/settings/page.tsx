'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
        setDisplayName(user.user_metadata?.display_name || user.email || '');
      }
    });
    setNotifications(localStorage.getItem('notifications') === 'true');
  }, []);

  async function save() {
    setSaving(true);
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { display_name: displayName } });
    localStorage.setItem('notifications', String(notifications));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/en/login');
  }

  const LEGAL = [
    { label: 'Terms of Service', href: 'https://noyellplan.com/terms-and-conditions' },
    { label: 'Privacy Policy', href: 'https://noyellplan.com/privacy-policy' },
    { label: 'Money-back Guarantee', href: 'https://noyellplan.com/money-back' },
    { label: 'Subscription Terms', href: 'https://noyellplan.com/subscription-terms' },
    { label: 'Cookie Policy', href: 'https://noyellplan.com/cookie-policy' },
  ];

  return (
    <div style={{ padding: '24px 16px', paddingBottom: 80 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 24 }}>Settings</h1>

      {/* Account */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>👤</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Account</span>
        </div>
        <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 4 }}>Display name</label>
        <input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
        />
        <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 4 }}>Email</label>
        <input
          value={email}
          disabled
          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: '#fafafa', color: '#888', boxSizing: 'border-box' }}
        />
      </div>

      {/* Language */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>🌐</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Language</span>
        </div>
        <select style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box', outline: 'none' }}>
          <option value="en">English</option>
        </select>
      </div>

      {/* Notifications */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>🔔</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Notifications</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>Task unlock notifications</div>
            <div style={{ fontSize: 12, color: '#888' }}>Get notified when new tasks unlock</div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            style={{ width: 48, height: 28, borderRadius: 14, border: 'none', background: notifications ? '#3b4fd8' : '#ddd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
          >
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: notifications ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </button>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={save}
        disabled={saving}
        style={{ width: '100%', background: '#3b4fd8', color: '#fff', border: 'none', borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16, opacity: saving ? 0.7 : 1 }}
      >
        {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save changes'}
      </button>

      {/* About */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>ℹ️</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>About</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: '#666' }}>Version</span>
          <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>1.0.1</span>
        </div>
        {LEGAL.map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #f5f5f5', textDecoration: 'none', color: '#333', fontSize: 14 }}>
            {l.label}
            <span style={{ color: '#ccc' }}>›</span>
          </a>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        style={{ width: '100%', background: '#fff', color: '#e53e3e', border: '1.5px solid #fce8e8', borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        ↪ Sign out
      </button>
    </div>
  );
}
