import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Code, Target } from '../../components/Icons';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Intern Readiness Program</span>
          <div className="flex items-center gap-3">
            <Link to="/about" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
            <Link to="/apply" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Apply</Link>
            {user ? (
              <Link to="/dashboard" className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Login</Link>
                <Link to="/signup" className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
            Your path to<br />
            <span className="text-blue-600">client-ready</span> development
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A structured program designed to prepare you for real client projects through hands-on learning, practical exercises, and project-based challenges.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/signup" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">Get Started</Link>
            <Link to="/about" className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">Learn More</Link>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3"><BookOpen className="w-5 h-5" /></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Structured Learning</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nine modules covering version control, deployment, databases, AI, APIs, debugging, and more.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3"><Code className="w-5 h-5" /></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Real Projects</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Build real solutions with hands-on tasks, challenges, and a capstone project that simulates client work.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3"><Target className="w-5 h-5" /></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Readiness Focused</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your progress through readiness reviews and get mentor feedback on your submitted work.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
