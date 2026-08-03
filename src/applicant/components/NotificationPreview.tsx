import { Link } from 'react-router-dom';
import { Bell, Calendar, FileText, Activity } from '../../components/Icons';
import EmptyState from './EmptyState';
import type { NotificationItem, NotificationKind } from '../types';

const KIND_ICONS: Record<NotificationKind, typeof Bell> = {
  interview: Calendar,
  application: FileText,
  progress: Activity,
};

// Compact widget only -- 3 most recent, no page of its own. Matches the
// "Do NOT create notification page" instruction; "View all" hands off to
// the existing real NotificationCenter page rather than duplicating it.
export default function NotificationPreview({ notifications }: { notifications: NotificationItem[] }) {
  const latest = notifications.slice(0, 3);

  return (
    <div className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-primary">Notifications</h3>
        <Link to="/notifications" className="text-xs font-medium text-secondary hover:text-primary transition-colors">
          View all
        </Link>
      </div>
      <p className="text-xs text-secondary mb-4">Latest updates.</p>

      {latest.length === 0 ? (
        <EmptyState icon={<Bell className="w-4 h-4" />} title="No notifications" />
      ) : (
        <ul className="space-y-3">
          {latest.map(n => {
            const Icon = KIND_ICONS[n.kind];
            return (
              <li key={n.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-surface-alt flex items-center justify-center text-secondary shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm ${n.read ? 'text-secondary' : 'text-primary font-medium'}`}>{n.title}</p>
                  <p className="text-[11px] text-secondary mt-0.5">{n.timestamp}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
