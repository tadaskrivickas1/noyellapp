'use client';

import { InsightData } from '@/lib/quiz-types';

interface InsightScreenProps {
  insight: InsightData;
  onContinue: (nextScreen: string) => void;
}

export default function InsightScreen({ insight, onContinue }: InsightScreenProps) {
  return (
    <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 20 }}>
      <div style={{
        width: 96, height: 96, borderRadius: 22,
        background: insight.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28, fontSize: 50,
      }}>
        {insight.iconEmoji}
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35, color: 'var(--gray-900)', marginBottom: 14 }}>
        {insight.title}
      </h2>

      <div style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.65, marginBottom: 32, maxWidth: 420, width: '100%' }}>
        {insight.body.split('\n').map((line, i) => (
          <p key={i} style={{ marginBottom: line === '' ? 0 : 8 }}>{line || <br />}</p>
        ))}

        {insight.checkList && (
          <ul style={{ listStyle: 'none', textAlign: 'left', margin: '16px auto 0', padding: 0, maxWidth: 300 }}>
            {insight.checkList.map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, fontSize: 15, color: 'var(--gray-800)' }}>
                <span style={{ color: 'var(--green)', fontSize: 17, fontWeight: 700, flexShrink: 0, width: 20 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => onContinue(insight.nextScreen)}
        style={{
          display: 'block', width: '100%',
          background: 'var(--blue)', color: 'white',
          border: 'none', borderRadius: 'var(--radius)',
          padding: 16, fontSize: 16, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          marginTop: insight.checkList ? 32 : 0,
        }}
      >
        {insight.buttonLabel ?? 'Continue'}
      </button>
    </div>
  );
}
