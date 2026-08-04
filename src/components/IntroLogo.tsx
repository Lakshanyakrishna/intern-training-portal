import { useEffect, useState } from 'react';
import lumoraLogo from '../assets/lumora-logo.png';
import DecryptedText from './DecryptedText';
import StickerPeel from './StickerPeel';

type Phase = 'enter' | 'confused' | 'confident' | 'settled';

const TIMINGS: Record<Exclude<Phase, 'settled'>, number> = {
  enter: 300,
  confused: 2000,
  confident: 2200,
};

/** Total time from mount to the "settled" corner mark — Home uses this to hold off
 * showing anything else until the intro has fully played and shrunk into place. */
export const INTRO_TOTAL_MS = TIMINGS.enter + TIMINGS.confused + TIMINGS.confident;

interface IntroLogoProps {
  /** Play the confused→confident entrance sequence. Off shows the settled mark immediately —
   * use that on every page except Home, where replaying the intro on each visit would be noise. */
  animate?: boolean;
}

export default function IntroLogo({ animate = true }: IntroLogoProps) {
  const [phase, setPhase] = useState<Phase>(animate ? 'enter' : 'settled');

  useEffect(() => {
    if (!animate) return;
    const t1 = setTimeout(() => setPhase('confused'), TIMINGS.enter);
    const t2 = setTimeout(() => setPhase('confident'), TIMINGS.enter + TIMINGS.confused);
    const t3 = setTimeout(() => setPhase('settled'), TIMINGS.enter + TIMINGS.confused + TIMINGS.confident);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [animate]);

  const settled = phase === 'settled';
  const visible = phase !== 'enter';

  return (
    <div
      className={`fixed z-30 flex items-center transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
        settled ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        transitionDuration: settled ? '900ms' : '600ms',
        left: settled ? '1.75rem' : '50%',
        top: settled ? '1.75rem' : '50%',
        transform: settled ? 'translate(0, 0)' : 'translate(-50%, -50%)',
        gap: settled ? '0.75rem' : '0.9rem',
      }}
    >
      {settled ? (
        <div style={{ width: '52px', height: '52px', position: 'relative' }} className="shrink-0">
          <StickerPeel
            imageSrc={lumoraLogo}
            width={52}
            rotate={15}
            peelBackHoverPct={25}
            peelBackActivePct={45}
            shadowIntensity={0.5}
            lightingIntensity={0.15}
            initialPosition="center"
          />
        </div>
      ) : (
        <img
          src={lumoraLogo}
          alt="Lumora"
          className="transition-all ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0"
          style={{
            width: '56px',
            height: '56px',
            opacity: visible ? 1 : 0,
            transitionDuration: '500ms',
            filter: 'drop-shadow(0 0 12px rgba(198,202,201,0.35))',
          }}
        />
      )}
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
          <DecryptedText
            key={phase === 'confident' ? 'confident' : 'confused'}
            text={phase === 'confident' ? 'confident' : 'confused'}
            animateOn="view"
            sequential
            revealDirection="start"
            speed={70}
            maxIterations={14}
            className="text-[#F1F2EE]"
            encryptedClassName="text-[#9AA1A3]"
            parentClassName="text-[28px] font-semibold tracking-tight whitespace-nowrap"
          />
        )}
      </div>
    </div>
  );
}
