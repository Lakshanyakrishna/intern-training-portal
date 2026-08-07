import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen,
  Layers,
  Briefcase,
  Flag,
  Users,
  ClipboardCheck,
  BarChart3,
  User,
  LogOut,
  Grid,
  Target,
} from './Icons';

// The sidebar is always dark (see --color-sidebar-* in index.css), regardless
// of the app's own light/dark toggle, so its own classes never need a dark:
// variant -- they'd be fighting a background that never changes.
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
            ? 'border-sidebar-accent bg-sidebar-surface text-sidebar-text font-medium'
            : 'border-transparent text-sidebar-text-secondary hover:bg-sidebar-surface hover:text-sidebar-text'
        }`
      }
    >
      <span className="w-5 h-5 shrink-0 text-current">{icon}</span>
      {!compact && <span className="flex-1 truncate">{label}</span>}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose, compact }: { open: boolean; onClose: () => void; compact?: boolean }) {
  const { user, signOut } = useAuth();
  const isMentor = user?.role === 'mentor' || user?.role === 'admin';
  const isApplicant = user?.role === 'applicant';

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-30 h-full bg-sidebar-bg border-r border-sidebar-line transform transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
        compact ? 'w-16' : 'w-60'
      } ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className={`${compact ? 'justify-center' : 'px-4'} h-14 flex items-center border-b border-sidebar-line shrink-0`}>
          {compact ? (
            <span className="text-sm font-bold text-sidebar-accent">IR</span>
          ) : (
            <div>
              <h1 className="text-sm font-semibold text-sidebar-text leading-tight">Intern Readiness</h1>
              <p className="text-[11px] text-sidebar-text-secondary">Project Allocation System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
          {isApplicant ? (
            <>
              <NavItem to="/applicant" label="My Journey" onClick={onClose} icon={<ClipboardCheck />} compact={compact} />
              <NavItem to="/profile" label="Profile" onClick={onClose} icon={<User />} compact={compact} />
              <NavItem to="/notifications/settings" label="Notification Settings" onClick={onClose} icon={<BarChart3 />} compact={compact} />
            </>
          ) : user?.role === 'admin' ? (
            <>
              <div className="pt-2 pb-1 px-3">
                <p className="text-[11px] font-semibold text-sidebar-text-secondary uppercase tracking-wider">Admin</p>
              </div>
              <NavItem to="/admin/applications" label="Applications" onClick={onClose} icon={<ClipboardCheck />} compact={compact} />
              <NavItem to="/admin/interviews" label="Interviews" onClick={onClose} icon={<Grid />} compact={compact} />
              <NavItem to="/admin/opportunities" label="Opportunities" onClick={onClose} icon={<Flag />} compact={compact} />
              <NavItem to="/admin/conversion" label="Conversion" onClick={onClose} icon={<Flag />} compact={compact} />
              <NavItem to="/admin/tracks" label="Training Tracks" onClick={onClose} icon={<Layers />} compact={compact} />
              <NavItem to="/admin/mentors" label="Mentor Assign" onClick={onClose} icon={<Users />} compact={compact} />
              <NavItem to="/admin/projects" label="Projects" onClick={onClose} icon={<Briefcase />} compact={compact} />
              <NavItem to="/admin/notifications" label="Notifications" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/admin/screening-report" label="Screening Report" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/admin/completion-report" label="Completion Report" onClick={onClose} icon={<BarChart3 />} compact={compact} />

              <div className="pt-3 pb-1 px-3">
                <p className="text-[11px] font-semibold text-sidebar-text-secondary uppercase tracking-wider">Mentor</p>
              </div>
              <NavItem to="/mentor" label="Mentor Dashboard" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/mentor/evaluate" label="Readiness Eval" onClick={onClose} icon={<Target />} compact={compact} />
              <NavItem to="/mentor/interns" label="Intern Mgmt" onClick={onClose} icon={<Users />} compact={compact} />
              <NavItem to="/mentor/reviews" label="Reviews" onClick={onClose} icon={<ClipboardCheck />} compact={compact} />
              <NavItem to="/profile" label="Profile" onClick={onClose} icon={<User />} compact={compact} />
              <NavItem to="/notifications/settings" label="Notification Settings" onClick={onClose} icon={<BarChart3 />} compact={compact} />
            </>
          ) : isMentor ? (
            <>
              <div className="pt-2 pb-1 px-3">
                <p className="text-[11px] font-semibold text-sidebar-text-secondary uppercase tracking-wider">Mentor</p>
              </div>
              <NavItem to="/mentor" label="Dashboard" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/mentor/evaluate" label="Readiness Eval" onClick={onClose} icon={<Target />} compact={compact} />
              <NavItem to="/mentor/interns" label="Intern Mgmt" onClick={onClose} icon={<Users />} compact={compact} />
              <NavItem to="/mentor/reviews" label="Reviews" onClick={onClose} icon={<ClipboardCheck />} compact={compact} />
              <NavItem to="/mentor/readiness" label="Project Readiness" onClick={onClose} icon={<BarChart3 />} compact={compact} />
              <NavItem to="/mentor/completion-review" label="Completion Review" onClick={onClose} icon={<Flag />} compact={compact} />
              <NavItem to="/profile" label="Profile" onClick={onClose} icon={<User />} compact={compact} />
              <NavItem to="/notifications/settings" label="Notification Settings" onClick={onClose} icon={<BarChart3 />} compact={compact} />
            </>
          ) : (
            <>
              <NavItem to="/training" label="Training" end onClick={onClose} icon={<BookOpen />} compact={compact} />
              <NavItem to="/profile" label="Profile" onClick={onClose} icon={<User />} compact={compact} />
            </>
          )}
        </nav>

        {/* User info + sign out */}
        {!compact && user && (
          <div className="border-t border-sidebar-line p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-sidebar-surface flex items-center justify-center text-xs font-bold text-sidebar-accent shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-sidebar-text truncate">{user.name}</p>
                <p className="text-[11px] text-sidebar-text-secondary capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-sidebar-text-secondary hover:text-red-400 hover:bg-sidebar-surface rounded-lg transition-colors"
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
