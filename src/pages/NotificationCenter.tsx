import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/db';
import { stripHtml } from '../lib/notifications';
import type { DbNotification } from '../lib/db';

const PAGE_SIZE = 20;

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async (offsetVal: number, append = false) => {
    if (!user) return;
    try {
      const data = await getNotifications(user.id, PAGE_SIZE, offsetVal);
      if (append) {
        setNotifications(prev => [...prev, ...data]);
      } else {
        setNotifications(data);
      }
      setHasMore(data.length === PAGE_SIZE);
      setOffset(offsetVal + data.length);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    setNotifications([]);
    setOffset(0);
    setHasMore(true);
    fetchNotifications(0, false);
  }, [fetchNotifications]);

  async function handleMarkRead(n: DbNotification) {
    if (n.isRead) return;
    try {
      await markNotificationRead(n.id);
      setNotifications(prev =>
        prev.map(item => (item.id === n.id ? { ...item, isRead: true } : item))
      );
    } catch {
      // ignore
    }
  }

  async function handleMarkAllRead() {
    if (!user) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      // ignore
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleLoadMore() {
    await fetchNotifications(offset, true);
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 dark:text-gray-500 text-sm">Please sign in to view notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Notifications</h1>
          <p className="text-sm text-secondary mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {markingAll ? 'Marking...' : 'Mark all as read'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 text-gray-300 dark:text-gray-600">🔔</div>
          <p className="text-sm text-gray-400 dark:text-gray-500">No notifications yet.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You'll see notifications here when something happens.</p>
        </div>
      ) : (
        <>
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleMarkRead(n)}
                  className={`w-full text-left px-4 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${
                    !n.isRead ? 'bg-neutral-50/50 dark:bg-neutral-900/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm truncate ${
                          n.isRead
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-primary font-semibold'
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-secondary mt-0.5 line-clamp-2">
                        {stripHtml(n.message)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-secondary font-medium">
                        {n.eventType}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {formatTime(n.createdAt)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                className="text-sm px-4 py-2 rounded-lg border border-line text-secondary font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
