import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApplicationByUserId, getInterviewsByApplicant, getOpportunity, getResumeFiles, getResumeDownloadUrl } from '../lib/db';
import type { DbApplication, DbInterview, DbOpportunity, DbResumeFile } from '../lib/db';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  reviewed: { label: 'Under Review', color: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300' },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
};

// Journey stages, in order. A rejection can happen at any point after
// submission, so it's handled as an overlay on whichever stage was reached,
// not a fixed slot in the sequence.
const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Decision'] as const;

function stageIndex(application: DbApplication, interviews: DbInterview[]): number {
  if (application.status === 'accepted') return 4;
  if (interviews.some(i => i.status === 'completed')) return 4;
  if (interviews.length > 0) return 3;
  if (application.status === 'shortlisted') return 2;
  // A rejection is always a mentor decision made during review (the AI
  // never auto-rejects), so a rejected application has, at minimum,
  // reached "Under Review" -- never show it collapsed onto "Applied",
  // which would misleadingly read as an invalid submission rather than a
  // reviewed-and-declined one.
  if (application.status === 'reviewed' || application.status === 'rejected') return 1;
  return 0;
}

function JourneyStepper({ application, interviews }: { application: DbApplication; interviews: DbInterview[] }) {
  const isRejected = application.status === 'rejected';
  const current = stageIndex(application, interviews);

  return (
    <div className="flex items-start">
      {STAGES.map((stage, i) => {
        const done = i < current;
        const active = !isRejected && i === current;
        const rejectedHere = isRejected && i === current;
        return (
          <div key={stage} className={`flex items-center ${i < STAGES.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                rejectedHere ? 'bg-red-500 border-red-500 text-white' :
                done ? 'bg-accent border-accent text-accent-text' :
                active ? 'border-accent text-accent bg-surface' :
                'border-line text-secondary bg-surface'
              }`}>
                {rejectedHere ? '✕' : done ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium text-center w-20 ${done || active || rejectedHere ? 'text-primary' : 'text-secondary'}`}>
                {rejectedHere ? 'Not Selected' : stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-5 ${done ? 'bg-accent' : 'bg-line'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Placeholder guidance copy -- the actual review-time targets live in the
// PRD (median time to decision, §4.1) but aren't finalized/measured yet.
// Labeled clearly so whoever owns this copy knows it's a stand-in, not
// real committed numbers.
const NEXT_STEPS: Record<string, string> = {
  pending: '[Placeholder] Applications are typically reviewed within a set number of business days. Exact timing to be confirmed.',
  reviewed: "[Placeholder] Your application has been reviewed and is being considered. You'll hear back once a decision is made.",
  shortlisted: "[Placeholder] You've been shortlisted — expect an interview invitation with a proposed time and joining details.",
  rejected: "This round didn't work out, but decisions are specific to this opportunity — you're welcome to apply to others.",
  accepted: "[Placeholder] Welcome aboard — next steps for onboarding will be shared here.",
};

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [application, setApplication] = useState<DbApplication | null>(null);
  const [interviews, setInterviews] = useState<DbInterview[]>([]);
  const [opportunity, setOpportunity] = useState<DbOpportunity | null>(null);
  const [resume, setResume] = useState<DbResumeFile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getApplicationByUserId(user.id).then(async app => {
      setApplication(app);
      if (app) {
        const [ints, opp, resumes] = await Promise.all([
          getInterviewsByApplicant(user.id),
          app.opportunityId ? getOpportunity(app.opportunityId) : Promise.resolve(null),
          getResumeFiles(app.id).catch(() => []),
        ]);
        setInterviews(ints);
        setOpportunity(opp);
        setResume(resumes[0] ?? null);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  async function handleDownloadResume() {
    if (!resume) return;
    try {
      const url = await getResumeDownloadUrl(resume.filePath);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusInfo = application ? STATUS_LABELS[application.status] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero -- placeholder image slot, real copy. Dark to echo the public
          site's identity so the authenticated app doesn't feel like a
          different product the moment you sign in. */}
      <div className="relative overflow-hidden rounded-2xl bg-sidebar-bg text-sidebar-text px-6 py-10 sm:px-10 sm:py-12">
        <div className="absolute inset-0 flex items-center justify-end opacity-30 pointer-events-none">
          <div className="w-64 h-64 mr-[-2rem] rounded-full border border-dashed border-sidebar-line flex items-center justify-center text-[11px] text-sidebar-text-secondary text-center px-6">
            [ Hero image placeholder ]
          </div>
        </div>
        <div className="relative max-w-md">
          <p className="text-xs font-medium uppercase tracking-wider text-sidebar-text-secondary mb-2">
            Lumora · Internship Program
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {user?.name ? `Welcome, ${user.name.split(' ')[0]}` : 'Welcome'}
          </h1>
          <p className="text-sm text-sidebar-text-secondary mt-2">
            {application
              ? "Here's where things stand with your application."
              : "You haven't applied to an opportunity yet — browse what's open and get started."}
          </p>
        </div>
      </div>

      {!application ? (
        <div className="bg-surface border border-line rounded-xl p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-primary mb-1">No application yet</h2>
          <p className="text-sm text-secondary mb-6">Find an open opportunity and apply — it takes a few minutes.</p>
          <Link
            to="/applicant/opportunities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-text text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Browse Open Opportunities
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-surface border border-line rounded-xl p-6 space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  {opportunity ? opportunity.title : 'Your Application'}
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Applied {new Date(application.appliedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              {statusInfo && (
                <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              )}
            </div>

            <JourneyStepper application={application} interviews={interviews} />
          </div>

          <div className="bg-surface border border-line rounded-xl p-6">
            <h2 className="text-sm font-semibold text-primary mb-2">What happens next</h2>
            <p className="text-sm text-secondary">{NEXT_STEPS[application.status] ?? 'Check back here for updates on your application.'}</p>
          </div>

          {interviews.length > 0 && (
            <div className="bg-surface border border-line rounded-xl p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Interviews</h2>
              <div className="space-y-3">
                {interviews.map(iv => (
                  <div key={iv.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-alt">
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {new Date(iv.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-secondary">
                        {new Date(iv.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {' • '}{iv.durationMinutes} min
                        {iv.interviewers.length > 0 && ` • Interviewer${iv.interviewers.length > 1 ? 's' : ''}: ${iv.interviewers.join(', ')}`}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      iv.status === 'scheduled' ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300' :
                      iv.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      iv.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {iv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-surface border border-line rounded-xl p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Application Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary text-xs">Name</p>
                <p className="font-medium text-primary">{application.name}</p>
              </div>
              <div>
                <p className="text-secondary text-xs">Email</p>
                <p className="font-medium text-primary">{application.email}</p>
              </div>
              {application.phone && (
                <div>
                  <p className="text-secondary text-xs">Phone</p>
                  <p className="font-medium text-primary">{application.phone}</p>
                </div>
              )}
              {application.college && (
                <div>
                  <p className="text-secondary text-xs">College</p>
                  <p className="font-medium text-primary">{application.college}</p>
                </div>
              )}
              {application.major && (
                <div>
                  <p className="text-secondary text-xs">Major</p>
                  <p className="font-medium text-primary">{application.major}</p>
                </div>
              )}
              {application.yearOfStudy && (
                <div>
                  <p className="text-secondary text-xs">Year of Study</p>
                  <p className="font-medium text-primary">{application.yearOfStudy}</p>
                </div>
              )}
            </div>
            {resume && (
              <div className="mt-5 pt-5 border-t border-line flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-primary truncate">{resume.fileName}</span>
                </div>
                <button
                  onClick={handleDownloadResume}
                  className="text-sm font-medium text-accent hover:underline shrink-0"
                >
                  View Resume
                </button>
              </div>
            )}
          </div>

          <div className="bg-surface border border-line rounded-xl p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-primary">Looking for something else?</h2>
              <p className="text-xs text-secondary mt-0.5">Other opportunities may be open right now.</p>
            </div>
            <Link
              to="/applicant/opportunities"
              className="text-sm font-medium text-accent hover:underline shrink-0"
            >
              View Opportunities →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
