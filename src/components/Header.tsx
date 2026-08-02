import { Link, useLocation } from 'react-router-dom';
import PillNav from './react-bits/PillNav/PillNav';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-white/5 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-7">
        <div className="w-40" aria-hidden="true" />

        <div className="hidden items-center justify-center flex-1 md:flex px-8">
          <PillNav
            items={navLinks.map(l => ({ href: l.to, label: l.label }))}
            activeHref={location.pathname}
            baseColor="#F1F2EE"
            pillColor="transparent"
            pillTextColor="#9AA1A3"
            hoveredPillTextColor="#000000"
            initialLoadAnimation={true}
          />
        </div>

        <div className="flex items-center gap-5">
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
        </div>
      </div>
    </header>
  );
}
