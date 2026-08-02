import { Briefcase, Users, Clock, Award, ArrowRight } from '../../components/Icons';
import type { QuickStat, QuickStatIcon } from '../types';

const ICONS: Record<QuickStatIcon, typeof Briefcase> = {
  briefcase: Briefcase,
  users: Users,
  clock: Clock,
  award: Award,
};

export default function QuickStats({ stats }: { stats: QuickStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(stat => {
        const Icon = ICONS[stat.icon];
        return (
          <div key={stat.id} className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-4">
            <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-secondary mb-3">
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-primary tabular-nums">{stat.value}</p>
            <p className="text-[11px] text-secondary mt-0.5">{stat.label}</p>
            <p className="flex items-center gap-1 text-[11px] font-medium text-primary mt-2.5">
              {stat.linkLabel}
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        );
      })}
    </div>
  );
}
