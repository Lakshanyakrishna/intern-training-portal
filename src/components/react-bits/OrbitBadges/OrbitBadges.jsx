import { useMemo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import './OrbitBadges.css';

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function OrbitItem({ item, index, totalItems, path, itemWidth, itemHeight, rotation, progress, fill }) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;
  const offsetDistance = useTransform(progress, (p) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });
  return (
    <motion.div
      className="orbit-badge-item"
      style={{
        width: itemWidth,
        height: itemHeight,
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center center',
        offsetDistance,
      }}
    >
      <div style={{ transform: `rotate(${-rotation}deg)`, width: '100%', height: '100%' }}>{item}</div>
    </motion.div>
  );
}

export default function OrbitBadges({
  items = [],
  baseWidth = 900,
  radiusX = 380,
  radiusY = 260,
  rotation = 0,
  duration = 40,
  itemWidth = 240,
  itemHeight = 44,
  direction = 'normal',
  fill = true,
  responsive = true,
  easing = 'linear',
  paused = false,
  centerContent,
  className = '',
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(null);
  const designCenterX = baseWidth / 2;
  const designCenterY = baseWidth / 2;

  const path = useMemo(
    () => generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY),
    [designCenterX, designCenterY, radiusX, radiusY]
  );

  useLayoutEffect(() => {
    if (!responsive || !containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      setScale(containerRef.current.clientWidth / baseWidth);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [responsive, baseWidth]);

  const progress = useMotionValue(0);

  useEffect(() => {
    if (paused) return;
    const controls = animate(progress, direction === 'reverse' ? -100 : 100, {
      duration,
      ease: easing,
      repeat: Infinity,
      repeatType: 'loop',
    });
    return () => controls.stop();
  }, [progress, duration, easing, direction, paused]);

  return (
    <div
      ref={containerRef}
      className={`orbit-badge-container ${className}`}
      style={{ width: '100%', aspectRatio: responsive ? `${baseWidth} / ${baseWidth}` : undefined }}
    >
      <div
        className="orbit-badge-scaling-container"
        style={{
          width: baseWidth,
          height: baseWidth,
          transform: responsive && scale !== null ? `translate(-50%, -50%) scale(${scale})` : undefined,
          visibility: responsive && scale === null ? 'hidden' : undefined,
        }}
      >
        <div className="orbit-badge-rotation-wrapper" style={{ transform: `rotate(${rotation}deg)` }}>
          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
              rotation={rotation}
              progress={progress}
              fill={fill}
            />
          ))}
        </div>
      </div>
      {centerContent && <div className="orbit-badge-center-content">{centerContent}</div>}
    </div>
  );
}
