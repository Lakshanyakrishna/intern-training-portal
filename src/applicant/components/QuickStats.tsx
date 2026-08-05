import { Link } from 'react-router-dom';
import { Briefcase, Users, Clock, Award, ArrowRight } from '../../components/Icons';
import type { QuickStat, QuickStatIcon } from '../types';

const ICONS: Record<QuickStatIcon, typeof Briefcase> = {
  briefcase: Briefcase,
  users: Users,
  clock: Clock,
  award: Award,
};

const CARD_CLASSES = 'group bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-4 text-left block hover:border-secondary hover:shadow-md hover:shadow-black/[0.06] hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function CardBody({ icon: Icon, value, label, linkLabel }: { icon: typeof Briefcase; value: string; label: string; linkLabel: string }) {
  return (
    <>
      <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-secondary mb-3">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xl font-bold text-primary tabular-nums">{value}</p>
      <p className="text-[11px] text-secondary mt-0.5">{label}</p>
      <p className="flex items-center gap-1 text-[11px] font-medium text-primary mt-2.5">
        {linkLabel}
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </p>
    </>
  );
}

export default function QuickStats({ stats }: { stats: QuickStat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(stat => {
        const Icon = ICONS[stat.icon];
        const body = <CardBody icon={Icon} value={stat.value} label={stat.label} linkLabel={stat.linkLabel} />;

        if (stat.action.type === 'link') {
          return (
            <Link key={stat.id} to={stat.action.href} className={CARD_CLASSES}>
              {body}
            </Link>
          );
        }

        const targetId = stat.action.targetId;
        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className={`${CARD_CLASSES} w-full`}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
