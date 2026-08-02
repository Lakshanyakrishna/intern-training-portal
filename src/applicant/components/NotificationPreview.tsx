import { Bell } from '../../components/Icons';
import EmptyState from './EmptyState';
import type { NotificationItem } from '../types';

// Compact widget only -- 3 most recent, no page of its own. Matches the
// "Do NOT create notification page" instruction; a real implementation
// would still cap this at 3 and rely on the existing NotificationCenter
// page for the full list.
export default function NotificationPreview({ notifications }: { notifications: NotificationItem[] }) {
  const latest = notifications.slice(0, 3);

  return (
    <div className="bg-surface border border-line rounded-2xl shadow-sm shadow-black/[0.03] p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-primary">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        )}
      </div>
      <p className="text-xs text-secondary mb-4">Latest updates.</p>

      {latest.length === 0 ? (
        <EmptyState icon={<Bell className="w-4 h-4" />} title="No notifications" />
      ) : (
        <ul className="space-y-3">
          {latest.map(n => (
            <li key={n.id} className="flex items-start gap-2">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.read ? 'bg-line' : 'bg-accent'}`} />
              <div className="min-w-0">
                <p className={`text-sm ${n.read ? 'text-secondary' : 'text-primary font-medium'}`}>{n.title}</p>
                <p className="text-[11px] text-secondary mt-0.5">{n.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
