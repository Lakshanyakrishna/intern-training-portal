import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import {
  motion,
  animate,
  motionValue,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'motion/react';
import './SuccessStoriesWall.css';

export type SuccessStory = {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLetter: string;
  companyColor: string;
  quote: string;
  avatarInitials: string;
  avatarGradient: string;
};

type SuccessStoriesWallProps = {
  stories: SuccessStory[];
  className?: string;
};

type FloatEntry = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  phase: number;
};

const DRIFT_SPEED = 22;
const MIN_COPIES = 2;
const COPY_HEADROOM = 2;
const SCROLL_STEP = 380;

const springTransition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 28,
};

const scrollSpring = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 22,
  mass: 0.8,
};

function StoryCard({
  story,
  floatX,
  floatY,
  onHoverStart,
  onHoverEnd,
}: {
  story: SuccessStory;
  floatX: MotionValue<number>;
  floatY: MotionValue<number>;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <motion.div
      className="ssw__card-wrap"
      style={{ x: floatX, y: floatY }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <motion.article
        className="ssw__card cursor-target"
        whileHover={{
          scale: 1.03,
          y: -8,
          boxShadow:
            '0 20px 60px rgba(133, 141, 145, 0.25), 0 0 40px rgba(133, 141, 145, 0.12), 0 4px 24px rgba(26, 26, 26, 0.08)',
        }}
        transition={springTransition}
      >
        <div className="ssw__card-header">
          <div className="ssw__card-profile">
            <div
              className={`ssw__avatar bg-gradient-to-br ${story.avatarGradient}`}
              aria-hidden="true"
            >
              {story.avatarInitials}
            </div>
            <div className="min-w-0">
              <div className="ssw__name">{story.name}</div>
              <div className="ssw__role">
                {story.role} · {story.company}
              </div>
            </div>
          </div>
          <div
            className={`ssw__company-badge ${story.companyColor}`}
            title={story.company}
            aria-label={story.company}
          >
            {story.companyLetter}
          </div>
        </div>
        <p className="ssw__quote">
          <span className="ssw__quote-mark" aria-hidden="true">
            "
          </span>
          {story.quote}
        </p>
      </motion.article>
    </motion.div>
  );
}

function createFloatEntries(count: number): FloatEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    x: motionValue(0),
    y: motionValue(0),
    phase: (i / count) * Math.PI * 2,
  }));
}

function SuccessStoriesWallComponent({ stories, className }: SuccessStoriesWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const [hoverCount, setHoverCount] = useState(0);

  const autoOffset = useMotionValue(0);
  const manualOffset = useMotionValue(0);
  const seqWidthRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const hoverCountRef = useRef(0);

  const floatEntries = useMemo(
    () => createFloatEntries(stories.length),
    [stories.length]
  );

  const reducedMotionRef = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const trackX = useTransform([autoOffset, manualOffset], ([auto, manual]: number[]) => {
    const width = seqWidthRef.current;
    const total = auto + manual;
    if (width <= 0) return -total;
    const wrapped = ((total % width) + width) % width;
    return -wrapped;
  });

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = setRef.current?.getBoundingClientRect();
    const sequenceWidth = sequenceRect?.width ?? 0;

    if (sequenceWidth > 0) {
      const rounded = Math.ceil(sequenceWidth);
      seqWidthRef.current = rounded;
      setSeqWidth(rounded);
      const copiesNeeded =
        Math.ceil(containerWidth / sequenceWidth) + COPY_HEADROOM;
      setCopyCount(Math.max(MIN_COPIES, copiesNeeded));
    }
  }, []);

  useEffect(() => {
    hoverCountRef.current = hoverCount;
  }, [hoverCount]);

  useEffect(() => {
    updateDimensions();

    if (!window.ResizeObserver) {
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }

    const observers: ResizeObserver[] = [];
    [containerRef, setRef].forEach((ref) => {
      if (ref.current) {
        const observer = new ResizeObserver(updateDimensions);
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [updateDimensions, stories]);

  useEffect(() => {
    if (seqWidth > 0) {
      const current = autoOffset.get();
      autoOffset.set(((current % seqWidth) + seqWidth) % seqWidth);
    }
  }, [seqWidth, autoOffset]);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
        startTimeRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const width = seqWidthRef.current;

      if (!reducedMotionRef.current && hoverCountRef.current === 0 && width > 0) {
        const next = autoOffset.get() + DRIFT_SPEED * deltaTime;
        autoOffset.set(((next % width) + width) % width);
      }

      if (!reducedMotionRef.current) {
        floatEntries.forEach(({ x, y, phase }) => {
          y.set(Math.sin(elapsed * 0.4 + phase) * 6);
          x.set(Math.cos(elapsed * 0.25 + phase) * 3);
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [autoOffset, floatEntries]);

  const handleHoverStart = useCallback(() => {
    setHoverCount((c) => c + 1);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoverCount((c) => Math.max(0, c - 1));
  }, []);

  const scrollBy = useCallback(
    (direction: 'left' | 'right') => {
      const delta = direction === 'left' ? -SCROLL_STEP : SCROLL_STEP;
      animate(manualOffset, manualOffset.get() + delta, scrollSpring);
    },
    [manualOffset]
  );

  return (
    <div
      className={['ssw', className].filter(Boolean).join(' ')}
      role="region"
      aria-label="Student success stories"
    >
      <div className="ssw__viewport" ref={containerRef}>
        <button
          type="button"
          className="ssw__nav ssw__nav--left cursor-target"
          aria-label="Scroll stories left"
          onClick={() => scrollBy('left')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <motion.div className="ssw__track" style={{ x: trackX }}>
          {Array.from({ length: copyCount }, (_, copyIndex) => (
            <div
              key={`copy-${copyIndex}`}
              className="ssw__set"
              ref={copyIndex === 0 ? setRef : undefined}
              aria-hidden={copyIndex > 0 || undefined}
            >
              {stories.map((story, i) => (
                <StoryCard
                  key={`${copyIndex}-${story.id}`}
                  story={story}
                  floatX={floatEntries[i].x}
                  floatY={floatEntries[i].y}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                />
              ))}
            </div>
          ))}
        </motion.div>

        <button
          type="button"
          className="ssw__nav ssw__nav--right cursor-target"
          aria-label="Scroll stories right"
          onClick={() => scrollBy('right')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const SuccessStoriesWall = memo(SuccessStoriesWallComponent);
SuccessStoriesWall.displayName = 'SuccessStoriesWall';

export default SuccessStoriesWall;
