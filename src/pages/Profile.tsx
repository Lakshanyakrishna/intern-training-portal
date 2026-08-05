import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';
import { levels } from '../data/levels';
import { User, Github, Linkedin, Globe, FileText, Upload, Plus, Trash2 } from '../components/Icons';
import {
  getUserSettings, upsertUserSettings, updateUser,
  getApplicantExperiences, createApplicantExperience, deleteApplicantExperience,
  getProfileResume, uploadProfileResume, getResumeDownloadUrl,
} from '../lib/db';
import type { DbApplicantExperience, DbResumeFile } from '../lib/db';

export default function Profile() {
  const { user } = useAuth();
  const canEditDetails = user?.role === 'applicant' || user?.role === 'intern';
  return canEditDetails ? <DetailedProfile /> : <BasicProfile />;
}

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-surface text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors';
const labelClass = 'block text-xs font-medium text-secondary mb-1.5';

type ExperienceDraft = { title: string; company: string; startDate: string; endDate: string; description: string };
const emptyExperienceDraft: ExperienceDraft = { title: '', company: '', startDate: '', endDate: '', description: '' };

// Fill once, reuse everywhere -- this is the whole point: everything here
// is exactly what Apply.tsx currently asks for by hand on every single
// submission. Completing it is what lets applying become "review and
// submit" instead of "fill out a form again."
function DetailedProfile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [college, setCollege] = useState(user?.college || '');
  const [major, setMajor] = useState(user?.major || '');
  const [yearOfStudy, setYearOfStudy] = useState(user?.yearOfStudy || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [resume, setResume] = useState<DbResumeFile | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [experiences, setExperiences] = useState<DbApplicantExperience[]>([]);
  const [addingExperience, setAddingExperience] = useState(false);
  const [draft, setDraft] = useState<ExperienceDraft>(emptyExperienceDraft);

  useEffect(() => {
    if (!user) return;
    getUserSettings(user.id).then(settings => {
      if (settings?.displayName) setName(settings.displayName);
    }).catch(() => {});
    getProfileResume(user.id).then(setResume).catch(() => {});
    getApplicantExperiences(user.id).then(setExperiences).catch(() => {});
  }, [user]);

  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);
    setSaveMessage('');
    try {
      await Promise.all([
        upsertUserSettings(user.id, { displayName: name }),
        updateUser(user.id, { name, phone, college, major, yearOfStudy, githubUrl, linkedinUrl, portfolioUrl }),
      ]);
      await refreshUser();
      setSaveMessage('Saved.');
    } catch {
      setSaveMessage('Could not save — try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  }

  async function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingResume(true);
    try {
      const uploaded = await uploadProfileResume(user.id, file);
      setResume(uploaded);
    } catch { /* ignore */ } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  }

  async function handleViewResume() {
    if (!resume) return;
    try {
      const url = await getResumeDownloadUrl(resume.filePath);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch { /* ignore */ }
  }

  async function handleAddExperience(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !draft.title.trim() || !draft.company.trim()) return;
    try {
      await createApplicantExperience({
        userId: user.id,
        title: draft.title.trim(),
        company: draft.company.trim(),
        startDate: draft.startDate.trim() || undefined,
        endDate: draft.endDate.trim() || undefined,
        description: draft.description.trim() || undefined,
        sortOrder: experiences.length,
      });
      setExperiences(await getApplicantExperiences(user.id));
      setDraft(emptyExperienceDraft);
      setAddingExperience(false);
    } catch { /* ignore */ }
  }

  async function handleRemoveExperience(id: string) {
    if (!user) return;
    try {
      await deleteApplicantExperience(id);
      setExperiences(prev => prev.filter(x => x.id !== id));
    } catch { /* ignore */ }
  }

  const completedFields = [name, phone, college, major, yearOfStudy, githubUrl, linkedinUrl, portfolioUrl, resume ? 'x' : ''].filter(Boolean).length;
  const completeness = Math.round((completedFields / 9) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl"><User className="w-8 h-8 inline-block" /></span>
          <div>
            <h1 className="text-2xl font-bold text-primary">Profile</h1>
            <p className="text-sm text-secondary">Fill this in once — applying reuses it instead of asking again.</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-primary tabular-nums">{completeness}%</p>
          <p className="text-[11px] text-secondary">complete</p>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-primary">Basic Info</h2>

        <div>
          <label className={labelClass}>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Email</label>
            <p className="text-sm text-secondary px-3.5 py-2.5">{user?.email}</p>
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>College / University</label>
            <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="MIT" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Major / Degree</label>
            <input type="text" value={major} onChange={e => setMajor(e.target.value)} placeholder="Computer Science" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Year of Study</label>
          <select value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)} className={inputClass}>
            <option value="">Select...</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-primary">Career Links</h2>
        <div>
          <label className={labelClass}><Github className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />GitHub</label>
          <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/yourname" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><Linkedin className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />LinkedIn</label>
          <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/yourname" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><Globe className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />Portfolio</label>
          <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://yourname.dev" className={inputClass} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-accent text-accent-text text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
        {saveMessage && <p className="text-xs text-secondary">{saveMessage}</p>}
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-primary mb-1">Resume</h2>
        <p className="text-xs text-secondary mb-4">Uploaded once — reused for your application automatically.</p>
        {resume ? (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-alt">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-sm text-primary truncate">{resume.fileName}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={handleViewResume} className="text-xs font-medium text-accent hover:underline">View</button>
              <label className="text-xs font-medium text-secondary hover:text-primary cursor-pointer transition-colors">
                Replace
                <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleResumeChange} />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-line text-sm text-secondary hover:bg-surface-alt cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            {uploadingResume ? 'Uploading...' : 'Upload resume (PDF or DOCX)'}
            <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleResumeChange} disabled={uploadingResume} />
          </label>
        )}
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-primary">Experience</h2>
          {!addingExperience && (
            <button
              onClick={() => setAddingExperience(true)}
              className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
        <p className="text-xs text-secondary mb-4">Internships, jobs, or hands-on projects worth mentioning.</p>

        {experiences.length === 0 && !addingExperience && (
          <p className="text-sm text-secondary py-4 text-center">Nothing added yet.</p>
        )}

        {experiences.length > 0 && (
          <div className="divide-y divide-line mb-2">
            {experiences.map(exp => (
              <div key={exp.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary">{exp.title} · {exp.company}</p>
                  {(exp.startDate || exp.endDate) && (
                    <p className="text-xs text-secondary mt-0.5">{exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}</p>
                  )}
                  {exp.description && <p className="text-xs text-secondary mt-1">{exp.description}</p>}
                </div>
                <button
                  onClick={() => handleRemoveExperience(exp.id)}
                  className="text-secondary hover:text-red-500 transition-colors shrink-0 p-1"
                  aria-label={`Remove ${exp.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {addingExperience && (
          <form onSubmit={handleAddExperience} className="space-y-3 pt-3 border-t border-line">
            <div className="grid grid-cols-2 gap-3">
              <input required value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Role / Title" className={inputClass} />
              <input required value={draft.company} onChange={e => setDraft(d => ({ ...d, company: e.target.value }))} placeholder="Company" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={draft.startDate} onChange={e => setDraft(d => ({ ...d, startDate: e.target.value }))} placeholder="Start (e.g. Jun 2025)" className={inputClass} />
              <input value={draft.endDate} onChange={e => setDraft(d => ({ ...d, endDate: e.target.value }))} placeholder="End (e.g. Present)" className={inputClass} />
            </div>
            <textarea value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Brief description (optional)" rows={2} className={inputClass} />
            <div className="flex gap-2">
              <button type="button" onClick={() => { setAddingExperience(false); setDraft(emptyExperienceDraft); }} className="px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-secondary hover:bg-surface-alt transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-accent text-accent-text text-xs font-medium hover:bg-accent-hover transition-colors">
                Add Experience
              </button>
            </div>
          </form>
        )}
      </div>

      {user?.role === 'applicant' && (
        <div className="bg-surface border border-line rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-primary">Application status</h2>
            <p className="text-xs text-secondary mt-0.5">Track where things stand from your dashboard.</p>
          </div>
          <Link to="/applicant" className="text-sm font-medium text-accent hover:underline shrink-0">
            My Journey →
          </Link>
        </div>
      )}
    </div>
  );
}

function BasicProfile() {
  const { progress } = useProgress();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserSettings(user.id).then(settings => {
      if (settings?.displayName) {
        setName(settings.displayName);
      }
    }).catch(() => {});
  }, [user]);

  const currentLevel = levels.find(l => l.level === progress.level) || levels[0];

  const handleSaveName = async () => {
    if (user) {
      setSaving(true);
      try {
        await upsertUserSettings(user.id, { displayName: name });
      } catch { /* ignore */ }
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl"><User className="w-8 h-8 inline-block" /></span>
        <div>
          <h1 className="text-2xl font-bold text-primary">Profile</h1>
          <p className="text-sm text-secondary">Your training profile.</p>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2.5 rounded-lg border border-line bg-surface text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
            />
            <button
              onClick={handleSaveName}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line">
          <div className="text-center p-4 bg-surface-alt rounded-xl">
            <p className="text-2xl font-bold text-primary">{progress.xp}</p>
            <p className="text-xs text-secondary">Total XP</p>
          </div>
          <div className="text-center p-4 bg-surface-alt rounded-xl">
            <p className="text-2xl font-bold text-primary">Level {currentLevel.level}</p>
            <p className="text-xs text-secondary">{currentLevel.title}</p>
          </div>
          <div className="text-center p-4 bg-surface-alt rounded-xl">
            <p className="text-2xl font-bold text-primary">{progress.completedChallenges.length}</p>
            <p className="text-xs text-secondary">Challenges</p>
          </div>
          <div className="text-center p-4 bg-surface-alt rounded-xl">
            <p className="text-2xl font-bold text-primary">{progress.passedQuizzes.length}</p>
            <p className="text-xs text-secondary">Assessments Passed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
