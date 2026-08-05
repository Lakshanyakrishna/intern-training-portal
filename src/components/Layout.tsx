import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserSettings, upsertUserSettings } from '../lib/db';
import { roleHomePath } from '../utils/roleHome';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';

export default function Layout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const location = useLocation();
  const isModuleRoute = location.pathname.startsWith('/module/');

  useEffect(() => {
    if (!user) return;
    getUserSettings(user.id).then(settings => {
      if (settings?.theme) {
        setDarkMode(settings.theme === 'dark');
      }
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (user) {
      upsertUserSettings(user.id, { theme: darkMode ? 'dark' : 'light' }).catch(() => {});
    }
  }, [darkMode, user]);

  return (
    <div className="min-h-screen bg-background text-primary">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} compact={isModuleRoute} />
      <div className={`transition-all duration-300 ease-in-out ${isModuleRoute ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur border-b border-line">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-alt"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="lg:hidden font-semibold text-sm text-primary">Intern Readiness Program</div>
            <div className="hidden lg:block">
              <Link to={roleHomePath(user?.role)} className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                Intern Readiness Program
              </Link>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {(user?.role === 'mentor' || user?.role === 'admin') && (
                <Link
                  to="/mentor"
                  className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-surface-alt transition-colors"
                >
                  <span>🔒</span>
                  <span>Mentor</span>
                </Link>
              )}
              <NotificationBell />
              <button
                onClick={() => setDarkMode(p => !p)}
                className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
                title="Toggle theme"
              >
                {darkMode ? <span className="text-lg">☀️</span> : <span className="text-lg">🌙</span>}
              </button>
            </div>
          </div>
        </header>
        <main className={`transition-all duration-300 ease-in-out ${isModuleRoute ? 'p-4 md:p-6 lg:p-8 max-w-none' : 'p-4 md:p-6 lg:p-8 max-w-6xl mx-auto'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
