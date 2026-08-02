import React from 'react';
import type { ReactNode, CSSProperties } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: ReactNode;
  text: string; // explicitly pass the text to duplicate in pseudo elements
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  children, 
  text,
  speed = 1, 
  enableShadows = true, 
  enableOnHover = true, 
  className = '' 
}) => {
  const inlineStyles = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 red' : 'none',
    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none'
  } as CSSProperties;

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return (
    <div 
      className={`glitch ${hoverClass} ${className}`} 
      style={inlineStyles} 
      data-text={text}
    >
      {children}
    </div>
  );
};

export default GlitchText;
