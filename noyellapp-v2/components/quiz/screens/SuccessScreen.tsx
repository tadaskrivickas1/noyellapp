'use client';

export default function SuccessScreen() {
  return (
    <div className="screen-enter" style={{ textAlign: 'center', paddingTop: 30 }}>
      <span style={{ fontSize: 64, display: 'block', marginBottom: 20 }}>🕊️</span>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 10 }}>
        Welcome to NoYell.app!
      </h2>
      <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 28 }}>
        Your 28-day No-Yell Plan is ready.<br />Check your email for login details.
      </p>
      <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: 20, textAlign: 'left', marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 14 }}>What happens next</div>
        {[
          'Check your inbox — welcome email from hello@noyellplan.com',
          'Download NoYell.app on your phone',
          'Start Day 1 of your personalized 28-day plan',
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, fontSize: 14, color: 'var(--gray-700)' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--blue)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {i + 1}
            </div>
            {step}
          </div>
        ))}
      </div>
      <a
        href="https://noyell.app"
        style={{
          display: 'block', width: '100%',
          background: 'var(--blue)', color: 'white',
          borderRadius: 'var(--radius)', padding: 16,
          fontSize: 16, fontWeight: 600,
          textDecoration: 'none', textAlign: 'center',
        }}
      >
        Go to NoYell.app →
      </a>
    </div>
  );
}
