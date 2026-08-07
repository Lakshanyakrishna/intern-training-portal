import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserSettings, upsertUserSettings } from '../../lib/db';
import Logo from '../../components/Logo';
import { ChevronDown, HelpCircle, LogOut, Moon, Sun } from '../../components/Icons';

const NAV_ITEMS = [
  { to: '/training', label: 'Dashboard', end: true },
  { to: '/training/path', label: 'Learning Path', end: false },
  { to: '/training/progress', label: 'Progress', end: false },
  { to: '/training/mentor', label: 'Mentor', end: false },
  { to: '/training/achievements', label: 'Achievements', end: false },
  { to: '/training/resources', label: 'Resources', end: false },
];

// Deliberately a top nav, not the dark admin Sidebar -- this is meant to
// feel like a learning platform an intern chose to be in, not another
// internal ops tool. Shares color tokens with the rest of the app but owns
// its own chrome.
export default function TrainingLayout() {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (!user) return;
    getUserSettings(user.id).then(settings => {
      if (settings?.theme) setDarkMode(settings.theme === 'dark');
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (user) upsertUserSettings(user.id, { theme: darkMode ? 'dark' : 'light' }).catch(() => {});
  }, [darkMode, user]);

  return (
    <div className="min-h-screen bg-background text-primary">
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Logo withText={false} iconClassName="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary tracking-tight hidden sm:inline">Lumora Training</span>
          </div>

          <nav className="flex items-center gap-0.5 overflow-x-auto">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-secondary hover:text-primary hover:bg-surface-alt'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            <NavLink
              to="/training/help"
              aria-label="Help"
              className={({ isActive }) => `p-2 rounded-lg transition-colors ${isActive ? 'text-accent' : 'text-secondary hover:text-primary hover:bg-surface-alt'}`}
            >
              <HelpCircle className="w-4 h-4" />
            </NavLink>
            <button
              onClick={() => setDarkMode(p => !p)}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-alt transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <span className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-full hover:bg-surface-alt transition-colors">
              <span className="w-7 h-7 rounded-full bg-surface-alt flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </span>
              <span className="text-sm font-medium text-primary hidden md:inline truncate max-w-[140px]">{user?.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-secondary hidden md:inline" />
            </span>
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="p-2 rounded-lg text-secondary hover:text-red-500 hover:bg-surface-alt transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
