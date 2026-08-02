import React, { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  baseOpacity = 0,
  enableBlur = true,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.scroll-reveal-word');
    if (!words.length) return;

    const tl = gsap.fromTo(
      words,
      {
        opacity: baseOpacity,
        rotation: baseRotation,
        filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
        y: 20,
      },
      {
        opacity: 1,
        rotation: 0,
        filter: 'blur(0px)',
        y: 0,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [baseOpacity, enableBlur, baseRotation, blurStrength]);

  const splitText = (text) => {
    return text.match(/\S+|\s+/g)?.map((word, index) => {
      if (word.trim() === '') {
        return <span key={index} style={{ whiteSpace: 'pre' }}>{word}</span>;
      }
      return (
        <span
          key={index}
          className={`scroll-reveal-word ${textClassName}`}
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
        >
          {word}
        </span>
      );
    });
  };

  const textContent = typeof children === 'string' ? children : 
                      Array.isArray(children) ? children.join('') : 
                      String(children);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      {splitText(textContent)}
    </div>
  );
};

export default ScrollReveal;
