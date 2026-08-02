import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-gray-900 dark:text-white">Intern Readiness Program</Link>
          <div className="flex items-center gap-3">
            <Link to="/about" className="text-xs text-blue-600 dark:text-blue-400 font-medium">About</Link>
            <Link to="/apply" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Apply</Link>
            <Link to="/login" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Login</Link>
            <Link to="/signup" className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About the Program</h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            The Intern Readiness Program is designed to bridge the gap between academic knowledge and real-world client project readiness. Through a structured curriculum of nine modules, hands-on exercises, and project-based challenges, interns develop the practical skills needed to contribute effectively from day one.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Foundation Modules', desc: 'Start with Git & GitHub, deployment, and database management to build core developer skills.' },
              { step: '2', title: 'Development Skills', desc: 'Progress through AI-assisted development, API integration, debugging, and testing.' },
              { step: '3', title: 'Professional Skills', desc: 'Learn communication, code review, and quality assurance practices used in real teams.' },
              { step: '4', title: 'Capstone Project', desc: 'Complete a final project that demonstrates your readiness for client work.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What You'll Gain</h2>
          <ul className="space-y-2">
            {['Hands-on experience with real development tools', 'Portfolio of completed projects and challenges', 'Mentor feedback on your submissions', 'Readiness evaluation for client projects', 'Certification of program completion'].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
