'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import './Dock.css';

function DockLabel({ children, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className="dock-label"
          role="tooltip"
          style={{ x: '-50%' }}
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
              <DockLabel visible={isHovered}>{item.label}</DockLabel>
            </div>
          );
        })}
      </div>
    </div>
  );
}
