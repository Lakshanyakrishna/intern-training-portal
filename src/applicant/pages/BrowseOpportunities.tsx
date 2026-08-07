import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Grid, CheckCircle } from '../../components/Icons';
import Logo from '../../components/Logo';
import EmptyState from '../components/EmptyState';
import OpportunityCard from '../components/OpportunityCard';
import { useAuth } from '../../contexts/AuthContext';
import { autoApply } from '../utils/autoApply';
import { getOpportunities } from '../../lib/db';
import { mapDbOpportunityToApplicant } from '../utils/mapOpportunity';
import type { Opportunity } from '../types';

// This page has no theme toggle of its own -- ApplicantExperience owns
// that control and writes the choice to localStorage. Without this, a
// direct/refreshed visit here (no ApplicantExperience mount in this page
// session) would render light regardless of the user's saved preference.
function useSyncThemeClass() {
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
}

// Full browse-and-search view over every open opportunity -- the dashboard
// (NoApplicationStage) only ever teases a handful. This is the one place
// built to scale as the real list grows past a screenful: categories are
// derived from the data itself rather than hardcoded, so a new category
// shows up as a filter automatically instead of needing a code change.
export default function BrowseOpportunities() {
  useSyncThemeClass();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [filtersHighlighted, setFiltersHighlighted] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    let cancelled = false;
    getOpportunities('active').then(rows => {
      if (!cancelled) setOpportunities(rows.map(mapDbOpportunityToApplicant));
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(opportunities.map(o => o.category)))],
    [opportunities]
  );

  // "Find your fit" (QuickStats, dashboard) sends applicants here wanting to
  // narrow by domain, not just see the raw list -- distinct from "Explore
  // now," which lands on the same page with no special behavior. Replacing
  // history clears the state so a refresh/back-nav doesn't re-trigger it.
  useEffect(() => {
    const shouldFocusFilters = (location.state as { focusFilters?: boolean } | null)?.focusFilters;
    if (shouldFocusFilters) {
      filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFiltersHighlighted(true);
      const timeout = setTimeout(() => setFiltersHighlighted(false), 2000);
      navigate('/applicant/opportunities', { replace: true, state: null });
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities.filter(opp => {
      const matchesCategory = category === 'All' || opp.category === category;
      const matchesQuery = !q || opp.title.toLowerCase().includes(q) || opp.skills.some(s => s.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [opportunities, query, category]);

  // One-click apply (shared with ApplicantExperience's onApply): if a
  // profile resume already exists, submits for real immediately instead of
  // sending them through the form again. Falls back to the real form when
  // there's nothing to auto-attach. opportunityId is the real DB row id
  // (see mapDbOpportunityToApplicant) and always has to reach both
  // navigate() and autoApply() -- dropping it is what silently assigns a
  // new intern to the wrong training track.
  const handleApply = async (opportunityId: string) => {
    if (!user || applyingId) {
      navigate(`/apply/${opportunityId}`);
      return;
    }
    setApplyingId(opportunityId);
    try {
      const result = await autoApply(user, opportunityId);
      if (result.status === 'applied') {
        showToast('Applied — track it from My Journey.');
      } else if (result.status === 'already-applied') {
        showToast("You've already applied — check My Journey for status.");
      } else if (result.status === 'needs-form') {
        navigate(`/apply/${opportunityId}`);
      } else {
        showToast(result.message);
      }
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary">
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur border-b border-line px-4 sm:px-6 h-14 flex items-center gap-3">
        <Link
          to="/applicant"
          className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg px-1.5 py-1 -ml-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <span className="w-px h-4 bg-line" />
        <div className="flex items-center gap-2">
          <Logo withText={false} className="" iconClassName="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-primary tracking-tight">Lumora <span className="text-secondary font-normal">· Internship Program</span></span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-primary mb-1">Browse all opportunities</h1>
          <p className="text-sm text-secondary">
            {filtered.length === opportunities.length
              ? `${opportunities.length} open opportunit${opportunities.length === 1 ? 'y' : 'ies'}`
              : `${filtered.length} of ${opportunities.length} opportunities`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title or skill..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary placeholder:text-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>
          <div
            ref={filtersRef}
            className={`flex flex-wrap gap-2 p-1.5 -m-1.5 rounded-xl transition-shadow duration-500 ${
              filtersHighlighted ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''
            }`}
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  category === cat
                    ? 'bg-accent text-accent-text border-accent'
                    : 'bg-surface text-secondary border-line hover:text-primary hover:border-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Grid className="w-5 h-5" />}
            title="No matches"
            description="Try a different search term or category."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} onApply={handleApply} applying={applyingId === opp.id} />
            ))}
          </div>
        )}
      </main>

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.2s_ease-out]">
          <div className="flex items-center gap-2.5 bg-surface border border-line rounded-full px-4 py-2.5 shadow-lg shadow-black/10">
            <CheckCircle className="w-4 h-4 text-accent shrink-0" />
            <p className="text-sm font-medium text-primary">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
