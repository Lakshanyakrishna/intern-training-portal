import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserSettings, upsertUserSettings, getApplicationByUserId, getInterviewsByApplicant,
  acceptOffer, withdrawApplication, beginTraining, getNotifications,
} from '../lib/db';
import type { DbApplication, DbInterview } from '../lib/db';
import { notifyEvent } from '../lib/notifications';
import { roleHomePath } from '../utils/roleHome';
import { Sun, Moon, XCircle, ChevronDown, LogOut } from '../components/Icons';
import NotificationBell from '../components/NotificationBell';
import Logo from '../components/Logo';
import DotGrid from './components/DotGrid';
import CurrentMission from './components/CurrentMission';
import EstimatedTimeline from './components/EstimatedTimeline';
import WhatsNext from './components/WhatsNext';
import StageContent from './components/StageContent';
import QuickAccessDock from './components/QuickAccessDock';
import QuickStats from './components/QuickStats';
import { MOCK_OPPORTUNITIES } from './mock/opportunities';
import { applicationForStage } from './mock/application';
import { MOCK_INTERVIEW_SLOTS, MOCK_SCHEDULED_INTERVIEW } from './mock/interviews';
import { activityForStage } from './mock/activity';
import { notificationsForStage } from './mock/notifications';
import { MOCK_QUICK_STATS } from './mock/stats';
import type {
  ActivityItem, ApplicationSummary, JourneyActions, NotificationItem, NotificationKind,
  ScheduledInterview, Stage,
} from './types';

// Real application status -> Stage. Only reachable states from the real
// admin-driven pipeline: no self-serve interview booking exists yet, so
// "shortlisted with no interview row" maps to interview_scheduling (an
// admin needs to book it), not a state the applicant can act on directly.
function deriveStageFromReal(app: DbApplication, interview: DbInterview | null): Stage {
  if (app.status === 'rejected') return 'rejected';
  if (app.status === 'accepted') return 'selected';
  if (app.status === 'shortlisted') {
    if (!interview || interview.status === 'cancelled') return 'interview_scheduling';
    if (interview.status === 'completed') return 'interview_completed';
    return 'interview_scheduled'; // 'scheduled' or 'rescheduled'
  }
  if (app.status === 'reviewed') return 'resume_screening';
  return 'application_submitted'; // 'pending'
}

function eventTypeToKind(eventType: string): NotificationKind {
  if (eventType.startsWith('interview')) return 'interview';
  if (eventType.startsWith('application') || eventType === 'offer_accepted') return 'application';
  return 'progress';
}

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// Built from the same real fields the rest of the page already fetches --
// not a fabricated timeline, just those events rendered as a feed.
function buildRealActivity(app: DbApplication, interview: DbInterview | null): ActivityItem[] {
  const items: ActivityItem[] = [
    { id: 'real-submitted', icon: 'submitted', title: 'Application submitted', description: 'Your application was received', timestamp: app.appliedAt },
  ];
  if (app.reviewedAt) {
    items.push({
      id: 'real-reviewed',
      icon: 'mentor',
      title: app.status === 'shortlisted' ? 'Shortlisted for interview' : 'Application reviewed',
      description: app.status === 'shortlisted' ? "You've moved to the interview round" : 'Your application was reviewed',
      timestamp: app.reviewedAt,
    });
  }
  if (interview) {
    items.push({
      id: 'real-interview-scheduled',
      icon: 'interview',
      title: 'Interview scheduled',
      description: new Date(interview.scheduledAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: interview.createdAt,
    });
    if (interview.status === 'completed') {
      items.push({ id: 'real-interview-completed', icon: 'decision', title: 'Interview completed', description: 'Awaiting a decision', timestamp: interview.scheduledAt });
    }
  }
  if (app.status === 'accepted') {
    items.push({ id: 'real-selected', icon: 'training', title: 'Selected', description: "You've been offered a spot", timestamp: app.reviewedAt ?? app.appliedAt });
  }
  if (app.withdrawnAt) {
    items.push({ id: 'real-withdrawn', icon: 'decision', title: 'Application withdrawn', description: "You're welcome to apply again anytime", timestamp: app.withdrawnAt });
  }
  if (app.offerAcceptedAt) {
    items.push({ id: 'real-offer-accepted', icon: 'training', title: 'Offer accepted', description: 'Welcome to the team', timestamp: app.offerAcceptedAt });
  }
  return items.slice().reverse();
}

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
// experience. `stage` defaults to real data the moment it loads (isLive
// true) -- application status + interview status, derived above -- so a
// real applicant always sees their genuine current status, not a stale
// mock default. The dev "Preview stage" switcher can still override it for
// design QA (via previewStage), which drops isLive to false; every stage
// component downstream uses that flag to hide interactive controls that
// have no real backend yet (self-serve interview booking/reschedule)
// instead of silently faking success for a real applicant.
function useApplicantJourney(userId: string | undefined, userName: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [stage, setStageState] = useState<Stage>('no_application');
  const [isLive, setIsLive] = useState(false);
  const [opportunityTitle] = useState(MOCK_OPPORTUNITIES[0]?.title ?? '');
  const [scheduledInterview, setScheduledInterview] = useState<ScheduledInterview>(MOCK_SCHEDULED_INTERVIEW);
  const [realApplication, setRealApplication] = useState<DbApplication | null>(null);
  const [realInterview, setRealInterview] = useState<DbInterview | null>(null);
  const [realNotifications, setRealNotifications] = useState<NotificationItem[] | null>(null);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getApplicationByUserId(userId).then(async app => {
      if (cancelled) return;
      setRealApplication(app);
      if (!app || app.withdrawnAt) {
        setStageState('no_application');
        setIsLive(true);
        return;
      }
      const interviews = await getInterviewsByApplicant(userId).catch(() => []);
      if (cancelled) return;
      const interview = interviews[0] ?? null;
      setRealInterview(interview);
      setStageState(deriveStageFromReal(app, interview));
      setIsLive(true);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [userId]);

  // Exposed (not just effect-only) so real actions below can refresh the
  // dock immediately after writing a new notification -- without this, a
  // real applicant who withdraws mid-session sees the confirmation land in
  // the database but not in the panel until they reload the page.
  function refreshNotifications() {
    if (!userId) return;
    getNotifications(userId, 10).then(list => {
      setRealNotifications(list.map(n => ({
        id: n.id,
        title: n.title,
        timestamp: formatRelativeTime(n.createdAt),
        read: n.isRead,
        kind: eventTypeToKind(n.eventType),
      })));
    }).catch(() => {});
  }

  useEffect(() => {
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Dev-only override for design QA -- distinct from the internal setter
  // above so touching it always means "I'm previewing, not looking at my
  // real status," which drops isLive and makes every gated action fall
  // back to its harmless local-only behavior.
  function previewStage(next: Stage) {
    setStageState(next);
    setIsLive(false);
  }

  const realApplicationSummary: ApplicationSummary | null =
    realApplication && !realApplication.withdrawnAt
      ? {
          id: realApplication.id,
          opportunityTitle: 'the program',
          submittedAt: realApplication.appliedAt,
          status: stage,
          estimatedReviewDays: [1, 3],
        }
      : null;

  const application = realApplicationSummary ?? { ...applicationForStage(stage), opportunityTitle };

  const realScheduledInterview: ScheduledInterview | null = realInterview
    ? {
        date: new Date(realInterview.scheduledAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
        time: new Date(realInterview.scheduledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        mentor: realInterview.interviewers[0] || 'Our team',
        mentorRole: 'Interviewer',
        platform: realInterview.meetLink ? 'Video call' : 'Details to follow',
      }
    : null;

  const actions: JourneyActions = {
    // No real opportunity data to browse/select yet, so this always routes
    // to the real generic application form rather than faking a submission
    // against a placeholder opportunity -- whatever a real applicant does
    // here actually persists.
    onApply: () => navigate('/apply'),
    onEditApplication: () => { /* [Placeholder] no real edit endpoint yet -- hidden once isLive */ },
    onWithdrawApplication: () => {
      if (isLive && realApplication && userId) {
        withdrawApplication(realApplication.id).then(() => {
          setRealApplication(prev => (prev ? { ...prev, withdrawnAt: new Date().toISOString() } : prev));
          setStageState('no_application');
          notifyEvent('application_withdrawn', userId, {
            name: userName ?? 'there',
            opportunity: 'the program',
          }).catch(() => {}).finally(refreshNotifications);
        }).catch(err => {
          console.warn('withdraw_application failed', err);
        });
        return;
      }
      setStageState('no_application'); // preview/demo mode -- local only
    },
    onScheduleInterview: (slotId) => {
      const slot = MOCK_INTERVIEW_SLOTS.flatMap(g => g.slots).find(s => s.id === slotId);
      if (slot) {
        setScheduledInterview({ ...MOCK_SCHEDULED_INTERVIEW, date: `${slot.day}, ${slot.date}, 2026`, time: slot.time });
      }
      setStageState('interview_scheduled');
    },
    onRescheduleInterview: () => setStageState('interview_scheduling'),
    onCancelInterview: () => setStageState('application_submitted'),
    onAcceptOffer: () => {
      if (!realApplication || !userId) return;
      acceptOffer(realApplication.id).then(() => {
        setRealApplication(prev => (prev ? { ...prev, offerAcceptedAt: new Date().toISOString() } : prev));
        notifyEvent('offer_accepted', userId, {
          name: userName ?? 'there',
          opportunity: 'the program',
        }).catch(() => {}).finally(refreshNotifications);
      }).catch(err => {
        console.warn('accept_offer: no real write applied (expected unless this application is actually accepted)', err);
      });
    },
    onBeginTraining: () => {
      if (isLive) {
        // Server-side promotion (034_begin_training.sql) -- rejected there
        // unless this account's application is actually accepted + the
        // offer confirmed, so a failure here means those preconditions
        // weren't met, not a UI bug.
        // refreshUser must resolve before navigating -- ProtectedRoute reads
        // user.role on the very first render of the destination route, and
        // the context still holds the stale 'applicant' role until this
        // finishes, which would otherwise bounce the redirect right back out.
        beginTraining().then(() => refreshUser()).then(() => {
          navigate(roleHomePath('intern'));
        }).catch(err => {
          console.warn('begin_training failed', err);
        });
        return;
      }
      navigate(roleHomePath('intern')); // preview/demo mode -- no real promotion, just showing where it leads
    },
    onUpdateProfile: () => navigate('/profile'),
  };

  return {
    loading,
    stage,
    previewStage,
    application,
    scheduledInterview: realScheduledInterview ?? scheduledInterview,
    actions,
    isLive,
    offerAccepted: !!realApplication?.offerAcceptedAt,
    realActivity: realApplication ? buildRealActivity(realApplication, realInterview) : null,
    realNotifications,
  };
}

export default function ApplicantExperience() {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const {
    loading, stage, previewStage, application, scheduledInterview, actions,
    isLive, offerAccepted, realActivity, realNotifications,
  } = useApplicantJourney(user?.id, user?.name);

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
          <Logo 
            withText={false} 
            className="" 
            iconClassName="w-5 h-5 text-primary" 
          />
          <span className="text-sm font-bold text-primary tracking-tight">Lumora <span className="text-secondary font-normal">· Internship Program</span></span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <UserMenu name={user?.name} darkMode={darkMode} onToggleTheme={() => setDarkMode(p => !p)} onSignOut={signOut} />
        </div>
      </header>

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-36 space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-sidebar-bg text-sidebar-text px-6 py-8 sm:px-10 sm:py-10 shadow-lg shadow-black/10">
          <DotGrid dotSize={3} gap={16} proximity={80} shockRadius={120} baseColor="#2A2A2A" activeColor="#F1F2EE" />
          <Logo 
            withText={false}
            className="absolute -right-10 -top-10 opacity-[0.18] pointer-events-none select-none text-sidebar-text"
            iconClassName="w-64 h-64"
          />
          <div className="relative flex items-center gap-2 mb-5">
            <Logo 
              withText={false} 
              className="" 
              iconClassName="w-5 h-5 text-sidebar-text" 
            />
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
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-72" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
            </div>
          </>
        ) : (
          <>
            {/* Highest-priority guidance right after the hero -- the answer
                to "what happens now" shouldn't compete for attention with
                Quick Stats and Help in the grid below. Estimated Timeline
                rides along as a compact trailing badge here instead of
                repeating as its own full-width card at every stage. */}
            <WhatsNext stage={stage} trailing={<EstimatedTimeline stage={stage} />} />

            {/* Full width -- just the current stage's content (opportunity
                grid, interview scheduler, etc). Everything else (timeline,
                notifications, activity, help) sits below in its own row
                until final placement is decided. */}
            <CurrentMission>
              <StageContent
                stage={stage}
                opportunities={MOCK_OPPORTUNITIES}
                application={application}
                slotGroups={MOCK_INTERVIEW_SLOTS}
                interview={scheduledInterview}
                selectedInfo={{ mentor: '[Placeholder] Mentor Name', startDate: 'Sep 1, 2026', trainingDuration: '8 weeks' }}
                actions={actions}
                isLive={isLive}
                offerAccepted={offerAccepted}
              />
            </CurrentMission>

            <div className="mt-6">
              <QuickStats stats={MOCK_QUICK_STATS} />
            </div>
          </>
        )}
      </main>

      {!loading && (
        <QuickAccessDock
          notifications={isLive && realNotifications ? realNotifications : notificationsForStage(stage)}
          activity={isLive && realActivity ? realActivity : activityForStage(stage)}
        />
      )}

      {/* Dev-only preview switcher -- lets every stage get reviewed/QA'd
          without hand-driving the full real flow. Touching this always
          drops isLive to false (see previewStage in useApplicantJourney),
          so it never risks writing to a real applicant's actual application. */}
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
              onChange={e => previewStage(e.target.value as Stage)}
              className="w-full text-xs px-2.5 py-2 rounded-lg border border-line bg-surface text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {(Object.keys(STAGE_LABELS) as Stage[]).map(s => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
            <p className="text-[11px] text-secondary mt-2.5 leading-relaxed">Dev tool — previews any stage without touching your real application.</p>
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
