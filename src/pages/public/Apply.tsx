import { useState, useId, useEffect } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  submitApplication, uploadResumeFile, getApplicationByUserId, getOpportunity, getOpportunityQuestions,
  getProfileResume, attachResumeToApplication,
} from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { notifyEvent } from '../../lib/notifications';
import { roleHomePath } from '../../utils/roleHome';
import type { DbOpportunity, DbOpportunityQuestion, DbResumeFile } from '../../lib/db';

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
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(() =>
    user
      ? { ...initialForm, name: user.name, email: user.email, phone: user.phone || '', college: user.college || '', major: user.major || '', yearOfStudy: user.yearOfStudy || '' }
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

  // A saved profile resume is the bar for "fast apply" -- it's the one
  // field that can't be defaulted to empty like phone/college/major can.
  // If they have one, the rest of the saved profile (however complete)
  // gets shown as a review instead of a form to refill.
  const [profileResume, setProfileResume] = useState<DbResumeFile | null | undefined>(undefined);
  const [useFullForm, setUseFullForm] = useState(false);

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
      setProfileResume(null);
      return;
    }
    // The lazy useState initializer above only ever runs once, on the very
    // first render -- on a hard page load (direct link, refresh, bookmark)
    // AuthContext is still resolving the session at that point, so `user`
    // was null and every prefilled field (email included) got locked to ''
    // forever. Submitting with an empty email then failed RLS's `email =
    // auth.email()` check (037_require_auth_applications.sql) with a bare
    // 403 and no visible error. Re-sync once the real user profile lands,
    // without clobbering anything the applicant has since typed.
    setForm(f => ({
      ...f,
      name: f.name || user.name,
      email: user.email,
      phone: f.phone || user.phone || '',
      college: f.college || user.college || '',
      major: f.major || user.major || '',
      yearOfStudy: f.yearOfStudy || user.yearOfStudy || '',
    }));
    getApplicationByUserId(user.id).then(app => {
      // A withdrawn application shouldn't block a fresh one -- withdrawing
      // is meant to clear the way to reapply, matching the real
      // withdraw_application() RPC (029_application_withdrawal.sql).
      if (app && !app.withdrawnAt) {
        setExistingApplication({ status: app.status, appliedAt: app.appliedAt });
      } else {
        setExistingApplication(null);
      }
    });
    getProfileResume(user.id).then(setProfileResume).catch(() => setProfileResume(null));
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
    if (!user) {
      setError('You must be signed in to apply.');
      return;
    }
    setSending(true);
    try {
      const applicationId = await submitApplication({
        ...form,
        userId: user.id,
        opportunityId: opportunity?.id || undefined,
        answers: questions.length > 0 ? answers : undefined,
      });
      if (profileResume && !useFullForm) {
        await attachResumeToApplication(profileResume.id, applicationId);
      } else if (resumeFile) {
        await uploadResumeFile(applicationId, resumeFile, user.id);
      }
      setSubmitted(true);
      notifyEvent('application_submitted', user.id, {
        name: form.name,
        opportunity: opportunity?.title || 'the program',
      }).catch(() => {});
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err?.message || 'Submission failed');
    } finally {
      setSending(false);
    }
  }

  function handleSignOut() {
    signOut();
    navigate('/opportunities');
  }

  const canFastApply = !!user && !!profileResume && !useFullForm;

  // Anonymous applications are no longer allowed: an unauthenticated visitor
  // who lands directly on the application form is routed to the account
  // creation gate first, keeping the opportunity they were applying to.
  if (!loading && !user) {
    return <Navigate to={opportunityId ? `/apply/${opportunityId}/create-account` : '/opportunities'} replace />;
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
      <div className="min-h-screen bg-background">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-line bg-surface"
        >
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="text-sm font-bold text-primary">Intern Readiness Program</Link>
            <div className="flex items-center gap-3">
              <Link to="/about" className="text-xs text-secondary hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
              <Link to={roleHomePath(user?.role)} className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors">Dashboard</Link>
              <button onClick={handleSignOut} className="text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Sign Out</button>
            </div>
          </div>
        </motion.header>
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface border border-line rounded-2xl p-8 md:p-12"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-900/30 flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-bold text-primary mb-2"
            >
              Application Already Submitted
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-secondary mb-6"
            >
              You submitted your application on {new Date(existingApplication.appliedAt).toLocaleDateString()}.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300 mb-6"
            >
              Status: {statusLabels[existingApplication.status] || existingApplication.status}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center justify-center gap-3"
            >
              <Link to={roleHomePath(user?.role)} className="px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors text-sm">
                Go to Dashboard
              </Link>
              <Link to="/" className="px-6 py-2.5 border border-line text-secondary font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-line bg-surface"
        >
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="text-sm font-bold text-primary">Intern Readiness Program</Link>
            <div className="flex items-center gap-3">
              <Link to="/about" className="text-xs text-secondary hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
              {opportunity && (
                <Link to={user ? '/applicant' : '/opportunities'} className="text-xs text-secondary hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Opportunities</Link>
              )}
              <Link to={user ? roleHomePath(user.role) : '/login'} className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors">
                {user ? 'Dashboard' : 'Sign In'}
              </Link>
              {user && (
                <button onClick={handleSignOut} className="text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Sign Out</button>
              )}
            </div>
          </div>
        </motion.header>
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface border border-line rounded-2xl p-8 md:p-12"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-bold text-primary mb-2"
            >
              Application Submitted
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-secondary mb-6"
            >
              Thank you, {form.name}. We've received your application{opportunity ? ` for ${opportunity.title}` : ''} and will review it shortly.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-secondary mb-6"
            >
              {user
                ? 'You can track your application status from the dashboard.'
                : 'You can create an account to track your application status and update your information.'
              }
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center justify-center gap-3"
            >
              {!user && (
                <Link to="/signup" className="px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors text-sm">
                  Create Account
                </Link>
              )}
              <Link to={user ? roleHomePath(user.role) : '/'} className="px-6 py-2.5 border border-line text-secondary font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                {user ? 'Go to Dashboard' : 'Back to Home'}
              </Link>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-neutral-400 focus:border-transparent transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-line bg-surface"
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-primary">Intern Readiness Program</Link>
          <div className="flex items-center gap-3">
            <Link to="/about" className="text-xs text-secondary hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
            <Link to={user ? '/applicant' : '/opportunities'} className="text-xs text-secondary hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Opportunities</Link>
            <Link to={user ? roleHomePath(user.role) : '/login'} className="text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {user ? 'Dashboard' : 'Login'}
            </Link>
            {user && (
              <button onClick={handleSignOut} className="text-xs px-3 py-1.5 rounded-lg border border-line text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Sign Out</button>
            )}
          </div>
        </div>
      </motion.header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold text-primary" id={headingId}>
            {opportunity ? `Apply: ${opportunity.title}` : 'Apply to the Program'}
          </h1>
          <p className="text-sm text-secondary mt-1">
            {opportunity ? opportunity.description.substring(0, 120) + (opportunity.description.length > 120 ? '...' : '') : 'Start your journey toward becoming client-ready.'}
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="bg-surface border border-line rounded-2xl p-6 md:p-8 space-y-5" 
          aria-labelledby={headingId}
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {canFastApply ? (
            <div className="bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Applying with your saved profile</p>
                <button type="button" onClick={() => setUseFullForm(true)} className="text-xs font-medium text-accent hover:underline shrink-0">
                  Use full form instead
                </button>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><dt className="text-xs text-secondary">Name</dt><dd className="text-primary">{form.name}</dd></div>
                <div><dt className="text-xs text-secondary">Email</dt><dd className="text-primary">{form.email}</dd></div>
                {form.phone && <div><dt className="text-xs text-secondary">Phone</dt><dd className="text-primary">{form.phone}</dd></div>}
                {form.college && <div><dt className="text-xs text-secondary">College</dt><dd className="text-primary">{form.college}</dd></div>}
                {form.major && <div><dt className="text-xs text-secondary">Major</dt><dd className="text-primary">{form.major}</dd></div>}
                {form.yearOfStudy && <div><dt className="text-xs text-secondary">Year</dt><dd className="text-primary">{form.yearOfStudy}</dd></div>}
              </dl>
              <p className="text-xs text-secondary mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                Not right? <Link to="/profile" className="text-accent hover:underline">Edit your profile</Link> — updates apply the next time you come back here.
              </p>
            </div>
          ) : (
            <>
              {user && (
                <div className="bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="flex-1">
                    Signed in as <strong>{user.email}</strong>. Your application will be linked to your account.
                  </span>
                  {profileResume === null && (
                    <Link to="/profile" className="ml-auto text-accent hover:underline shrink-0">Complete profile for one-click apply →</Link>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className={labelClass}>Full Name *</label>
                  <input id="name" type="text" required value={form.name} onChange={e => set('name', e.target.value)} className={inputClass} placeholder="John Doe" />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>Email *</label>
                  <input id="email" type="email" required value={form.email} readOnly={!!user} onChange={e => set('email', e.target.value)} className={inputClass} placeholder="john@example.com" />
                  {user && <p className="text-[11px] text-secondary mt-1">Your application is submitted under your account email.</p>}
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input id="phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <fieldset className="border-t border-line pt-5">
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
            </>
          )}

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

          {canFastApply && profileResume ? (
            <div>
              <label className={labelClass}>Resume</label>
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-line bg-surface-alt">
                <span className="text-sm text-primary truncate">{profileResume.fileName}</span>
                <button type="button" onClick={() => setUseFullForm(true)} className="text-xs font-medium text-accent hover:underline shrink-0">
                  Replace
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="resume" className={labelClass}>Resume *</label>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
          )}

          {questions.length > 0 && (
            <fieldset className="border-t border-line pt-5">
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

          <motion.button
            type="submit"
            disabled={sending}
            whileHover={{ scale: sending ? 1 : 1.02 }}
            whileTap={{ scale: sending ? 1 : 0.98 }}
            className="w-full py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {sending ? 'Submitting...' : 'Submit Application'}
          </motion.button>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs text-gray-400 dark:text-gray-500 text-center"
          >
            {user ? (
              <Link to={roleHomePath(user.role)} className="text-accent hover:underline">Back to Dashboard</Link>
            ) : (
              <>Already have an account? <Link to="/login" className="text-accent hover:underline">Sign in</Link></>
            )}
          </motion.p>
        </motion.form>
      </main>
    </div>
  );
}
