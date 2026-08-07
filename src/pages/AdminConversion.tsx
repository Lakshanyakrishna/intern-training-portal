import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, getUser, updateUser, getTrainingTracks, assignInternTrack } from '../lib/db';
import { notifyEvent } from '../lib/notifications';
import type { DbApplication, DbTrainingTrack } from '../lib/db';

export default function AdminConversion() {
  const [applications, setApplications] = useState<DbApplication[]>([]);
  const [convertedUserIds, setConvertedUserIds] = useState<Set<string>>(new Set());
  const [tracks, setTracks] = useState<DbTrainingTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [apps, allTracks] = await Promise.all([getApplications(), getTrainingTracks()]);
      setApplications(apps);
      setTracks(allTracks);

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

      const trackId = selectedTrack[app.id];
      if (trackId) {
        await assignInternTrack(app.userId, trackId);
      }

      notifyEvent('training_started', app.userId, {
        name: app.name,
      }).catch(() => {});
      setMessage({ type: 'success', text: `${app.name} has been converted to intern.` });
      await refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Conversion failed.' });
    }
  }

  // "Accepted" alone isn't enough to convert anymore -- the applicant also
  // has to have confirmed the offer (022_offer_acceptance.sql) before they
  // show up as ready. Split the accepted group so admins can see who's
  // just waiting on the applicant, rather than that group silently
  // disappearing from the old single list.
  const readyToConvert = applications.filter(
    a => a.status === 'accepted' && !!a.offerAcceptedAt && !(a.userId && convertedUserIds.has(a.userId))
  );
  const waitingOnApplicant = applications.filter(
    a => a.status === 'accepted' && !a.offerAcceptedAt && !(a.userId && convertedUserIds.has(a.userId))
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
          {/* Accepted + confirmed - ready to convert */}
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-surface-alt">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Ready to Convert</h2>
              <p className="text-xs text-secondary">
                {readyToConvert.length} applicant{readyToConvert.length !== 1 ? 's' : ''} — accepted the offer, confirmed on their end
              </p>
            </div>
            {readyToConvert.length === 0 ? (
              <div className="text-center py-8 text-sm text-secondary">No one's confirmed and ready yet.</div>
            ) : (
              <div className="divide-y divide-line">
                {readyToConvert.map(app => (
                  <div key={app.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary">{app.name}</p>
                      <p className="text-xs text-secondary">{app.email}{app.userId ? '' : ' (no account yet)'}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={selectedTrack[app.id] ?? ''}
                        onChange={e => setSelectedTrack(prev => ({ ...prev, [app.id]: e.target.value }))}
                        className="text-xs px-2 py-1.5 rounded-lg border border-line bg-surface text-primary"
                        title="Training track (optional)"
                      >
                        <option value="">No track yet</option>
                        {tracks.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleConvert(app)}
                        disabled={!app.userId}
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {app.userId ? 'Convert to Intern' : 'Needs Account'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accepted but not yet confirmed by the applicant */}
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-surface-alt">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Waiting on Applicant</h2>
              <p className="text-xs text-secondary">
                {waitingOnApplicant.length} applicant{waitingOnApplicant.length !== 1 ? 's' : ''} — offered, haven't confirmed yet
              </p>
            </div>
            {waitingOnApplicant.length === 0 ? (
              <div className="text-center py-8 text-sm text-secondary">Nobody's pending confirmation.</div>
            ) : (
              <div className="divide-y divide-line">
                {waitingOnApplicant.map(app => (
                  <div key={app.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-primary">{app.name}</p>
                      <p className="text-xs text-secondary">{app.email}</p>
                    </div>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Awaiting Confirmation</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shortlisted - waiting for interview/decision */}
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-surface-alt">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Shortlisted — Pending Decision</h2>
              <p className="text-xs text-secondary">{pendingApps.length} applicant{pendingApps.length !== 1 ? 's' : ''}</p>
            </div>
            {pendingApps.length === 0 ? (
              <div className="text-center py-8 text-sm text-secondary">No shortlisted applicants.</div>
            ) : (
              <div className="divide-y divide-line">
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

          {tracks.length === 0 && (
            <p className="text-xs text-secondary text-center">
              No training tracks exist yet — conversions will go through without a track assigned.{' '}
              <Link to="/admin/tracks" className="text-accent hover:underline">Add one</Link>.
            </p>
          )}
        </>
      )}
    </div>
  );
}
