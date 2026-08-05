'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import './Dock.css';

function DockLabel({ children, visible, alignment }) {
  let originClass = 'dock-label-center';
  let xOffset = '-50%';
  
  if (alignment === 'right') {
    originClass = 'dock-label-right';
    xOffset = '0%';
  } else if (alignment === 'left') {
    originClass = 'dock-label-left';
    xOffset = '0%';
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`dock-label ${originClass}`}
          role="tooltip"
          style={{ x: xOffset }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Dock({
  items,
  className = '',
  baseItemSize = 40
}) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <div className={`dock-outer ${className}`}>
      <div className="dock-panel" role="toolbar" aria-label="Application dock">
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index;
          let alignment = 'center';
          if (index === items.length - 1) alignment = 'right';

          return (
            <div
              key={index}
              className={`dock-item ${item.className || ''}`}
              style={{
                width: baseItemSize,
                height: baseItemSize,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
              onClick={item.onClick}
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-label={item.label}
            >
              <div className={`dock-icon ${isHovered ? 'dock-icon--active' : ''}`}>
                {item.icon}
              </div>
              <DockLabel visible={isHovered} alignment={alignment}>{item.label}</DockLabel>
            </div>
          );
        })}
      </div>
    </div>
  );
}
