'use client';

import { useState, useRef, useEffect } from 'react';
import { Question } from '@/lib/quiz-types';

interface QuestionScreenProps {
  question: Question;
  savedAnswer?: string | string[];
  onAnswer: (value: string | string[], nextScreen: string) => void;
}

export default function QuestionScreen({ question, savedAnswer, onAnswer }: QuestionScreenProps) {
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(savedAnswer) ? savedAnswer : savedAnswer ? [savedAnswer] : []
  );
  const [sliderValue, setSliderValue] = useState(question.sliderDefault ?? 5);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      const pct = ((sliderValue - (question.sliderMin ?? 1)) / ((question.sliderMax ?? 10) - (question.sliderMin ?? 1))) * 100;
      sliderRef.current.style.setProperty('--pct', pct + '%');
    }
  }, [sliderValue, question.sliderMin, question.sliderMax]);

  const TOTAL = 14;

  function resolveNext(val: string): string {
    const next = question.nextScreen;
    return typeof next === 'function' ? next(val) : next;
  }

  function pickSingle(val: string) {
    setSelected([val]);
    setTimeout(() => onAnswer(val, resolveNext(val)), 280);
  }

  function pickYesNo(val: string) {
    setSelected([val]);
    setTimeout(() => onAnswer(val, resolveNext(val)), 280);
  }

  function toggleMulti(val: string) {
    setSelected(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  }

  function submitMulti() {
    const next = resolveNext('');
    onAnswer(selected, next);
  }

  function submitSlider() {
    const next = resolveNext(String(sliderValue));
    onAnswer(String(sliderValue), next);
  }

  function handlePulse() {
    const next = resolveNext('yes');
    onAnswer('yes', next);
  }

  const isYesNo = question.type === 'yesno';
  const yesNoOptions = question.options ?? [
    { value: 'yes', label: 'Yes', emoji: '👍' },
    { value: 'no', label: 'No', emoji: '👎' },
  ];

  return (
    <div className="screen-enter">
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-500)', fontWeight: 500, marginBottom: 10, letterSpacing: '0.3px' }}>
        Question {question.number} of {TOTAL}
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, textAlign: 'center', color: 'var(--gray-900)', marginBottom: 8 }}>
        {question.title}
      </h2>
      {question.subtitle && (
        <p style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
          {question.subtitle}
        </p>
      )}

      {/* Single select (list) */}
      {question.type === 'single' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {question.options?.map(opt => (
            <div
              key={opt.value}
              onClick={() => pickSingle(opt.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px',
                border: `1.5px solid ${selected.includes(opt.value) ? 'var(--blue)' : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                background: selected.includes(opt.value) ? 'var(--blue-light)' : 'var(--white)',
                fontSize: 15, fontWeight: 500, color: 'var(--gray-800)',
                transition: 'all 0.18s',
              }}
            >
              {opt.emoji && <span style={{ fontSize: 20, width: 24, textAlign: 'center', flexShrink: 0 }}>{opt.emoji}</span>}
              <span style={{ flex: 1 }}>{opt.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Multi select */}
      {question.type === 'multi' && (
        <>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-500)', marginBottom: 14 }}>
            Select all that apply
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {question.options?.map(opt => (
              <div
                key={opt.value}
                onClick={() => toggleMulti(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px',
                  border: `1.5px solid ${selected.includes(opt.value) ? 'var(--blue)' : 'var(--gray-200)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  background: selected.includes(opt.value) ? 'var(--blue-light)' : 'var(--white)',
                  fontSize: 15, fontWeight: 500, color: 'var(--gray-800)',
                  transition: 'all 0.18s',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 22, height: 22, borderRadius: 5,
                  border: `2px solid ${selected.includes(opt.value) ? 'var(--blue)' : 'var(--gray-300)'}`,
                  background: selected.includes(opt.value) ? 'var(--blue)' : 'var(--white)',
                  flexShrink: 0, position: 'relative',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected.includes(opt.value) && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l2.5 2.5 5.5-5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {opt.emoji && <span style={{ fontSize: 20, width: 24, textAlign: 'center', flexShrink: 0 }}>{opt.emoji}</span>}
                <span style={{ flex: 1 }}>{opt.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={submitMulti}
            style={{
              display: 'block', width: '100%',
              background: 'var(--blue)', color: 'white',
              border: 'none', borderRadius: 'var(--radius)',
              padding: 16, fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background 0.2s',
            }}
          >
            Continue
          </button>
        </>
      )}

      {/* Yes/No */}
      {isYesNo && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {yesNoOptions.map(opt => (
              <div
                key={opt.value}
                onClick={() => pickYesNo(opt.value)}
                style={{
                  border: `1.5px solid ${selected.includes(opt.value) ? 'var(--blue)' : 'var(--gray-200)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '20px 12px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: selected.includes(opt.value) ? 'var(--blue-light)' : 'var(--white)',
                  transition: 'all 0.18s',
                }}
              >
                <div style={{ fontSize: 38, marginBottom: 10 }}>{opt.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)' }}>{opt.label}</div>
              </div>
            ))}
          </div>
          {question.whyNote && (
            <div style={{
              background: 'var(--gray-50)', borderRadius: 'var(--radius)',
              padding: '11px 14px', fontSize: 12.5, color: 'var(--gray-500)',
              lineHeight: 1.5, marginBottom: 20, textAlign: 'center',
            }}>
              📍 {question.whyNote}
            </div>
          )}
        </>
      )}

      {/* Slider */}
      {question.type === 'slider' && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', fontSize: 52, fontWeight: 800, color: 'var(--blue)', lineHeight: 1, marginBottom: 20 }}>
            {sliderValue} <span style={{ fontSize: 20, color: 'var(--gray-400)', fontWeight: 500 }}>/ {question.sliderMax}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{question.sliderEmojiMin}</span>
            <input
              ref={sliderRef}
              type="range"
              min={question.sliderMin}
              max={question.sliderMax}
              value={sliderValue}
              onChange={e => setSliderValue(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 20 }}>{question.sliderEmojiMax}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--gray-500)', fontWeight: 500, marginBottom: 24 }}>
            <span>{question.sliderLabelMin}</span>
            <span>{question.sliderLabelMax}</span>
          </div>
          <button
            onClick={submitSlider}
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
      )}

      {/* Pulse (last question) */}
      {question.type === 'pulse' && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handlePulse}
            className="pulse-btn"
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              width: 160, height: 160, borderRadius: '50%',
              background: 'var(--blue)', color: 'white',
              border: 'none', fontSize: 20, fontWeight: 700,
              cursor: 'pointer', margin: '30px auto 0',
              gap: 4, fontFamily: 'inherit',
            }}
          >
            YES
            <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>I&apos;m ready</span>
          </button>
        </div>
      )}

      {/* Why note for non-yesno questions */}
      {!isYesNo && question.whyNote && (
        <div style={{
          background: 'var(--gray-50)', borderRadius: 'var(--radius)',
          padding: '11px 14px', fontSize: 12.5, color: 'var(--gray-500)',
          lineHeight: 1.5, marginTop: 8, marginBottom: 20, textAlign: 'center',
        }}>
          📍 {question.whyNote}
        </div>
      )}
    </div>
  );
}
