import { useState, useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';
import { levels } from '../data/levels';
import { User } from '../components/Icons';
import { getUserSettings, upsertUserSettings } from '../lib/db';

export default function Profile() {
  const { progress } = useProgress();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserSettings(user.id).then(settings => {
      if (settings?.displayName) {
        setName(settings.displayName);
      }
    }).catch(() => {});
  }, [user]);

  const currentLevel = levels.find(l => l.level === progress.level) || levels[0];

  const handleSaveName = async () => {
    if (user) {
      setSaving(true);
      try {
        await upsertUserSettings(user.id, { displayName: name });
      } catch { /* ignore */ }
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl"><User className="w-8 h-8 inline-block" /></span>
        <div>
          <h1 className="text-2xl font-bold text-primary">Profile</h1>
          <p className="text-sm text-secondary">Your training profile.</p>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2.5 rounded-lg border border-line bg-surface text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
            <button
              onClick={handleSaveName}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line">
          <div className="text-center p-4 bg-surface-alt rounded-xl">
            <p className="text-2xl font-bold text-primary">{progress.xp}</p>
            <p className="text-xs text-secondary">Total XP</p>
          </div>
          <div className="text-center p-4 bg-surface-alt rounded-xl">
            <p className="text-2xl font-bold text-primary">Level {currentLevel.level}</p>
            <p className="text-xs text-secondary">{currentLevel.title}</p>
          </div>
          <div className="text-center p-4 bg-surface-alt rounded-xl">
            <p className="text-2xl font-bold text-primary">{progress.completedChallenges.length}</p>
            <p className="text-xs text-secondary">Challenges</p>
          </div>
          <div className="text-center p-4 bg-surface-alt rounded-xl">
            <p className="text-2xl font-bold text-primary">{progress.passedQuizzes.length}</p>
            <p className="text-xs text-secondary">Assessments Passed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
