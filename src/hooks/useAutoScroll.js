import { useEffect, useRef } from 'react';

export function useAutoScroll(scrollRef, {
  speed = 0.5,        // pixels per frame — tune for desired flow speed
  resumeDelay = 1500,  // ms to wait after user interaction before resuming
} = {}) {
  const rafId = useRef(null);
  const isPaused = useRef(false);
  const resumeTimeout = useRef(null);
  const exactScrollLeft = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initialize the exact tracker with the current scroll position
    exactScrollLeft.current = el.scrollLeft;

    const tick = () => {
      if (!isPaused.current) {
        // Detect if we've hit the duplicated-content boundary and loop 
        // seamlessly — assumes card list is duplicated once (see note below)
        const maxScroll = el.scrollWidth / 2;
        if (el.scrollLeft >= maxScroll) {
          exactScrollLeft.current = 0;
          el.scrollLeft = 0;
        } else {
          exactScrollLeft.current += speed;
          el.scrollLeft = exactScrollLeft.current;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    const pause = () => {
      isPaused.current = true;
      clearTimeout(resumeTimeout.current);
    };

    const scheduleResume = () => {
      clearTimeout(resumeTimeout.current);
      resumeTimeout.current = setTimeout(() => {
        // Sync our exact tracker with wherever the user manually scrolled to
        exactScrollLeft.current = el.scrollLeft;
        isPaused.current = false;
      }, resumeDelay);
    };

    // Pause on any user-driven interaction; resume after a delay of no 
    // further interaction
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', scheduleResume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', scheduleResume);
    el.addEventListener('wheel', pause, { passive: true });
    el.addEventListener('wheel', scheduleResume, { passive: true });
    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerup', scheduleResume);

    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(resumeTimeout.current);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', scheduleResume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', scheduleResume);
      el.removeEventListener('wheel', pause);
      el.removeEventListener('wheel', scheduleResume);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('pointerup', scheduleResume);
    };
  }, [scrollRef, speed, resumeDelay]);
}
