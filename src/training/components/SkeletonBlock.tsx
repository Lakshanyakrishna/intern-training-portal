export default function SkeletonBlock({ className = 'h-24' }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-alt rounded-2xl ${className}`} />;
}
