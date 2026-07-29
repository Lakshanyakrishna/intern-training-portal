import { useState, useId, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { submitApplication, uploadResumeFile, getApplicationByUserId, getOpportunity, getOpportunityQuestions } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { notifyEvent } from '../../lib/notifications';
import type { DbOpportunity, DbOpportunityQuestion } from '../../lib/db';

interface FormData {
  name: string;
  email: string;
  phone: string;
  college: string;
  yearOfStudy: string;
  major: string;
  whyJoin: string;
  heardFrom: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  college: '',
  yearOfStudy: '',
  major: '',
  whyJoin: '',
  heardFrom: '',
};

export default function Apply() {
  const headingId = useId();
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const { user } = useAuth();
  const [form, setForm] = useState<FormData>(() =>
    user
      ? { ...initialForm, name: user.name, email: user.email }
      : initialForm
  );
  const [opportunity, setOpportunity] = useState<DbOpportunity | null | undefined>(undefined);
  const [questions, setQuestions] = useState<DbOpportunityQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [existingApplication, setExistingApplication] = useState<{ status: string; appliedAt: string } | null | undefined>(undefined);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    if (!opportunityId) {
      setOpportunity(null);
      setQuestions([]);
      return;
    }
    getOpportunity(opportunityId).then(setOpportunity).catch(() => setOpportunity(null));
    getOpportunityQuestions(opportunityId).then(setQuestions).catch(() => setQuestions([]));
  }, [opportunityId]);

  useEffect(() => {
    if (!user) {
      setExistingApplication(null);
      return;
    }
    getApplicationByUserId(user.id).then(app => {
      if (app) {
        setExistingApplication({ status: app.status, appliedAt: app.appliedAt });
      } else {
        setExistingApplication(null);
      }
    });
  }, [user]);

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function setAnswer(questionId: string, value: string) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const applicationId = await submitApplication({
        ...form,
        userId: user?.id,
        opportunityId: opportunityId || undefined,
        answers: questions.length > 0 ? answers : undefined,
      });
      if (resumeFile) {
        await uploadResumeFile(applicationId, resumeFile, user?.id || '');
      }
      setSubmitted(true);
      if (user?.id) {
        notifyEvent('application_submitted', user.id, {
          name: form.name,
          opportunity: opportunity?.title || 'the program',
        }).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSending(false);
    }
  }

  if (existingApplication !== undefined && existingApplication !== null) {
    const statusLabels: Record<string, string> = {
      pending: 'Under Review',
      reviewed: 'Reviewed',
      shortlisted: 'Shortlisted',
      rejected: 'Not Selected',
      accepted: 'Accepted',
    };
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="text-sm font-bold text-gray-900 dark:text-white">Intern Readiness Program</Link>
            <div className="flex items-center gap-3">
              <Link to="/about" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
              <Link to="/dashboard" className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Dashboard</Link>
            </div>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Already Submitted</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You submitted your application on {new Date(existingApplication.appliedAt).toLocaleDateString()}.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-6">
              Status: {statusLabels[existingApplication.status] || existingApplication.status}
            </div>
            <div className="flex items-center justify-center gap-3">
              <Link to="/dashboard" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Go to Dashboard
              </Link>
              <Link to="/" className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="text-sm font-bold text-gray-900 dark:text-white">Intern Readiness Program</Link>
            <div className="flex items-center gap-3">
              <Link to="/about" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
              {opportunity && (
                <Link to="/opportunities" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Opportunities</Link>
              )}
              <Link to={user ? '/dashboard' : '/login'} className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                {user ? 'Dashboard' : 'Sign In'}
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Thank you, {form.name}. We've received your application{opportunity ? ` for ${opportunity.title}` : ''} and will review it shortly.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {user
                ? 'You can track your application status from the dashboard.'
                : 'You can create an account to track your application status and update your information.'
              }
            </p>
            <div className="flex items-center justify-center gap-3">
              {!user && (
                <Link to="/signup" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Create Account
                </Link>
              )}
              <Link to={user ? '/dashboard' : '/'} className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                {user ? 'Go to Dashboard' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-gray-900 dark:text-white">Intern Readiness Program</Link>
          <div className="flex items-center gap-3">
            <Link to="/about" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
            <Link to="/opportunities" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Opportunities</Link>
            <Link to={user ? '/dashboard' : '/login'} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {user ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" id={headingId}>
            {opportunity ? `Apply: ${opportunity.title}` : 'Apply to the Program'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {opportunity ? opportunity.description.substring(0, 120) + (opportunity.description.length > 120 ? '...' : '') : 'Start your journey toward becoming client-ready.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 space-y-5" aria-labelledby={headingId}>
          {user && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Signed in as <strong>{user.email}</strong>. Your application will be linked to your account.
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className={labelClass}>Full Name *</label>
              <input id="name" type="text" required value={form.name} onChange={e => set('name', e.target.value)} className={inputClass} placeholder="John Doe" />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email *</label>
              <input id="email" type="email" required value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} placeholder="john@example.com" />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <input id="phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <fieldset className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Education</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="college" className={labelClass}>College / University</label>
                <input id="college" type="text" value={form.college} onChange={e => set('college', e.target.value)} className={inputClass} placeholder="MIT" />
              </div>
              <div>
                <label htmlFor="major" className={labelClass}>Major / Degree</label>
                <input id="major" type="text" value={form.major} onChange={e => set('major', e.target.value)} className={inputClass} placeholder="Computer Science" />
              </div>
              <div>
                <label htmlFor="yearOfStudy" className={labelClass}>Year of Study</label>
                <select id="yearOfStudy" value={form.yearOfStudy} onChange={e => set('yearOfStudy', e.target.value)} className={inputClass}>
                  <option value="">Select...</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
            </div>
          </fieldset>

          <div>
            <label htmlFor="whyJoin" className={labelClass}>Why do you want to join this program? *</label>
            <textarea id="whyJoin" required value={form.whyJoin} onChange={e => set('whyJoin', e.target.value)} rows={4} className={inputClass} placeholder="Tell us about your motivation and what you hope to gain..." />
          </div>

          <div>
            <label htmlFor="heardFrom" className={labelClass}>How did you hear about us?</label>
            <select id="heardFrom" value={form.heardFrom} onChange={e => set('heardFrom', e.target.value)} className={inputClass}>
              <option value="">Select...</option>
              <option value="College">College / University</option>
              <option value="Social Media">Social Media</option>
              <option value="Friend">Friend / Referral</option>
              <option value="Career Fair">Career Fair</option>
              <option value="Email">Email</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="resume" className={labelClass}>Resume *</label>
            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Choose File
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.docx"
                  required
                  className="sr-only"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    if (file && file.size > 10 * 1024 * 1024) {
                      setError('Resume must be under 10MB');
                      setResumeFile(null);
                      e.target.value = '';
                    } else {
                      setError('');
                      setResumeFile(file);
                    }
                  }}
                />
              </label>
              {resumeFile ? (
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500">No file chosen</span>
              )}
            </div>
          </div>

          {questions.length > 0 && (
            <fieldset className="border-t border-gray-200 dark:border-gray-700 pt-5">
              <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Additional Questions</legend>
              <div className="space-y-4">
                {questions.map(q => (
                  <div key={q.id}>
                    <label htmlFor={`q-${q.id}`} className={labelClass}>
                      {q.question} {q.required && <span className="text-red-500">*</span>}
                    </label>
                    {q.type === 'select' ? (
                      <select
                        id={`q-${q.id}`}
                        required={q.required}
                        value={answers[q.id] || ''}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        {(q.options || []).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : q.type === 'textarea' ? (
                      <textarea
                        id={`q-${q.id}`}
                        required={q.required}
                        value={answers[q.id] || ''}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        rows={3}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        id={`q-${q.id}`}
                        type="text"
                        required={q.required}
                        value={answers[q.id] || ''}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {sending ? 'Submitting...' : 'Submit Application'}
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            {user ? (
              <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">Back to Dashboard</Link>
            ) : (
              <>Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Sign in</Link></>
            )}
          </p>
        </form>
      </main>
    </div>
  );
}
