import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { tracks, getTrackProgress } from '../data/tracks';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Code,
  Briefcase,
  Flag,
  Award,
  Trophy,
  MessageSquare,
  Users,
  ClipboardCheck,
  BarChart3,
  User,
  ChevronDown,
  LogOut,
  Grid,
  Target,
} from './Icons';

const trackIcons: Record<string, React.ReactNode> = {
  foundation: <Layers className="w-4 h-4" />,
  development: <Code className="w-4 h-4" />,
  project: <Briefcase className="w-4 h-4" />,
  final: <Flag className="w-4 h-4" />,
};

function NavItem({
  to,
  label,
  icon,
  end,
  compact,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center ${compact ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2'} text-sm transition-colors border-l-2 ${
          isActive
            ? 'border-blue-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
        }`
      }
    >
      <span className="w-5 h-5 shrink-0 text-current">{icon}</span>
      {!compact && <span className="flex-1 truncate">{label}</span>}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose, compact }: { open: boolean; onClose: () => void; compact?: boolean }) {
  const [programOpen, setProgramOpen] = useState(true);
  const { getModuleProgress } = useProgress();
  const { user, signOut } = useAuth();
  const isMentor = user?.role === 'mentor' || user?.role === 'admin';

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-30 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
        compact ? 'w-16' : 'w-60'
      } ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className={`${compact ? 'justify-center' : 'px-4'} h-14 flex items-center border-b border-gray-200 dark:border-gray-700 shrink-0`}>
          {compact ? (
            <span className="text-sm font-bold text-blue-600">IR</span>
          ) : (
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Intern Readiness</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Project Allocation System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
          <NavItem to="/dashboard" label="Dashboard" end onClick={onClose} icon={<LayoutDashboard />} compact={compact} />

          {user?.role === 'admin' ? (
            <>
              <div className="pt-2 pb-1 px-3">
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Admin</p>
              </div>
              <NavItem to="/admin/applications" label="Applications" onClick={onClose} icon={<ClipboardCheck />} compact={compact} />
              <NavItem to="/admin/interviews" label="Interviews" onClick={onClose} icon={<Grid />} compact={compact} />
              <NavItem to="/admin/opportunities" label="Opportunities" onClick={onClose} icon={<Flag />} compact={compact} />
              <NavItem to="/admin/conversion" label="Conversion" onClick={onClose} icon={<Flag />} compact={compact} />
              <NavItem to="/admin/mentors" label="Mentor Assign" onClick={onClose} icon={<Users />} compact={compact} />
              <NavItem to="/admin/projects" label="Projects" onClick={onClose} icon={<Briefcase />} compact={compact} />
              <NavItem to="/admin/notifications" label="Notifications" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/admin/screening-report" label="Screening Report" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/admin/completion-report" label="Completion Report" onClick={onClose} icon={<BarChart3 />} compact={compact} />

              <div className="pt-3 pb-1 px-3">
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mentor</p>
              </div>
              <NavItem to="/mentor" label="Mentor Dashboard" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/mentor/evaluate" label="Readiness Eval" onClick={onClose} icon={<Target />} compact={compact} />
              <NavItem to="/mentor/interns" label="Intern Mgmt" onClick={onClose} icon={<Users />} compact={compact} />
              <NavItem to="/mentor/reviews" label="Reviews" onClick={onClose} icon={<ClipboardCheck />} compact={compact} />
              <NavItem to="/leaderboard" label="Leaderboard" onClick={onClose} icon={<Trophy />} compact={compact} />
              <NavItem to="/profile" label="Profile" onClick={onClose} icon={<User />} compact={compact} />
              <NavItem to="/notifications/settings" label="Notification Settings" onClick={onClose} icon={<BarChart3 />} compact={compact} />
            </>
          ) : isMentor ? (
            <>
              <div className="pt-2 pb-1 px-3">
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mentor</p>
              </div>
              <NavItem to="/mentor" label="Dashboard" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/mentor/evaluate" label="Readiness Eval" onClick={onClose} icon={<Target />} compact={compact} />
              <NavItem to="/mentor/interns" label="Intern Mgmt" onClick={onClose} icon={<Users />} compact={compact} />
              <NavItem to="/mentor/reviews" label="Reviews" onClick={onClose} icon={<ClipboardCheck />} compact={compact} />
              <NavItem to="/mentor/readiness" label="Project Readiness" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/mentor/completion-review" label="Completion Review" onClick={onClose} icon={<Flag />} compact={compact} />
              <NavItem to="/leaderboard" label="Leaderboard" onClick={onClose} icon={<Trophy />} compact={compact} />
              <NavItem to="/profile" label="Profile" onClick={onClose} icon={<User />} compact={compact} />
              <NavItem to="/notifications/settings" label="Notification Settings" onClick={onClose} icon={<BarChart3 />} compact={compact} />
            </>
          ) : (
            <>
              {compact ? (
                <NavItem to="/track/foundation" label="Training" onClick={onClose} icon={<BookOpen />} compact={compact} />
              ) : (
                <>
                  <NavItem to="/applicant/dashboard" label="My Application" onClick={onClose} icon={<ClipboardCheck />} compact={compact} />
                  <div className="pt-1">
                    <button
                      onClick={() => setProgramOpen(!programOpen)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5" />
                        <span>Training Program</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${programOpen ? '' : '-rotate-90'}`} />
                    </button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-200 ease-in-out ${programOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-0.5 ml-3">
                      {tracks.map(track => {
                        const trackProg = getTrackProgress(track.id, getModuleProgress);
                        return (
                          <NavLink
                            key={track.id}
                            to={`/track/${track.id}`}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2 text-sm transition-colors border-l-2 ${
                                isActive
                                  ? 'border-blue-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300'
                              }`
                            }
                          >
                            <span className="w-4 h-4 shrink-0 text-current">{trackIcons[track.id]}</span>
                            <span className="flex-1 truncate">{track.name}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">{trackProg.completed}/{trackProg.total}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <NavItem to="/progress-center" label="Achievements" onClick={onClose} icon={<Award />} compact={compact} />
              <NavItem to="/leaderboard" label="Leaderboard" onClick={onClose} icon={<Trophy />} compact={compact} />
              <NavItem to="/readiness-reviews" label="Mentor Feedback" onClick={onClose} icon={<MessageSquare />} compact={compact} />
              <NavItem to="/portfolio" label="My Portfolio" onClick={onClose} icon={<Award />} compact={compact} />
              <NavItem to="/profile" label="Profile" onClick={onClose} icon={<User />} compact={compact} />
            </>
          )}
        </nav>

        {/* User info + sign out */}
        {!compact && user && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
