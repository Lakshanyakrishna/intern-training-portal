import { useState } from 'react';
import { Activity as ActivityGlyph, Bell, HelpCircle } from '../../components/Icons';
import ActivityFeed from './ActivityFeed';
import HelpPanel from './HelpPanel';
import NotificationPreview from './NotificationPreview';
import SidePanel from './SidePanel';
import type { ActivityItem, NotificationItem } from '../types';

type PanelKind = 'notifications' | 'activity' | 'help';

// Notifications, Activity, and Help used to sit in the bottom grid as
// always-visible cards. Moved here so the main page stays focused on the
// current stage; each opens on demand in a slide-over instead (SidePanel)
// rather than competing for space at rest.
export default function QuickAccessDock({ notifications, activity }: {
  notifications: NotificationItem[];
  activity: ActivityItem[];
}) {
  const [openPanel, setOpenPanel] = useState<PanelKind | null>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const items: { key: PanelKind; icon: typeof Bell; label: string; badge?: number }[] = [
    { key: 'notifications', icon: Bell, label: 'Notifications', badge: unreadCount || undefined },
    { key: 'activity', icon: ActivityGlyph, label: 'Activity' },
    { key: 'help', icon: HelpCircle, label: 'Help' },
  ];

  return (
    <>
      <div className="fixed bottom-24 right-5 z-40 flex items-center gap-2 bg-surface border border-line rounded-full shadow-sm shadow-black/[0.05] p-1.5">
        {items.map(({ key, icon: Icon, label, badge }) => (
          <button
            key={key}
            onClick={() => setOpenPanel(key)}
            aria-label={label}
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Icon className="w-[18px] h-[18px]" />
            {badge ? (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-[3px] rounded-full bg-accent text-accent-text text-[9px] font-bold flex items-center justify-center tabular-nums">
                {badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <SidePanel open={openPanel === 'notifications'} onClose={() => setOpenPanel(null)}>
        <NotificationPreview notifications={notifications} />
      </SidePanel>
      <SidePanel open={openPanel === 'activity'} onClose={() => setOpenPanel(null)}>
        <ActivityFeed items={activity} />
      </SidePanel>
      <SidePanel open={openPanel === 'help'} onClose={() => setOpenPanel(null)}>
        <HelpPanel />
      </SidePanel>
    </>
  );
}
