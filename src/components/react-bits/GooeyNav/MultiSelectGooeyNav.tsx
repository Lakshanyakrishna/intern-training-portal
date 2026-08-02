import React, { useRef, useEffect, useState } from 'react';
import './GooeyNav.css';

interface NavItem {
  label: string;
  icon?: React.ReactNode;
}

interface MultiSelectGooeyNavProps {
  items: NavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: number[];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  activeIndices?: number[];
  onChange?: (activeIndices: number[]) => void;
}

const noise = (n = 1) => n / 2 - Math.random() * n;
const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
  const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
};

const ActiveEffect = ({
  liElement,
  containerElement,
  animationTime,
  particleCount,
  particleDistances,
  particleR,
  timeVariance,
  colors,
}: {
  liElement: HTMLLIElement;
  containerElement: HTMLDivElement;
  animationTime: number;
  particleCount: number;
  particleDistances: number[];
  particleR: number;
  timeVariance: number;
  colors: number[];
}) => {
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const createParticle = (i: number, t: number, d: number[], r: number) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updatePosition = () => {
    if (!filterRef.current || !textRef.current || !liElement) return;

    const styles = {
      left: `${liElement.offsetLeft}px`,
      top: `${liElement.offsetTop}px`,
      width: `${liElement.offsetWidth}px`,
      height: `${liElement.offsetHeight}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    
    // For MultiSelect, the liElement might contain an icon + text.
    // We copy its innerHTML to the effect text to preserve the icon.
    textRef.current.innerHTML = liElement.innerHTML;
  };

  useEffect(() => {
    updatePosition();
    
    if (textRef.current) {
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      // Clean up old particles if re-running
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current?.removeChild(p));
      makeParticles(filterRef.current);
    }

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(containerElement);
    return () => resizeObserver.disconnect();
  }, [liElement, containerElement]); // Only run on mount or element change

  return (
    <>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </>
  );
};

const MultiSelectGooeyNav = ({
  items,
  animationTime = 450,
  particleCount = 10,
  particleDistances = [50, 8],
  particleR = 60,
  timeVariance = 200,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  activeIndices = [],
  onChange
}: MultiSelectGooeyNavProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const [internalActiveIndices, setInternalActiveIndices] = useState<number[]>(activeIndices);

  // Sync with prop if it changes
  useEffect(() => {
    setInternalActiveIndices(activeIndices);
  }, [activeIndices]);

  const toggleIndex = (index: number) => {
    const isCurrentlyActive = internalActiveIndices.includes(index);
    let nextIndices;
    if (isCurrentlyActive) {
      nextIndices = internalActiveIndices.filter(i => i !== index);
    } else {
      nextIndices = [...internalActiveIndices, index];
    }
    
    setInternalActiveIndices(nextIndices);
    if (onChange) {
      onChange(nextIndices);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, index: number) => {
    e.preventDefault();
    toggleIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleIndex(index);
    }
  };

  // We need to pass the actual DOM elements to the effects so they can track position
  const [liElements, setLiElements] = useState<Map<number, HTMLLIElement>>(new Map());

  useEffect(() => {
    if (navRef.current) {
      const lis = navRef.current.querySelectorAll('li');
      const newMap = new Map();
      lis.forEach((li, idx) => {
        newMap.set(idx, li);
      });
      setLiElements(newMap);
    }
  }, [items]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => {
            const isActive = internalActiveIndices.includes(index);
            return (
              <li key={index} className={isActive ? 'active' : ''}>
                <button
                  type="button"
                  className="px-4 py-1.5 flex items-center gap-1 w-full h-full bg-transparent border-none text-inherit cursor-pointer rounded-full"
                  onClick={e => handleClick(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            );
          })}
          {internalActiveIndices.map(index => {
            const liElement = liElements.get(index);
            if (!liElement || !containerRef.current) return null;
            
            return (
              <ActiveEffect
                key={index}
                liElement={liElement}
                containerElement={containerRef.current}
                animationTime={animationTime}
                particleCount={particleCount}
                particleDistances={particleDistances}
                particleR={particleR}
                timeVariance={timeVariance}
                colors={colors}
              />
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default MultiSelectGooeyNav;
