import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, Search } from '../../components/Icons';
import lumoraLogo from '../../assets/lumora-logo.png';
import EmptyState from '../components/EmptyState';
import OpportunityCard from '../components/OpportunityCard';
import { MOCK_OPPORTUNITIES } from '../mock/opportunities';

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
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(MOCK_OPPORTUNITIES.map(o => o.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_OPPORTUNITIES.filter(opp => {
      const matchesCategory = category === 'All' || opp.category === category;
      const matchesQuery = !q || opp.title.toLowerCase().includes(q) || opp.skills.some(s => s.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  // Apply from here hands off to the applicant dashboard's own mock-state
  // hook (useApplicantJourney) via router state, rather than duplicating
  // application logic on this page -- ApplicantExperience picks this up on
  // mount and advances the stage there.
  const handleApply = (opportunityId: string) => {
    navigate('/applicant', { state: { applyToOpportunityId: opportunityId } });
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
          <img src={lumoraLogo} alt="" className="w-5 h-5 invert dark:invert-0" />
          <span className="text-sm font-bold text-primary tracking-tight">Lumora <span className="text-secondary font-normal">· Internship Program</span></span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-primary mb-1">Browse all opportunities</h1>
          <p className="text-sm text-secondary">
            {filtered.length === MOCK_OPPORTUNITIES.length
              ? `${MOCK_OPPORTUNITIES.length} open opportunit${MOCK_OPPORTUNITIES.length === 1 ? 'y' : 'ies'}`
              : `${filtered.length} of ${MOCK_OPPORTUNITIES.length} opportunities`}
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
          <div className="flex flex-wrap gap-2">
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
              <OpportunityCard key={opp.id} opportunity={opp} onApply={handleApply} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
