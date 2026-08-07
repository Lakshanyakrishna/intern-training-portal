import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity as ActivityGlyph, Bell, HelpCircle, User } from '../../components/Icons';
import ActivityFeed from './ActivityFeed';
import HelpPanel from './HelpPanel';
import NotificationPreview from './NotificationPreview';
import SidePanel from './SidePanel';
import type { ActivityItem, NotificationItem } from '../types';

type PanelKind = 'notifications' | 'activity' | 'help';

const RING_SIZE = 40;
const RING_STROKE = 2.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// A ring, not a count bubble -- deliberately different from the unread-count
// badge on Notifications below, since "37% done" isn't a count of anything
// waiting on you, it's a progress amount. Recognizable from LinkedIn/
// Instagram's own profile-strength ring, which is exactly this pattern.
function ProfileRing({ percent }: { percent: number }) {
  const offset = RING_CIRCUMFERENCE * (1 - percent / 100);
  return (
    <svg width={RING_SIZE} height={RING_SIZE} className="absolute inset-0 -rotate-90" aria-hidden="true">
      <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" strokeWidth={RING_STROKE} className="stroke-line" />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        strokeWidth={RING_STROKE}
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="stroke-accent transition-[stroke-dashoffset] duration-500 ease-out"
      />
    </svg>
  );
}

// Notifications, Activity, and Help used to sit in the bottom grid as
// always-visible cards. Moved here so the main page stays focused on the
// current stage; each opens on demand in a slide-over instead (SidePanel)
// rather than competing for space at rest.
export default function QuickAccessDock({ notifications, activity, profileCompleteness }: {
  notifications: NotificationItem[];
  activity: ActivityItem[];
  profileCompleteness: number;
}) {
  const navigate = useNavigate();
  const [openPanel, setOpenPanel] = useState<PanelKind | null>(null);
  const unreadCount = notifications.filter(n => !n.read).length;
  const profileIncomplete = profileCompleteness < 100;

  const items: { key: PanelKind; icon: typeof Bell; label: string; badge?: number }[] = [
    { key: 'notifications', icon: Bell, label: 'Notifications', badge: unreadCount || undefined },
    { key: 'activity', icon: ActivityGlyph, label: 'Activity' },
    { key: 'help', icon: HelpCircle, label: 'Help' },
  ];

  return (
    <>
      <div className="fixed bottom-24 right-5 z-40 flex items-center gap-2 bg-surface border border-line rounded-full shadow-sm shadow-black/[0.05] p-1.5">
        <button
          onClick={() => navigate('/profile')}
          aria-label={`Profile, ${profileCompleteness}% complete`}
          title={profileIncomplete ? `Profile ${profileCompleteness}% complete — finish it` : 'Profile complete'}
          className="relative w-11 h-11 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {profileIncomplete && <ProfileRing percent={profileCompleteness} />}
          <User className="w-[18px] h-[18px] relative" />
          {profileIncomplete && (
            <span className="absolute top-0 right-0.5 w-2 h-2 rounded-full bg-accent motion-safe:animate-pulse" />
          )}
        </button>

        <div className="w-px h-6 bg-line shrink-0" />

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
