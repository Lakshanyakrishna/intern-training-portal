interface ProgressBarProps {
  percent: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ProgressBar({ percent, size = 'md', showLabel = true }: ProgressBarProps) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  return (
    <div className="w-full">
      {showLabel && <div className="flex justify-between text-xs text-secondary mb-1">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heights[size]}`}>
        <div
          className={`bg-gradient-to-r from-neutral-500 to-indigo-500 rounded-full transition-all duration-500 ${heights[size]}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
