import { Send, FileText, Video, Users, GraduationCap, CheckCircle, MessageSquare } from '../../components/Icons';
import EmptyState from './EmptyState';
import type { ActivityIcon, ActivityItem } from '../types';

const ICONS: Record<ActivityIcon, typeof Send> = {
  submitted: Send,
  resume: FileText,
  interview: Video,
  mentor: Users,
  training: GraduationCap,
  decision: CheckCircle,
};

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-5">
      <h3 className="text-sm font-semibold text-primary mb-1">Activity</h3>
      <p className="text-xs text-secondary mb-4">A running record of what's happened so far.</p>

      {items.length === 0 ? (
        <EmptyState icon={<MessageSquare className="w-4 h-4" />} title="No activity yet" description="Updates will appear here as things happen." />
      ) : (
        <ol className="space-y-4">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-surface-alt flex items-center justify-center text-secondary shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {i < items.length - 1 && <div className="w-px flex-1 bg-line mt-1" />}
                </div>
                <div className="min-w-0 pb-4">
                  <p className="text-sm font-medium text-primary">{item.title}</p>
                  <p className="text-xs text-secondary mt-0.5">{item.description}</p>
                  <p className="text-[11px] text-secondary mt-1 tabular-nums">
                    {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
