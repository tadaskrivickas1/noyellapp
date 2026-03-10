'use client';

import { useState } from 'react';

interface HeroScreenProps {
  onSelectGender: (gender: 'boy' | 'girl') => void;
}

export default function HeroScreen({ onSelectGender }: HeroScreenProps) {
  const [selected, setSelected] = useState<'boy' | 'girl' | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);

  function handleSelect(g: 'boy' | 'girl') {
    setSelected(g);
    setTimeout(() => onSelectGender(g), 250);
  }

  return (
    <div className="screen-enter">
      <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3, textAlign: 'center', color: 'var(--gray-900)', marginBottom: 8 }}>
        Discover Your Child&apos;s{' '}
        <span style={{ color: 'var(--blue)' }}>Emotional Type</span>
      </h1>
      <p style={{ textAlign: 'center', fontSize: 15, color: 'var(--gray-700)', lineHeight: 1.55, marginBottom: 6 }}>
        Unlock the{' '}
        <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Emotion Regulation Map</span>
      </p>
      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.55, marginBottom: 20 }}>
        and get &ldquo;no yelling&rdquo; tools that match your child&apos;s nervous system.
      </p>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--gray-500)', marginBottom: 28, fontStyle: 'italic' }}>
        Get your result in 3 minutes.
      </p>
      <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 14 }}>
        My child is a:
      </p>

      {/* Gender cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {[
          { g: 'boy' as const, label: 'A boy', emoji: '👦' },
          { g: 'girl' as const, label: 'A girl', emoji: '👧' },
        ].map(({ g, label, emoji }) => (
          <div
            key={g}
            onClick={() => handleSelect(g)}
            style={{
              border: `1.5px solid ${selected === g ? 'var(--blue)' : 'var(--gray-200)'}`,
              borderRadius: 'var(--radius)',
              padding: '24px 16px 18px',
              textAlign: 'center',
              cursor: 'pointer',
              background: selected === g ? 'var(--blue-light)' : 'var(--white)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 10 }}>{emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Why we ask */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          style={{
            background: 'none', border: 'none',
            fontSize: 13, color: 'var(--blue)',
            cursor: 'pointer', fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'inherit',
          }}
        >
          Why we ask {whyOpen ? '▴' : '▾'}
        </button>
        {whyOpen && (
          <div style={{
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            fontSize: 13, color: 'var(--gray-600)',
            lineHeight: 1.55, textAlign: 'center', marginTop: 8,
          }}>
            Some emotional patterns show up differently in boys vs girls, so we can make your results more accurate.
          </div>
        )}
      </div>

      {/* Trust icons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 20 }}>
        {[
          { label: 'Research based', icon: '⭐' },
          { label: 'Answers stay private', icon: '🔒' },
          { label: 'Parent tested', icon: '👥' },
        ].map(({ label, icon }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
