import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotificationPreferences, upsertNotificationPreferences } from '../lib/db';

interface ToggleDef {
  key: keyof Omit<import('../lib/db').DbNotificationPreference, 'userId'>;
  label: string;
}

const TOGGLES: ToggleDef[] = [
  { key: 'emailEnabled', label: 'Email notifications' },
  { key: 'applicationNotifications', label: 'Application notifications' },
  { key: 'interviewNotifications', label: 'Interview notifications' },
  { key: 'trainingNotifications', label: 'Training notifications' },
  { key: 'projectNotifications', label: 'Project notifications' },
  { key: 'certificateNotifications', label: 'Certificate notifications' },
];

export default function NotificationSettings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getNotificationPreferences(user.id)
      .then(data => {
        if (data) {
          setPrefs({
            emailEnabled: data.emailEnabled,
            applicationNotifications: data.applicationNotifications,
            interviewNotifications: data.interviewNotifications,
            trainingNotifications: data.trainingNotifications,
            projectNotifications: data.projectNotifications,
            certificateNotifications: data.certificateNotifications,
          });
        } else {
          setPrefs({
            emailEnabled: true,
            applicationNotifications: true,
            interviewNotifications: true,
            trainingNotifications: true,
            projectNotifications: true,
            certificateNotifications: true,
          });
        }
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Failed to load preferences.' });
      })
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      await upsertNotificationPreferences(user.id, {
        emailEnabled: prefs.emailEnabled,
        applicationNotifications: prefs.applicationNotifications,
        interviewNotifications: prefs.interviewNotifications,
        trainingNotifications: prefs.trainingNotifications,
        projectNotifications: prefs.projectNotifications,
        certificateNotifications: prefs.certificateNotifications,
      });
      setMessage({ type: 'success', text: 'Preferences saved successfully.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save preferences.' });
    } finally {
      setSaving(false);
    }
  }

  function toggle(key: string) {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 dark:text-gray-500 text-sm">Please sign in to manage notification preferences.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Notification Settings</h1>
        <p className="text-sm text-secondary mt-1">Choose which notifications you'd like to receive.</p>
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
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {TOGGLES.map(t => (
                <div key={t.key} className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t.label}</span>
                  <button
                    type="button"
                    onClick={() => toggle(t.key)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
                      prefs[t.key] ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        prefs[t.key] ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
