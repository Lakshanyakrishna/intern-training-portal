import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard, type LeaderboardEntry } from '../lib/db';
import { Trophy } from '../components/Icons';

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const circleColors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500'];
const rankColors = ['bg-yellow-400', 'bg-gray-300', 'bg-orange-400'];

export default function Leaderboard() {
  const { user: currentUser } = useAuth();
  const [entries, setEntries] = useState<(LeaderboardEntry & { rank: number; score: number; isCurrentUser: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(data => {
        const scored = data.map(e => ({
          ...e,
          score: e.xp + e.completedLessons * 10 + e.passedQuizzes * 20 + e.completedChallenges * 30 + e.assessmentScore,
        }));
        scored.sort((a, b) => b.score - a.score);
        setEntries(scored.map((e, i) => ({ ...e, rank: i + 1, isCurrentUser: currentUser?.id === e.userId })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Leaderboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Intern rankings by activity and performance</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Leaderboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Intern rankings by activity and performance</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <Trophy className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No rankings available yet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Rankings will appear once interns begin completing lessons, quizzes, hands-on tasks, challenges, and assessments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-7 h-7 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Leaderboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Intern rankings by activity and performance</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[48px_1fr_64px_80px_120px_80px] gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <span>#</span>
          <span>Name</span>
          <span className="text-center">Level</span>
          <span className="text-right">XP</span>
          <span className="text-right">Activities</span>
          <span className="text-right">Score</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {entries.map(entry => {
            const initials = getInitials(entry.name);
            const circleColor = circleColors[(entry.rank - 1) % circleColors.length];

            return (
              <div
                key={entry.userId}
                className={`grid grid-cols-[48px_1fr_64px_80px_120px_80px] gap-2 items-center px-4 py-3 text-sm ${
                  entry.isCurrentUser
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                <div className="flex items-center justify-center">
                  {entry.rank <= 3 ? (
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${rankColors[entry.rank - 1]}`}>
                      {entry.rank}
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">{entry.rank}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${circleColor} shrink-0`}>
                    {initials}
                  </div>
                  <span className={`truncate font-medium ${
                    entry.isCurrentUser
                      ? 'text-blue-800 dark:text-blue-200'
                      : 'text-gray-800 dark:text-white'
                  }`}>
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="ml-1.5 text-[10px] text-blue-600 dark:text-blue-400 font-normal">(you)</span>
                    )}
                  </span>
                </div>
                <span className="text-center text-gray-600 dark:text-gray-300 font-medium tabular-nums">
                  {entry.level}
                </span>
                <span className="text-right text-gray-600 dark:text-gray-300 font-medium tabular-nums">
                  {entry.xp.toLocaleString()}
                </span>
                <span className="text-right text-gray-500 dark:text-gray-400 tabular-nums text-xs">
                  {entry.completedLessons}L / {entry.completedChallenges}C / {entry.passedQuizzes}Q
                </span>
                <span className="text-right text-gray-800 dark:text-white font-semibold tabular-nums">
                  {entry.score.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
