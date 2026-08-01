import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roleHomePath } from '../utils/roleHome';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-white/5 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-7">
        <div className="w-40" aria-hidden="true" />

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative pb-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                  isActive ? 'text-[#F1F2EE]' : 'text-[#9AA1A3] hover:text-[#C6CAC9]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#F1F2EE]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {user ? (
            <Link
              to={roleHomePath(user.role)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F2EE] px-5 py-2.5 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03]"
            >
              {user.name.split(' ')[0]}'s Dashboard
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9AA1A3] transition-colors hover:text-[#C6CAC9]"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F2EE] px-5 py-2.5 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03]"
              >
                Get Started
                <span aria-hidden="true">→</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
