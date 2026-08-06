import React, { useEffect, useState } from 'react';

interface NavItem {
  label: string;
  icon?: React.ReactNode;
}

interface MultiSelectGooeyNavProps {
  items: NavItem[];
  activeIndices?: number[];
  onChange?: (activeIndices: number[]) => void;
  // Props kept for backwards compatibility but unused
  animationTime?: number;
  particleCount?: number;
  particleDistances?: number[];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
}

const MultiSelectGooeyNav = ({
  items,
  activeIndices = [],
  onChange
}: MultiSelectGooeyNavProps) => {
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    toggleIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleIndex(index);
    }
  };

  return (
    <div className="flex flex-nowrap gap-2">
      {items.map((item, index) => {
        const isActive = internalActiveIndices.includes(index);
        return (
          <button
            key={index}
            type="button"
            className={`px-4 py-1.5 flex items-center gap-2 rounded-full text-sm font-medium transition-all duration-200 border shrink-0 ${
              isActive 
                ? 'bg-white/10 border-white/20 text-[#F1F2EE] shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                : 'bg-transparent border-white/5 text-[#9AA1A3] hover:border-white/20 hover:text-white'
            }`}
            onClick={e => handleClick(e, index)}
            onKeyDown={e => handleKeyDown(e, index)}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default MultiSelectGooeyNav;
