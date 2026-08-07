import type { ReactNode } from 'react';

export default function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-secondary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-primary tabular-nums leading-tight truncate">{value}</p>
        <p className="text-[11px] text-secondary truncate">{label}</p>
      </div>
    </div>
  );
}
