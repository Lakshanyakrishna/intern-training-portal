import { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { levels } from '../data/levels';
import { badges as badgeDefs } from '../data/badges';
import Badge from '../components/Badge';
import { User } from '../components/Icons';

export default function Profile() {
  const { progress, getEarnedBadges } = useProgress();
  const earned = getEarnedBadges();
  const [name, setName] = useState(localStorage.getItem('intern-name') || '');

  const currentLevel = levels.find(l => l.level === progress.level) || levels[0];

  const handleSaveName = () => {
    localStorage.setItem('intern-name', name);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl"><User className="w-8 h-8 inline-block" /></span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your training profile and achievements.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleSaveName}
              className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{progress.xp}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total XP</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">Level {currentLevel.level}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentLevel.title}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{progress.completedChallenges.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Challenges</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{progress.passedQuizzes.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Assessments Passed</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {badgeDefs.map(b => (
            <Badge key={b.id} name={b.name} description={b.description} earned={earned.includes(b.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
