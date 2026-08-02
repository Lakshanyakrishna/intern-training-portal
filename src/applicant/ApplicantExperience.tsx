import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserSettings, upsertUserSettings } from '../lib/db';
import { Sun, Moon, XCircle } from '../components/Icons';
import JourneyTracker from './components/JourneyTracker';
import CurrentMission from './components/CurrentMission';
import StageContent from './components/StageContent';
import ActivityFeed from './components/ActivityFeed';
import NotificationPreview from './components/NotificationPreview';
import HelpPanel from './components/HelpPanel';
import { MOCK_OPPORTUNITIES } from './mock/opportunities';
import { applicationForStage } from './mock/application';
import { MOCK_INTERVIEW_SLOTS, MOCK_SCHEDULED_INTERVIEW } from './mock/interviews';
import { activityForStage } from './mock/activity';
import { MOCK_NOTIFICATIONS } from './mock/notifications';
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

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse bg-surface-alt rounded-2xl ${className}`} />;
}

// The single hook-shaped piece of state + business logic for this whole
// experience. Every Stage component downstream is pure; all mock-state
// mutation happens here so that swapping mock data for real API calls
// later means rewriting this function only, not any component.
function useApplicantJourney() {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<Stage>('no_application');
  const [opportunityTitle, setOpportunityTitle] = useState(MOCK_OPPORTUNITIES[0]?.title ?? '');
  const [scheduledInterview, setScheduledInterview] = useState<ScheduledInterview>(MOCK_SCHEDULED_INTERVIEW);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

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
    onAcceptOffer: () => { /* [Placeholder] would call the accept-offer endpoint */ },
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
  const { loading, stage, setStage, application, scheduledInterview, actions } = useApplicantJourney();

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
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur border-b border-line px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold text-primary tracking-tight">Lumora <span className="text-secondary font-normal">· Internship Program</span></span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDarkMode(p => !p)}
            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <span className="text-xs text-secondary hidden sm:inline px-2">{user?.name}</span>
          <button
            onClick={signOut}
            className="text-xs font-medium text-secondary hover:text-primary transition-colors px-2 py-2 rounded-lg hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-secondary mb-1.5">
            {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Your journey</h1>
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
              <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary">Preview stage</span>
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
            <p className="text-[10px] text-secondary mt-2.5 leading-relaxed">Dev tool — jumps between mock states while this route runs without a backend.</p>
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
