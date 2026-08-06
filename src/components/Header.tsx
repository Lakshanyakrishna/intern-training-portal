import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { roleHomePath } from '../utils/roleHome';
import Logo from './Logo';

export interface NavLinkItem {
  to: string;
  label: string;
}

const defaultNavLinks: NavLinkItem[] = [
  { to: '/', label: 'Home' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' }
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/opportunities');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = defaultNavLinks;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b border-[#3A3A3A]/40 transition-all duration-300 ${scrolled || mobileMenuOpen
          ? 'bg-[#000000]/95 backdrop-blur-lg'
          : 'bg-[#050505]/80 backdrop-blur-md'
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-7 relative">
        {/* Left Side: Logo */}
        <div className="flex-1 flex justify-start items-center">
          <Link to="/" className="text-[#F1F2EE] hover:text-[#C6CAC9] transition-colors">
            <Logo 
              className="flex items-center gap-2" 
              iconClassName="w-5 h-5" 
              textClassName="text-lg font-bold tracking-wider" 
            />
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex flex-none items-center justify-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative pb-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-[#F1F2EE]' : 'text-[#9AA1A3] hover:text-[#C6CAC9]'
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

        {/* Right Side: Desktop Actions */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-10">
          {user ? (
            <>
              <Link
                to={roleHomePath(user.role)}
                className="flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#9AA1A3] transition-colors hover:text-[#C6CAC9]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#3A3A3A]/40 px-5 py-2.5 text-[13px] font-semibold text-[#9AA1A3] transition-colors hover:bg-[#3A3A3A]/20 hover:text-[#F1F2EE]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#9AA1A3] transition-colors hover:text-[#C6CAC9]"
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

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3A3A3A]/40 text-[#9AA1A3] hover:text-[#F1F2EE] md:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav className="border-t border-[#3A3A3A]/40 bg-[#000000]/95 backdrop-blur-lg flex flex-col items-center gap-6 py-8 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-[#F1F2EE]' : 'text-[#9AA1A3] hover:text-[#C6CAC9]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="h-[1px] w-1/3 bg-[#3A3A3A]/40 my-2" />
          {user ? (
            <>
              <Link
                to={roleHomePath(user.role)}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9AA1A3] transition-colors hover:text-[#C6CAC9]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9AA1A3] transition-colors hover:text-[#C6CAC9]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9AA1A3] transition-colors hover:text-[#C6CAC9]"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F2EE] px-8 py-3 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03]"
              >
                Get Started →
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
