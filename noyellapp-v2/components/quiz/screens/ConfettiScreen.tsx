'use client';

import { useEffect } from 'react';

interface ConfettiScreenProps {
  onDone: () => void;
}

export default function ConfettiScreen({ onDone }: ConfettiScreenProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="confetti-pop" style={{
        width: 90, height: 90, borderRadius: '50%',
        background: 'var(--gray-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 44,
      }}>
        🎉
      </div>
    </div>
  );
}
