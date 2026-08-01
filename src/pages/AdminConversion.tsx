import { useState, useEffect } from 'react';
import { getApplications, getUser, updateUser } from '../lib/db';
import { notifyEvent } from '../lib/notifications';
import type { DbApplication } from '../lib/db';

export default function AdminConversion() {
  const [applications, setApplications] = useState<DbApplication[]>([]);
  const [convertedUserIds, setConvertedUserIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const apps = await getApplications();
      setApplications(apps);

      // 'accepted' is the application's terminal status either way -- it
      // never changes on conversion -- so the only way to tell an already-
      // converted applicant apart from one still waiting is the linked
      // user's actual role. Without this, this list re-lists every
      // converted applicant forever (they never leave "accepted").
      const acceptedUserIds = apps
        .filter(a => a.status === 'accepted' && a.userId)
        .map(a => a.userId as string);
      const uniqueIds = [...new Set(acceptedUserIds)];
      const users = await Promise.all(uniqueIds.map(id => getUser(id).catch(() => null)));
      const converted = new Set(
        uniqueIds.filter((_id, i) => users[i]?.role === 'intern' || users[i]?.role === 'mentor' || users[i]?.role === 'admin')
      );
      setConvertedUserIds(converted);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleConvert(app: DbApplication) {
    if (!app.userId) {
      setMessage({ type: 'error', text: `${app.name} has no linked user account. They need to sign up first.` });
      return;
    }

    try {
      const existing = await getUser(app.userId);
      if (!existing) {
        setMessage({ type: 'error', text: 'User profile not found. They may need to complete onboarding first.' });
        return;
      }

      await updateUser(app.userId, { role: 'intern', onboardingComplete: false });
      notifyEvent('training_started', app.userId, {
        name: app.name,
      }).catch(() => {});
      setMessage({ type: 'success', text: `${app.name} has been converted to intern.` });
      await refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Conversion failed.' });
    }
  }

  const acceptedApps = applications.filter(
    a => a.status === 'accepted' && !(a.userId && convertedUserIds.has(a.userId))
  );
  const pendingApps = applications.filter(a => a.status === 'shortlisted');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Intern Conversion</h1>
        <p className="text-sm text-secondary mt-1">Convert selected applicants to active interns.</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm border ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Accepted - ready to convert */}
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-surface-alt">
              <h2 className="text-sm font-semibold text-primary">Accepted — Ready to Convert</h2>
              <p className="text-xs text-secondary">{acceptedApps.length} applicant{acceptedApps.length !== 1 ? 's' : ''}</p>
            </div>
            {acceptedApps.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No accepted applications waiting for conversion.</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {acceptedApps.map(app => (
                  <div key={app.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-primary">{app.name}</p>
                      <p className="text-xs text-secondary">{app.email}{app.userId ? '' : ' (no account yet)'}</p>
                    </div>
                    <button
                      onClick={() => handleConvert(app)}
                      disabled={!app.userId}
                      className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {app.userId ? 'Convert to Intern' : 'Needs Account'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shortlisted - waiting for interview/decision */}
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-surface-alt">
              <h2 className="text-sm font-semibold text-primary">Shortlisted — Pending Decision</h2>
              <p className="text-xs text-secondary">{pendingApps.length} applicant{pendingApps.length !== 1 ? 's' : ''}</p>
            </div>
            {pendingApps.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No shortlisted applicants.</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {pendingApps.map(app => (
                  <div key={app.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-primary">{app.name}</p>
                      <p className="text-xs text-secondary">{app.email}</p>
                    </div>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Awaiting Interview / Decision</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
