import { useAuth } from '../contexts/AuthContext';

export default function MentorDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mentor Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm">Mentor dashboard interface coming soon.</p>
      </div>
    </div>
  );
}
