'use client';

import { QUIZ_SCREENS, ScreenId } from '@/lib/quiz-types';

interface QuizShellProps {
  currentScreen: ScreenId;
  onBack: () => void;
  children: React.ReactNode;
}

export default function QuizShell({ currentScreen, onBack, children }: QuizShellProps) {
  const idx = QUIZ_SCREENS.indexOf(currentScreen);
  const showProgress = idx > 0;
  const progress = showProgress ? (idx / (QUIZ_SCREENS.length - 1)) * 100 : 0;

  return (
    <>
      {/* Rating banner */}
      <div style={{
        background: '#22A34A',
        color: 'white',
        textAlign: 'center',
        padding: '10px 16px',
        fontSize: 14,
        fontWeight: 500,
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 200,
      }}>
        <span style={{ color: '#FFD700', marginRight: 4 }}>★★★★★</span>
        4.8/5 &nbsp;·&nbsp; Trusted by 150K+ parents
      </div>

      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 38, left: 0, right: 0,
        zIndex: 100,
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
        padding: '14px 24px',
      }}>
        <div style={{ maxWidth: 'var(--max)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32,
              background: 'var(--blue)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 16,
            }}>🕊️</div>
            NoYell
          </div>
        </div>
      </header>

      {/* Progress bar */}
      {showProgress && (
        <div style={{
          position: 'fixed',
          top: 97, left: 0, right: 0,
          zIndex: 99,
          background: 'var(--white)',
          padding: '0 24px',
        }}>
          <div style={{ maxWidth: 'var(--max)', margin: '0 auto' }}>
            <div style={{ height: 4, background: 'var(--gray-200)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'var(--blue)',
                borderRadius: 4,
                width: `${progress}%`,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      {showProgress && (
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: 105,
            left: `max(16px, calc(50% - (var(--max) / 2)))`,
            zIndex: 98,
            background: 'none', border: 'none',
            cursor: 'pointer',
            color: 'var(--gray-600)',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 14,
            fontFamily: 'inherit',
            padding: '6px 4px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Main content */}
      <main style={{
        maxWidth: 'var(--max)',
        margin: '0 auto',
        padding: '130px 24px 80px',
        minHeight: '100vh',
        position: 'relative',
      }}>
        {children}
      </main>
    </>
  );
}
