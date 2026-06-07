import { useProgress } from '../hooks/useProgress';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { getMockSubmissionFeedback } from '../data/reviews';
import {
  MessageSquare,
  Target,
  ArrowRight,
} from '../components/Icons';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'waiting-review': { label: 'Waiting for Review', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  'reviewed': { label: 'Reviewed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  'revision-requested': { label: 'Revision Requested', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  'approved': { label: 'Approved', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
};

export default function ReadinessReviews() {
  const { progress } = useProgress();

  const submissionFeedback = useMemo(() => getMockSubmissionFeedback(progress), [progress]);

  if (submissionFeedback.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center pt-16">
        <MessageSquare className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mentor Feedback</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
          No submissions reviewed yet.<br />
          Complete and submit challenges, hands-on tasks, or assessments to receive mentor feedback.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Go to Training Program
          <ArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mentor Feedback</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Feedback on your submitted work</p>
        </div>
      </div>

      <div className="space-y-4">
        {[...submissionFeedback]
          .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
          .map(fb => {
          const cfg = statusConfig[fb.status] || statusConfig['waiting-review'];
          return (
            <div key={fb.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{fb.submissionTitle}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{fb.moduleTitle}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color} ${cfg.bg}`}>
                  {cfg.label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-4">
                <span>{fb.mentorName}</span>
                <span>{new Date(fb.reviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>

              {fb.status !== 'waiting-review' && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Strengths</p>
                      <ul className="space-y-1">
                        {fb.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Needs Improvement</p>
                      <ul className="space-y-1">
                        {fb.needsImprovement.map((n, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                            {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Overall Comment</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{fb.overallComment}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mentor Score</span>
                    <span className={`text-sm font-bold ${fb.mentorScore >= 8 ? 'text-green-600 dark:text-green-400' : fb.mentorScore >= 6 ? 'text-amber-600 dark:text-amber-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {fb.mentorScore}/10
                    </span>
                  </div>
                </div>
              )}

              {fb.status === 'waiting-review' && (
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Awaiting mentor review</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
