'use client';

interface SocialScreenProps {
  onContinue: (nextScreen: string) => void;
}

export default function SocialScreen({ onContinue }: SocialScreenProps) {
  return (
    <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35, color: 'var(--gray-900)', marginBottom: 16 }}>
        You&apos;re not alone — thousands of parents feel this way too.
      </h2>

      {/* Stats */}
      <div style={{
        display: 'flex', gap: 0,
        background: 'var(--white)', border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
        marginBottom: 16, width: '100%',
      }}>
        {[
          { num: '38,000+', label: 'Parents across Europe in our community' },
          { num: '27', label: 'Daily activities this month' },
        ].map((item, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', padding: '14px 10px',
            borderRight: i === 0 ? '1px solid var(--gray-200)' : 'none',
          }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)', display: 'block' }}>{item.num}</span>
            <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500, lineHeight: 1.3, display: 'block', marginTop: 2 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      {[
        { initials: 'LP', name: 'Laura P.', meta: 'mom of 2 girls', text: '"I started understanding my child better from the first parenting advice. I highly recommend it to every parent."' },
        { initials: 'AK', name: 'Agre K.', meta: 'mom of a son (7)', text: '"It was wonderful to discover this. I can recommend it to every parent."' },
      ].map(review => (
        <div key={review.name} style={{
          background: 'var(--white)', border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius)', padding: '14px 16px',
          textAlign: 'left', marginBottom: 12, width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--blue-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'var(--blue)', flexShrink: 0,
            }}>
              {review.initials}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{review.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{review.meta}</div>
            </div>
          </div>
          <div style={{ color: '#F59F00', fontSize: 13, letterSpacing: 1, marginBottom: 6 }}>★★★★★</div>
          <p style={{ fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.5 }}>{review.text}</p>
        </div>
      ))}

      <button
        onClick={() => onContinue('q11')}
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
    </div>
  );
}
