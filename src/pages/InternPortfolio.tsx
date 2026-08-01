import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOpportunity,
  getApplicationByUserId,
  getTrainingCertificates,
  getInternshipCertificates,
  getInternshipOutcome,
  getProjectAllocationByIntern,
  getReadinessEvaluations,
  getMentorFeedback,
} from '../lib/db';
import type {
  DbTrainingCertificate,
  DbInternshipCertificate,
  DbInternshipOutcome,
  DbProjectAllocationExtended,
} from '../lib/db';
import { useProgress } from '../hooks/useProgress';
import { modules } from '../data/modules';
import type { DbOpportunity, DbReadinessEvaluation, DbProjectAllocation, DbMentorFeedbackEntry } from '../lib/db';

const ROLE_STYLES: Record<string, string> = {
  intern: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  mentor: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300',
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

const OUTCOME_COLORS: Record<string, string> = {
  successful: 'text-green-600 dark:text-green-400',
  partially_successful: 'text-amber-600 dark:text-amber-400',
  unsuccessful: 'text-red-600 dark:text-red-400',
};

function CheckItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        done
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      }`}>
        {done ? '✓' : '✗'}
      </span>
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );
}

export default function InternPortfolio() {
  const { user } = useAuth();
  const { getModuleProgress } = useProgress();

  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState<DbOpportunity | null>(null);
  const [trainingCerts, setTrainingCerts] = useState<DbTrainingCertificate[]>([]);
  const [internshipCerts, setInternshipCerts] = useState<DbInternshipCertificate[]>([]);
  const [outcome, setOutcome] = useState<DbInternshipOutcome | null>(null);
  const [project, setProject] = useState<DbProjectAllocation | null>(null);
  const [evaluations, setEvaluations] = useState<DbReadinessEvaluation[]>([]);
  const [feedback, setFeedback] = useState<DbMentorFeedbackEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getApplicationByUserId(user.id),
      getTrainingCertificates(user.id),
      getInternshipCertificates(user.id),
      getInternshipOutcome(user.id),
      getProjectAllocationByIntern(user.id),
      getReadinessEvaluations(user.id),
      getMentorFeedback(user.id),
    ]).then(async ([app, tc, ic, oc, pa, rev, fb]) => {
      setTrainingCerts(tc);
      setInternshipCerts(ic);
      setOutcome(oc);
      setProject(pa);
      setEvaluations(rev);
      setFeedback(fb);
      if (app?.opportunityId) {
        try {
          const opp = await getOpportunity(app.opportunityId);
          setOpportunity(opp);
        } catch { /* ignore */ }
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const overallPercent = modules.length > 0
    ? Math.round(modules.reduce((sum, m) => sum + getModuleProgress(m.id).percent, 0) / modules.length)
    : 0;

  const latestEval = evaluations[0] || null;
  const latestFeedback = feedback.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-primary">Internship Portfolio</h1>
        <p className="text-sm text-secondary mt-1">Your complete internship journey at a glance.</p>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-900/30 flex items-center justify-center text-xl font-bold text-accent">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-primary">{user?.name || 'Intern'}</h2>
          <p className="text-sm text-secondary">{user?.email || ''}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${ROLE_STYLES[user?.role || 'intern']}`}>
          {user?.role || 'intern'}
        </span>
      </div>

      {opportunity && (
        <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-primary">Applied Opportunity</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-secondary text-xs">Title</p>
              <p className="font-medium text-primary">{opportunity.title}</p>
            </div>
            <div>
              <p className="text-secondary text-xs">Category</p>
              <p className="font-medium text-primary capitalize">{opportunity.category}</p>
            </div>
            <div>
              <p className="text-secondary text-xs">Status</p>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                opportunity.status === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : opportunity.status === 'closed'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {opportunity.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-primary">Training Progress</h3>
          <span className="text-sm font-bold text-accent">{overallPercent}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <p className="text-xs text-secondary">
          {modules.filter(m => getModuleProgress(m.id).percent >= 80).length} of {modules.length} modules completed
        </p>
      </div>

      {latestEval && (
        <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-primary">Readiness Score</h3>
            <span className={`text-lg font-bold ${
              latestEval.overallReadiness >= 80
                ? 'text-green-600 dark:text-green-400'
                : latestEval.overallReadiness >= 50
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {latestEval.overallReadiness}/100
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                latestEval.overallReadiness >= 80
                  ? 'bg-green-500'
                  : latestEval.overallReadiness >= 50
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${latestEval.overallReadiness}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-secondary">
            <span>Technical: {latestEval.technicalReadiness}/100</span>
            <span>Communication: {latestEval.communicationReadiness}/100</span>
            <span>Problem Solving: {latestEval.problemSolvingReadiness}/100</span>
          </div>
        </div>
      )}

      {!latestEval && (
        <div className="bg-surface border border-line rounded-2xl p-6">
          <h3 className="font-semibold text-primary mb-2">Readiness Score</h3>
          <p className="text-sm text-secondary">No readiness evaluation yet.</p>
        </div>
      )}

      {project ? (
        <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-primary">Project Allocation</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-secondary text-xs">Project</p>
              <p className="font-medium text-primary">{project.projectName}</p>
            </div>
            <div>
              <p className="text-secondary text-xs">Client</p>
              <p className="font-medium text-primary">{project.clientName}</p>
            </div>
            <div>
              <p className="text-secondary text-xs">Role</p>
              <p className="font-medium text-primary">{project.role}</p>
            </div>
            <div>
              <p className="text-secondary text-xs">Status</p>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                project.status === 'completed'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : project.status === 'in-progress'
                  ? 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
              }`}>
                {project.status}
              </span>
            </div>
            <div>
              <p className="text-secondary text-xs">Start</p>
              <p className="font-medium text-primary">{project.startDate}</p>
            </div>
            {project.endDate && (
              <div>
                <p className="text-secondary text-xs">End</p>
                <p className="font-medium text-primary">{project.endDate}</p>
              </div>
            )}
          </div>
          {(project as DbProjectAllocationExtended).outcome && (
            <div className="pt-3 border-t border-line">
              <p className="text-sm">
                <span className="text-secondary">Outcome: </span>
                <span className={`font-medium capitalize ${OUTCOME_COLORS[(project as DbProjectAllocationExtended).outcome!] || ''}`}>
                  {(project as DbProjectAllocationExtended).outcome?.replace(/_/g, ' ')}
                </span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface border border-line rounded-2xl p-6">
          <h3 className="font-semibold text-primary mb-2">Project Allocation</h3>
          <p className="text-sm text-secondary">No project assigned yet.</p>
        </div>
      )}

      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-primary">Certificates</h3>
        {trainingCerts.length === 0 && internshipCerts.length === 0 ? (
          <p className="text-sm text-secondary">No certificates issued yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {trainingCerts.map(cert => (
              <div key={cert.id} className="border border-line rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">Training Certificate</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    cert.status === 'issued'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                <p className="text-xs text-secondary">#{cert.certificateNumber}</p>
                <p className="text-xs text-secondary">Issued: {cert.issuedAt}</p>
                {cert.generatedPdfUrl && (
                  <a
                    href={cert.generatedPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-accent hover:underline"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
            {internshipCerts.map(cert => (
              <div key={cert.id} className="border border-line rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary">Internship Certificate</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    cert.status === 'issued'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                <p className="text-xs text-secondary">#{cert.certificateNumber}</p>
                <p className="text-xs text-secondary">Issued: {cert.issuedAt}</p>
                {cert.generatedPdfUrl && (
                  <a
                    href={cert.generatedPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-accent hover:underline"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {latestFeedback.length > 0 && (
        <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-primary">Mentor Feedback</h3>
          <div className="space-y-3">
            {latestFeedback.map(fb => (
              <div key={fb.id} className="border border-line rounded-xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-secondary">{fb.date}</p>
                  <span className="text-xs font-semibold text-accent">{fb.score}/10</span>
                </div>
                {fb.module && (
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">{fb.module}</p>
                )}
                {fb.note && (
                  <p className="text-sm text-secondary">{fb.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {outcome && (
        <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-primary">Completion Status</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <CheckItem label="Training Completed" done={outcome.trainingCompleted} />
            <CheckItem label="Readiness Approved" done={!!outcome.readinessScore && outcome.readinessScore >= 60} />
            <CheckItem label="Project Completed" done={outcome.projectCompleted} />
            <CheckItem label="Mentor Approved" done={outcome.mentorApproved} />
            <CheckItem label="Internship Completed" done={outcome.internshipCompleted} />
          </div>
        </div>
      )}

      {!outcome && (
        <div className="bg-surface border border-line rounded-2xl p-6">
          <h3 className="font-semibold text-primary mb-2">Completion Status</h3>
          <p className="text-sm text-secondary">Internship outcome not yet recorded.</p>
        </div>
      )}
    </div>
  );
}
