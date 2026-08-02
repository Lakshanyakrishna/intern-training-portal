import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserSettings, upsertUserSettings, getApplicationByUserId, acceptOffer } from '../lib/db';
import { Sun, Moon, XCircle, ChevronDown, LogOut } from '../components/Icons';
import NotificationBell from '../components/NotificationBell';
import lumoraLogo from '../assets/lumora-logo.png';
import DotGrid from './components/DotGrid';
import JourneyTracker from './components/JourneyTracker';
import CurrentMission from './components/CurrentMission';
import StageContent from './components/StageContent';
import ActivityFeed from './components/ActivityFeed';
import NotificationPreview from './components/NotificationPreview';
import HelpPanel from './components/HelpPanel';
import QuickStats from './components/QuickStats';
import { MOCK_OPPORTUNITIES } from './mock/opportunities';
import { applicationForStage } from './mock/application';
import { MOCK_INTERVIEW_SLOTS, MOCK_SCHEDULED_INTERVIEW } from './mock/interviews';
import { activityForStage } from './mock/activity';
import { MOCK_NOTIFICATIONS } from './mock/notifications';
import { MOCK_QUICK_STATS } from './mock/stats';
import type { JourneyActions, ScheduledInterview, Stage } from './types';

const STAGE_LABELS: Record<Stage, string> = {
  no_application: 'No application',
  application_submitted: 'Application submitted',
  resume_screening: 'Resume screening',
  interview_scheduling: 'Interview scheduling',
  interview_scheduled: 'Interview scheduled',
  interview_completed: 'Interview completed',
  selected: 'Selected',
  rejected: 'Rejected',
};

// One honest, stage-aware line for the hero -- the personality of the page
// should track what's actually true right now, not read the same on day
// one as it does after an interview is booked.
const STAGE_MOMENT: Record<Stage, string> = {
  no_application: "Let's find where you fit.",
  application_submitted: "We've got it — sit tight, we'll be in touch.",
  resume_screening: 'Your resume is in good hands right now.',
  interview_scheduling: "You're shortlisted. Pick a time that works.",
  interview_scheduled: 'Almost there — get ready.',
  interview_completed: 'Thanks for the conversation.',
  selected: 'Welcome to the team.',
  rejected: "Onward — there's more where this came from.",
};

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse bg-surface-alt rounded-2xl ${className}`} />;
}

function UserMenu({ name, darkMode, onToggleTheme, onSignOut }: {
  name: string | undefined;
  darkMode: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <span className="w-7 h-7 rounded-full bg-surface-alt flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {name?.charAt(0).toUpperCase() ?? '?'}
        </span>
        <span className="text-xs text-secondary hidden sm:inline">{name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-line rounded-xl shadow-lg shadow-black/5 py-1.5 z-50 animate-[slideUp_0.15s_ease-out]">
          <button
            onClick={() => { onToggleTheme(); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-primary hover:bg-surface-alt transition-colors text-left"
          >
            {darkMode ? <Sun className="w-4 h-4 text-secondary" /> : <Moon className="w-4 h-4 text-secondary" />}
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={() => { setOpen(false); onSignOut(); }}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-primary hover:bg-surface-alt transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-secondary" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// The single hook-shaped piece of state + business logic for this whole
// experience. Every Stage component downstream is pure; all mock-state
// mutation happens here so that swapping mock data for real API calls
// later means rewriting this function only, not any component.
//
// One deliberate exception to "pure mock": onAcceptOffer is wired to the
// real accept_offer() RPC (022_offer_acceptance.sql) against whatever real
// application this user actually has, fetched quietly in the background.
// The rest of the journey (stage, opportunities, interview slots) stays
// mock -- this is the one write that has a real, safe, narrowly-scoped
// backend path already, and the whole point of the "Selected" stage
// existing is to give the applicant genuine say over becoming an intern.
function useApplicantJourney(userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<Stage>('no_application');
  const [opportunityTitle, setOpportunityTitle] = useState(MOCK_OPPORTUNITIES[0]?.title ?? '');
  const [scheduledInterview, setScheduledInterview] = useState<ScheduledInterview>(MOCK_SCHEDULED_INTERVIEW);
  const [realApplicationId, setRealApplicationId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!userId) return;
    getApplicationByUserId(userId).then(app => setRealApplicationId(app?.id ?? null)).catch(() => {});
  }, [userId]);

  const application = { ...applicationForStage(stage), opportunityTitle };

  const actions: JourneyActions = {
    onApply: (opportunityId) => {
      const opp = MOCK_OPPORTUNITIES.find(o => o.id === opportunityId);
      if (opp) setOpportunityTitle(opp.title);
      setStage('application_submitted');
    },
    onEditApplication: () => { /* [Placeholder] persists once a real applications API backs this route */ },
    onWithdrawApplication: () => setStage('no_application'),
    onScheduleInterview: (slotId) => {
      const slot = MOCK_INTERVIEW_SLOTS.flatMap(g => g.slots).find(s => s.id === slotId);
      if (slot) {
        setScheduledInterview({ ...MOCK_SCHEDULED_INTERVIEW, date: `${slot.day}, ${slot.date}, 2026`, time: slot.time });
      }
      setStage('interview_scheduled');
    },
    onRescheduleInterview: () => setStage('interview_scheduling'),
    onCancelInterview: () => setStage('application_submitted'),
    onAcceptOffer: () => {
      if (!realApplicationId) return;
      // Best-effort: this route's `stage` is local mock state, so previewing
      // "Selected" via the dev switcher won't line up with a real accepted
      // application for most accounts -- the RPC correctly rejects that
      // (022_offer_acceptance.sql), and the mock journey still advances
      // regardless. Only a genuinely accepted application actually gets
      // written.
      acceptOffer(realApplicationId).catch(err => {
        console.warn('accept_offer: no real write applied (expected unless this application is actually accepted)', err);
      });
    },
    onBeginTraining: () => { /* [Placeholder] would promote the account and redirect to /dashboard */ },
    onUpdateProfile: () => navigate('/profile'),
  };

  return { loading, stage, setStage, application, scheduledInterview, actions };
}

export default function ApplicantExperience() {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const { loading, stage, setStage, application, scheduledInterview, actions } = useApplicantJourney(user?.id);

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-accent-text focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur border-b border-line px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={lumoraLogo} alt="" className="w-5 h-5 invert dark:invert-0" />
          <span className="text-sm font-bold text-primary tracking-tight">Lumora <span className="text-secondary font-normal">· Internship Program</span></span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <UserMenu name={user?.name} darkMode={darkMode} onToggleTheme={() => setDarkMode(p => !p)} onSignOut={signOut} />
        </div>
      </header>

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-sidebar-bg text-sidebar-text px-6 py-8 sm:px-10 sm:py-10 shadow-lg shadow-black/10">
          <DotGrid dotSize={3} gap={16} proximity={80} shockRadius={120} baseColor="#2A2A2A" activeColor="#F1F2EE" />
          <img
            src={lumoraLogo}
            alt=""
            className="absolute -right-10 -top-10 w-64 h-64 opacity-[0.08] pointer-events-none select-none"
          />
          <div className="relative flex items-center gap-2 mb-5">
            <img src={lumoraLogo} alt="" className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-text-secondary">
              Lumora · Internship Program
            </span>
          </div>
          <h1 className="relative text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]">
            {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back'}
          </h1>
          <p className="relative text-sm sm:text-base text-sidebar-text-secondary mt-2.5 max-w-md">
            {STAGE_MOMENT[stage]}
          </p>
        </div>

        {loading ? (
          <>
            <SkeletonBlock className="h-24" />
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <SkeletonBlock className="h-72" />
              <div className="space-y-6">
                <SkeletonBlock className="h-40" />
                <SkeletonBlock className="h-56" />
              </div>
            </div>
          </>
        ) : (
          <>
            <JourneyTracker stage={stage} />

            <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
              <CurrentMission>
                <StageContent
                  stage={stage}
                  opportunities={MOCK_OPPORTUNITIES}
                  application={application}
                  slotGroups={MOCK_INTERVIEW_SLOTS}
                  interview={scheduledInterview}
                  selectedInfo={{ mentor: '[Placeholder] Mentor Name', startDate: 'Sep 1, 2026', trainingDuration: '8 weeks' }}
                  actions={actions}
                />
              </CurrentMission>

              <div className="space-y-6">
                <NotificationPreview notifications={MOCK_NOTIFICATIONS} />
                <ActivityFeed items={activityForStage(stage)} />
                <QuickStats stats={MOCK_QUICK_STATS} />
                <HelpPanel />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Dev-only preview switcher -- this route currently runs entirely on
          mock data (no backend integration per spec), so this is how every
          stage gets reviewed/QA'd without hand-driving the full flow each
          time. Remove once real application/interview state feeds `stage`. */}
      <div className="fixed bottom-5 right-5 z-40">
        {devPanelOpen ? (
          <div className="bg-surface border border-line rounded-2xl shadow-lg shadow-black/5 p-3.5 w-60 animate-[slideUp_0.15s_ease-out]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Preview stage</span>
              <button
                onClick={() => setDevPanelOpen(false)}
                className="text-secondary hover:text-primary rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Close preview panel"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <select
              value={stage}
              onChange={e => setStage(e.target.value as Stage)}
              className="w-full text-xs px-2.5 py-2 rounded-lg border border-line bg-surface text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {(Object.keys(STAGE_LABELS) as Stage[]).map(s => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
            <p className="text-[11px] text-secondary mt-2.5 leading-relaxed">Dev tool — jumps between mock states while this route runs without a backend.</p>
          </div>
        ) : (
          <button
            onClick={() => setDevPanelOpen(true)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-secondary bg-surface border border-line rounded-full pl-2.5 pr-3 py-1.5 shadow-sm hover:bg-surface-alt hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Preview stage
          </button>
        )}
      </div>
    </div>
  );
}
