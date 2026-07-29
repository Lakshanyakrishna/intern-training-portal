import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApplicationByUserId, getInterviewsByApplicant } from '../lib/db';
import type { DbApplication, DbInterview } from '../lib/db';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  reviewed: { label: 'Under Review', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
};

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [application, setApplication] = useState<DbApplication | null>(null);
  const [interviews, setInterviews] = useState<DbInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getApplicationByUserId(user.id),
      getInterviewsByApplicant(user.id),
    ]).then(([app, ints]) => {
      setApplication(app);
      setInterviews(ints);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusInfo = application ? STATUS_LABELS[application.status] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Application</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your application status and interviews.</p>
      </div>

      {!application ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Application Yet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Submit your application to get started.</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Application Status</h2>
              {statusInfo && (
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{application.name}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{application.email}</p>
              </div>
              {application.phone && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{application.phone}</p>
                </div>
              )}
              {application.college && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">College</p>
                  <p className="font-medium text-gray-900 dark:text-white">{application.college}</p>
                </div>
              )}
              {application.major && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Major</p>
                  <p className="font-medium text-gray-900 dark:text-white">{application.major}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Submitted</p>
                <p className="font-medium text-gray-900 dark:text-white">{new Date(application.appliedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Journey</h2>
            <div className="space-y-0">
              {[
                { step: 'Application Submitted', done: true, current: false },
                { step: 'Under Review', done: application.status !== 'pending', current: application.status === 'pending' || application.status === 'reviewed' },
                { step: 'Shortlisted', done: ['shortlisted', 'accepted'].includes(application.status), current: application.status === 'shortlisted' },
                { step: 'Interview', done: interviews.some(i => i.status === 'completed'), current: interviews.some(i => i.status === 'scheduled') },
                { step: 'Selected', done: application.status === 'accepted', current: false },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.done ? 'bg-green-500' : item.current ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {item.done ? (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : item.current ? (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    ) : null}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${item.done ? 'text-green-700 dark:text-green-300' : item.current ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}`}>
                      {item.step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interviews */}
          {interviews.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interviews</h2>
              <div className="space-y-3">
                {interviews.map(iv => (
                  <div key={iv.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(iv.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(iv.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {' \u2022 '}{iv.durationMinutes} min
                        {iv.interviewers.length > 0 && ` \u2022 Interviewer${iv.interviewers.length > 1 ? 's' : ''}: ${iv.interviewers.join(', ')}`}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      iv.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
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
        </>
      )}
    </div>
  );
}
