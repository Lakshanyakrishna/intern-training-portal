import { Link } from 'react-router-dom';

export default function Apply() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-gray-900 dark:text-white">Intern Readiness Program</Link>
          <div className="flex items-center gap-3">
            <Link to="/about" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
            <Link to="/apply" className="text-xs text-blue-600 dark:text-blue-400 font-medium">Apply</Link>
            <Link to="/login" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Login</Link>
            <Link to="/signup" className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Apply to the Program</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Applications are currently being reviewed. Create an account to start your readiness journey.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/signup" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">Create Account</Link>
            <Link to="/login" className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
