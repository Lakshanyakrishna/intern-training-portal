import { useEffect, useState } from 'react';
import lumoraLogo from '../assets/lumora-logo.png';

type Phase = 'enter' | 'confused' | 'confident' | 'settled';

const TIMINGS: Record<Exclude<Phase, 'settled'>, number> = {
  enter: 300,
  confused: 1100,
  confident: 1300,
};

export default function IntroLogo() {
  const [phase, setPhase] = useState<Phase>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('confused'), TIMINGS.enter);
    const t2 = setTimeout(() => setPhase('confident'), TIMINGS.enter + TIMINGS.confused);
    const t3 = setTimeout(() => setPhase('settled'), TIMINGS.enter + TIMINGS.confused + TIMINGS.confident);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const settled = phase === 'settled';
  const visible = phase !== 'enter';

  return (
    <div
      className="fixed z-30 pointer-events-none flex items-center transition-all ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        transitionDuration: settled ? '900ms' : '600ms',
        left: settled ? '1.75rem' : '50%',
        top: settled ? '1.75rem' : '50%',
        transform: settled ? 'translate(0, 0)' : 'translate(-50%, -50%)',
        gap: settled ? '0.75rem' : '0.9rem',
      }}
    >
      <img
        src={lumoraLogo}
        alt="Lumora"
        className="transition-all ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0"
        style={{
          width: settled ? '52px' : '56px',
          height: settled ? '52px' : '56px',
          opacity: visible ? 1 : 0,
          transitionDuration: settled ? '900ms' : '500ms',
          filter: 'drop-shadow(0 0 12px rgba(198,202,201,0.35))',
        }}
      />
      <div
        className="relative overflow-hidden transition-all ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          height: settled ? '34px' : '32px',
          opacity: visible ? 1 : 0,
          transitionDuration: settled ? '900ms' : '500ms',
        }}
      >
        {settled ? (
          <span className="text-[24px] font-semibold tracking-wide" style={{ color: '#F1F2EE' }}>
            Lumora
          </span>
        ) : (
          <span
            className="font-semibold tracking-tight whitespace-nowrap"
            style={{ color: '#F1F2EE', fontSize: '28px' }}
          >
            conf
            <span className="relative inline-block" style={{ height: '1em', verticalAlign: 'top', overflow: 'hidden', width: '3.1ch' }}>
              <span
                className="absolute inset-0 transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{
                  transitionDuration: '550ms',
                  transform: phase === 'confident' ? 'translateY(-100%)' : 'translateY(0)',
                  color: '#9AA1A3',
                }}
              >
                used
              </span>
              <span
                className="absolute inset-0 transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{
                  transitionDuration: '550ms',
                  transform: phase === 'confident' ? 'translateY(0)' : 'translateY(100%)',
                  color: '#F1F2EE',
                }}
              >
                ident
              </span>
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
