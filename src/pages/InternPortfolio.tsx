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
  mentor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
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
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Internship Portfolio</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your complete internship journey at a glance.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name || 'Intern'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${ROLE_STYLES[user?.role || 'intern']}`}>
          {user?.role || 'intern'}
        </span>
      </div>

      {opportunity && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Applied Opportunity</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Title</p>
              <p className="font-medium text-gray-900 dark:text-white">{opportunity.title}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Category</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{opportunity.category}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Status</p>
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

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Training Progress</h3>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{overallPercent}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {modules.filter(m => getModuleProgress(m.id).percent >= 80).length} of {modules.length} modules completed
        </p>
      </div>

      {latestEval && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Readiness Score</h3>
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
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Technical: {latestEval.technicalReadiness}/100</span>
            <span>Communication: {latestEval.communicationReadiness}/100</span>
            <span>Problem Solving: {latestEval.problemSolvingReadiness}/100</span>
          </div>
        </div>
      )}

      {!latestEval && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Readiness Score</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">No readiness evaluation yet.</p>
        </div>
      )}

      {project ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Project Allocation</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Project</p>
              <p className="font-medium text-gray-900 dark:text-white">{project.projectName}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Client</p>
              <p className="font-medium text-gray-900 dark:text-white">{project.clientName}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Role</p>
              <p className="font-medium text-gray-900 dark:text-white">{project.role}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Status</p>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                project.status === 'completed'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : project.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
              }`}>
                {project.status}
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Start</p>
              <p className="font-medium text-gray-900 dark:text-white">{project.startDate}</p>
            </div>
            {project.endDate && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">End</p>
                <p className="font-medium text-gray-900 dark:text-white">{project.endDate}</p>
              </div>
            )}
          </div>
          {(project as DbProjectAllocationExtended).outcome && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Outcome: </span>
                <span className={`font-medium capitalize ${OUTCOME_COLORS[(project as DbProjectAllocationExtended).outcome!] || ''}`}>
                  {(project as DbProjectAllocationExtended).outcome?.replace(/_/g, ' ')}
                </span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Project Allocation</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">No project assigned yet.</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Certificates</h3>
        {trainingCerts.length === 0 && internshipCerts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No certificates issued yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {trainingCerts.map(cert => (
              <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Training Certificate</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    cert.status === 'issued'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">#{cert.certificateNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Issued: {cert.issuedAt}</p>
                {cert.generatedPdfUrl && (
                  <a
                    href={cert.generatedPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            ))}
            {internshipCerts.map(cert => (
              <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Internship Certificate</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    cert.status === 'issued'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">#{cert.certificateNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Issued: {cert.issuedAt}</p>
                {cert.generatedPdfUrl && (
                  <a
                    href={cert.generatedPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Mentor Feedback</h3>
          <div className="space-y-3">
            {latestFeedback.map(fb => (
              <div key={fb.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{fb.date}</p>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{fb.score}/10</span>
                </div>
                {fb.module && (
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">{fb.module}</p>
                )}
                {fb.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{fb.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {outcome && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Completion Status</h3>
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Completion Status</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Internship outcome not yet recorded.</p>
        </div>
      )}
    </div>
  );
}
