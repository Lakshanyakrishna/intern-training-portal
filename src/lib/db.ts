import { requireSupabase } from './supabase';
import type { AuthUser } from '../types';

// ─── Users ────────────────────────────────────────────────────────

// PostgREST returns raw snake_case columns; casting that straight to
// AuthUser (as getUser/getAllUsers used to) silently loses every
// snake_case field -- yearOfStudy, onboardingComplete, joinedDate all came
// back undefined. Found while wiring the new profile fields through, which
// would have inherited the same bug.
function mapAuthUser(r: Record<string, unknown>): AuthUser {
  return {
    id: r.id as string,
    email: r.email as string,
    name: r.name as string,
    role: r.role as AuthUser['role'],
    college: (r.college as string) ?? undefined,
    yearOfStudy: (r.year_of_study as string) ?? undefined,
    phone: (r.phone as string) ?? undefined,
    major: (r.major as string) ?? undefined,
    githubUrl: (r.github_url as string) ?? undefined,
    linkedinUrl: (r.linkedin_url as string) ?? undefined,
    portfolioUrl: (r.portfolio_url as string) ?? undefined,
    batch: r.batch as string,
    joinedDate: r.joined_date as string,
    onboardingComplete: r.onboarding_complete as boolean,
  };
}

export async function getUser(id: string): Promise<AuthUser | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return mapAuthUser(data);
}

export async function createUser(profile: AuthUser): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('users').insert({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    college: profile.college ?? null,
    year_of_study: profile.yearOfStudy ?? null,
    phone: profile.phone ?? null,
    major: profile.major ?? null,
    github_url: profile.githubUrl ?? null,
    linkedin_url: profile.linkedinUrl ?? null,
    portfolio_url: profile.portfolioUrl ?? null,
    batch: profile.batch,
    joined_date: profile.joinedDate,
    onboarding_complete: profile.onboardingComplete,
  });
  if (error) throw error;
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<AuthUser, 'name' | 'college' | 'yearOfStudy' | 'role' | 'onboardingComplete' | 'phone' | 'major' | 'githubUrl' | 'linkedinUrl' | 'portfolioUrl'>>
): Promise<void> {
  const supabase = requireSupabase();
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.college !== undefined) dbUpdates.college = updates.college;
  if (updates.yearOfStudy !== undefined) dbUpdates.year_of_study = updates.yearOfStudy;
  if (updates.role !== undefined) dbUpdates.role = updates.role;
  if (updates.onboardingComplete !== undefined) dbUpdates.onboarding_complete = updates.onboardingComplete;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.major !== undefined) dbUpdates.major = updates.major;
  if (updates.githubUrl !== undefined) dbUpdates.github_url = updates.githubUrl;
  if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
  if (updates.portfolioUrl !== undefined) dbUpdates.portfolio_url = updates.portfolioUrl;
  const { error } = await supabase.from('users').update(dbUpdates).eq('id', id);
  if (error) throw error;
}

export async function getAllUsers(): Promise<AuthUser[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('users').select('*').order('name');
  return ((data as Record<string, unknown>[]) || []).map(mapAuthUser);
}

// ─── User Settings ────────────────────────────────────────────────

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark';
  displayName: string;
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (!data) return null;
  return {
    userId: data.user_id,
    theme: data.theme as 'light' | 'dark',
    displayName: data.display_name,
  };
}

export async function upsertUserSettings(
  userId: string,
  settings: { theme?: 'light' | 'dark'; displayName?: string }
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = { user_id: userId };
  if (settings.theme !== undefined) payload.theme = settings.theme;
  if (settings.displayName !== undefined) payload.display_name = settings.displayName;
  const { error } = await supabase.from('user_settings').upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
}

// ─── Progress ─────────────────────────────────────────────────────

export interface DbProgress {
  userId: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  trainingStartDate: string;
}

export async function getProgress(userId: string): Promise<DbProgress | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('progress').select('*').eq('user_id', userId).maybeSingle();
  if (!data) return null;
  return {
    userId: data.user_id,
    xp: data.xp,
    level: data.level,
    streak: data.streak,
    lastActive: data.last_active,
    trainingStartDate: data.training_start_date,
  };
}

export async function upsertProgress(userId: string, p: Omit<DbProgress, 'userId'>): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('progress').upsert({
    user_id: userId,
    xp: p.xp,
    level: p.level,
    streak: p.streak,
    last_active: p.lastActive,
    training_start_date: p.trainingStartDate,
  }, { onConflict: 'user_id' });
  if (error) throw error;
}

// ─── Completed Items ──────────────────────────────────────────────

export interface DbCompletedItem {
  itemType: string;
  itemId: string;
}

export async function getCompletedItems(userId: string): Promise<DbCompletedItem[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('completed_items').select('item_type, item_id').eq('user_id', userId);
  return (data || []).map((r: Record<string, unknown>) => ({
    itemType: r.item_type as string,
    itemId: r.item_id as string,
  }));
}

export async function setCompletedItems(userId: string, items: DbCompletedItem[]): Promise<void> {
  const supabase = requireSupabase();
  const { error: delError } = await supabase.from('completed_items').delete().eq('user_id', userId);
  if (delError) throw delError;
  if (items.length === 0) return;
  const { error } = await supabase.from('completed_items').insert(
    items.map(item => ({
      user_id: userId,
      item_type: item.itemType,
      item_id: item.itemId,
    }))
  );
  if (error) throw error;
}

// ─── Passed Quizzes ───────────────────────────────────────────────

export async function getPassedQuizzes(userId: string): Promise<string[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('passed_quizzes').select('module_id').eq('user_id', userId);
  return (data || []).map((r: Record<string, unknown>) => r.module_id as string);
}

export async function setPassedQuizzes(userId: string, moduleIds: string[]): Promise<void> {
  const supabase = requireSupabase();
  const { error: delError } = await supabase.from('passed_quizzes').delete().eq('user_id', userId);
  if (delError) throw delError;
  if (moduleIds.length === 0) return;
  const { error } = await supabase.from('passed_quizzes').insert(
    moduleIds.map(moduleId => ({ user_id: userId, module_id: moduleId }))
  );
  if (error) throw error;
}

// ─── Module Progress ──────────────────────────────────────────────

export interface DbModuleProgressEntry {
  moduleId: string;
  lessons: string[];
  practices: string[];
  challenges: string[];
  quizPassed: boolean;
  xp: number;
  checkpoints: Record<string, unknown>;
  assessmentResult: unknown;
}

export async function getModuleProgressMap(userId: string): Promise<Record<string, DbModuleProgressEntry>> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('module_progress').select('*').eq('user_id', userId);
  const result: Record<string, DbModuleProgressEntry> = {};
  for (const row of (data || [])) {
    result[row.module_id] = {
      moduleId: row.module_id,
      lessons: [],
      practices: [],
      challenges: [],
      quizPassed: row.quiz_passed,
      xp: row.xp_earned,
      checkpoints: row.checkpoints as Record<string, unknown> || {},
      assessmentResult: row.assessment_attempts || [],
    };
  }
  return result;
}

export async function upsertModuleProgressMap(
  userId: string,
  modules: Record<string, { lessons: string[]; practices: string[]; challenges: string[]; quizPassed: boolean; xp: number; checkpoints?: Record<string, unknown>; assessmentResult?: unknown }>
): Promise<void> {
  const supabase = requireSupabase();
  // Delete existing rows for this user
  const { error: delError } = await supabase.from('module_progress').delete().eq('user_id', userId);
  if (delError) throw delError;
  const entries = Object.entries(modules);
  if (entries.length === 0) return;
  const { error } = await supabase.from('module_progress').insert(
    entries.map(([moduleId, mp]) => ({
      user_id: userId,
      module_id: moduleId,
      quiz_passed: mp.quizPassed,
      xp_earned: mp.xp,
      checkpoints: mp.checkpoints || {},
      assessment_attempts: mp.assessmentResult || [],
    }))
  );
  if (error) throw error;
}

// ─── XP History ───────────────────────────────────────────────────

export interface DbXpEntry {
  date: string;
  amount: number;
  source: string;
}

export async function getXpHistory(userId: string): Promise<DbXpEntry[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('xp_history').select('date, amount, source').eq('user_id', userId);
  return (data || []).map((r: Record<string, unknown>) => ({
    date: r.date as string,
    amount: r.amount as number,
    source: (r.source as string) || '',
  }));
}

export async function setXpHistory(userId: string, entries: DbXpEntry[]): Promise<void> {
  const supabase = requireSupabase();
  const { error: delError } = await supabase.from('xp_history').delete().eq('user_id', userId);
  if (delError) throw delError;
  if (entries.length === 0) return;
  const { error } = await supabase.from('xp_history').insert(
    entries.map(e => ({ user_id: userId, date: e.date, amount: e.amount, source: e.source }))
  );
  if (error) throw error;
}

// ─── Weekly Goals ─────────────────────────────────────────────────

export interface DbWeeklyGoal {
  weekStart: string;
  labs: number;
  labsCompleted: number;
  assessments: number;
  assessmentsCompleted: number;
  weeklyXp: number;
  weeklyXpTarget: number;
}

export async function getWeeklyGoal(userId: string): Promise<DbWeeklyGoal | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('weekly_goals').select('*').eq('user_id', userId).maybeSingle();
  if (!data) return null;
  return {
    weekStart: data.week_start,
    labs: data.labs,
    labsCompleted: data.labs_completed,
    assessments: data.assessments,
    assessmentsCompleted: data.assessments_completed,
    weeklyXp: data.weekly_xp,
    weeklyXpTarget: data.weekly_xp_target,
  };
}

export async function upsertWeeklyGoal(userId: string, g: DbWeeklyGoal): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('weekly_goals').upsert({
    user_id: userId,
    week_start: g.weekStart,
    labs: g.labs,
    labs_completed: g.labsCompleted,
    assessments: g.assessments,
    assessments_completed: g.assessmentsCompleted,
    weekly_xp: g.weeklyXp,
    weekly_xp_target: g.weeklyXpTarget,
  }, { onConflict: '(user_id, week_start)' });
  if (error) throw error;
}

// ─── Mentor Checklist ─────────────────────────────────────────────

export async function getMentorChecklist(userId: string): Promise<{
  githubProfile: string;
  deployedProjectLink: string;
  repositoryLink: string;
  challengesCompleted: string[];
  submitted: boolean;
} | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('mentor_checklist').select('*').eq('user_id', userId).maybeSingle();
  if (!data) return null;
  return {
    githubProfile: data.github_profile || '',
    deployedProjectLink: data.deployed_project_link || '',
    repositoryLink: data.repository_link || '',
    challengesCompleted: data.challenges_completed || [],
    submitted: data.submitted || false,
  };
}

export async function upsertMentorChecklist(
  userId: string,
  c: { githubProfile: string; deployedProjectLink: string; repositoryLink: string; challengesCompleted: string[]; submitted: boolean }
): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('mentor_checklist').upsert({
    user_id: userId,
    github_profile: c.githubProfile,
    deployed_project_link: c.deployedProjectLink,
    repository_link: c.repositoryLink,
    challenges_completed: c.challengesCompleted,
    submitted: c.submitted,
  }, { onConflict: 'user_id' });
  if (error) throw error;
}

// ─── Practice Submissions ─────────────────────────────────────────

export async function getPracticeSubmissions(userId: string): Promise<{ taskId: string; submission: string; savedAt: string }[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('practice_submissions').select('*').eq('user_id', userId);
  return (data || []).map((r: Record<string, unknown>) => ({
    taskId: r.task_id as string,
    submission: r.submission as string,
    savedAt: r.saved_at as string,
  }));
}

export async function setPracticeSubmissions(userId: string, submissions: { taskId: string; submission: string; savedAt: string }[]): Promise<void> {
  const supabase = requireSupabase();
  const { error: delError } = await supabase.from('practice_submissions').delete().eq('user_id', userId);
  if (delError) throw delError;
  if (submissions.length === 0) return;
  const { error } = await supabase.from('practice_submissions').insert(
    submissions.map(s => ({ user_id: userId, task_id: s.taskId, submission: s.submission, saved_at: s.savedAt }))
  );
  if (error) throw error;
}

// ─── Challenge Workspaces ─────────────────────────────────────────

export async function getChallengeWorkspaces(userId: string): Promise<{ challengeId: string; notes: string; submission: string; hintsRevealed: number; status: string }[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('challenge_workspaces').select('*').eq('user_id', userId);
  return (data || []).map((r: Record<string, unknown>) => ({
    challengeId: r.challenge_id as string,
    notes: r.notes as string,
    submission: r.submission as string,
    hintsRevealed: r.hints_revealed as number,
    status: r.status as string,
  }));
}

export async function setChallengeWorkspaces(userId: string, workspaces: { challengeId: string; notes: string; submission: string; hintsRevealed: number; status: string }[]): Promise<void> {
  const supabase = requireSupabase();
  const { error: delError } = await supabase.from('challenge_workspaces').delete().eq('user_id', userId);
  if (delError) throw delError;
  if (workspaces.length === 0) return;
  const { error } = await supabase.from('challenge_workspaces').insert(
    workspaces.map(w => ({
      user_id: userId,
      challenge_id: w.challengeId,
      notes: w.notes,
      submission: w.submission,
      hints_revealed: w.hintsRevealed,
      status: w.status,
    }))
  );
  if (error) throw error;
}

// ─── Mentor Feedback ──────────────────────────────────────────────

export interface DbMentorFeedbackEntry {
  id: string;
  date: string;
  score: number;
  note: string;
  module: string;
}

export async function getMentorFeedback(userId: string): Promise<DbMentorFeedbackEntry[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('mentor_feedback').select('*').eq('user_id', userId);
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    date: r.date as string,
    score: r.score as number,
    note: (r.note as string) || '',
    module: (r.module as string) || '',
  }));
}

export async function setMentorFeedback(userId: string, feedback: DbMentorFeedbackEntry[]): Promise<void> {
  const supabase = requireSupabase();
  const { error: delError } = await supabase.from('mentor_feedback').delete().eq('user_id', userId);
  if (delError) throw delError;
  if (feedback.length === 0) return;
  const { error } = await supabase.from('mentor_feedback').insert(
    feedback.map(f => ({ user_id: userId, date: f.date, score: f.score, note: f.note, module: f.module }))
  );
  if (error) throw error;
}

// ─── Migration Status ─────────────────────────────────────────────

export async function getMigratedEntities(userId: string): Promise<string[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('migration_status').select('entity').eq('user_id', userId);
  return (data || []).map((r: Record<string, unknown>) => r.entity as string);
}

export async function markMigrated(userId: string, entity: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('migration_status').upsert(
    { user_id: userId, entity },
    { onConflict: '(user_id, entity)' }
  );
  if (error) throw error;
}

// ─── Applications (Phase C) ───────────────────────────────────────

export interface DbApplication {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  yearOfStudy?: string;
  major?: string;
  whyJoin?: string;
  heardFrom?: string;
  resumeUrl?: string;
  opportunityId?: string;
  answers?: Record<string, string>;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  appliedAt: string;
  reviewerId?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  screeningStatus?: 'pending' | 'processing' | 'analyzed' | 'failed';
  offerAcceptedAt?: string;
}

export async function submitApplication(data: {
  name: string;
  email: string;
  phone?: string;
  college?: string;
  yearOfStudy?: string;
  major?: string;
  whyJoin?: string;
  heardFrom?: string;
  resumeUrl?: string;
  userId?: string;
  opportunityId?: string;
  answers?: Record<string, string>;
}): Promise<string> {
  const supabase = requireSupabase();
  const applicationId = crypto.randomUUID();
  
  const { error } = await supabase.from('applications').insert({
    id: applicationId,
    user_id: data.userId ?? null,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    college: data.college ?? null,
    year_of_study: data.yearOfStudy ?? null,
    major: data.major ?? null,
    why_join: data.whyJoin ?? null,
    heard_from: data.heardFrom ?? null,
    resume_url: data.resumeUrl ?? null,
    opportunity_id: data.opportunityId ?? null,
    answers: data.answers ?? null,
    status: 'pending',
  });
  if (error) throw error;
  
  return applicationId;
}

export async function getApplications(): Promise<DbApplication[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('applications').select('*').order('applied_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    userId: r.user_id as string | undefined,
    name: r.name as string,
    email: r.email as string,
    phone: r.phone as string | undefined,
    college: r.college as string | undefined,
    yearOfStudy: r.year_of_study as string | undefined,
    major: r.major as string | undefined,
    whyJoin: r.why_join as string | undefined,
    heardFrom: r.heard_from as string | undefined,
    resumeUrl: r.resume_url as string | undefined,
    opportunityId: r.opportunity_id as string | undefined,
    answers: r.answers as Record<string, string> | undefined,
    status: r.status as DbApplication['status'],
    appliedAt: r.applied_at as string,
    reviewerId: r.reviewer_id as string | undefined,
    reviewedAt: r.reviewed_at as string | undefined,
    reviewerNotes: r.reviewer_notes as string | undefined,
    screeningStatus: r.screening_status as DbApplication['screeningStatus'],
    offerAcceptedAt: r.offer_accepted_at as string | undefined,
  }));
}

export async function getApplicationByUserId(userId: string): Promise<DbApplication | null> {
  const supabase = requireSupabase();
  // Normally exactly one row per user, but nothing in the schema enforces
  // that (e.g. a failed resume upload followed by a resubmit can leave two
  // rows behind) -- order + limit(1) before maybeSingle() so an unexpected
  // duplicate degrades to "show the most recent one" instead of throwing
  // and silently rendering as "no application yet".
  const { data } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('applied_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    college: data.college,
    yearOfStudy: data.year_of_study,
    major: data.major,
    whyJoin: data.why_join,
    heardFrom: data.heard_from,
    resumeUrl: data.resume_url,
    opportunityId: data.opportunity_id,
    answers: data.answers,
    status: data.status,
    appliedAt: data.applied_at,
    reviewerId: data.reviewer_id,
    reviewedAt: data.reviewed_at,
    reviewerNotes: data.reviewer_notes,
    screeningStatus: data.screening_status,
    offerAcceptedAt: data.offer_accepted_at,
  };
}

export async function getApplication(id: string): Promise<DbApplication | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('applications').select('*').eq('id', id).single();
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    college: data.college,
    yearOfStudy: data.year_of_study,
    major: data.major,
    whyJoin: data.why_join,
    heardFrom: data.heard_from,
    resumeUrl: data.resume_url,
    opportunityId: data.opportunity_id,
    answers: data.answers,
    status: data.status,
    appliedAt: data.applied_at,
    reviewerId: data.reviewer_id,
    reviewedAt: data.reviewed_at,
    reviewerNotes: data.reviewer_notes,
    screeningStatus: data.screening_status,
    offerAcceptedAt: data.offer_accepted_at,
  };
}

export async function updateApplication(
  id: string,
  updates: {
    status?: DbApplication['status'];
    reviewerId?: string;
    reviewerNotes?: string;
  }
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = {};
  if (updates.status) payload.status = updates.status;
  if (updates.reviewerId) payload.reviewer_id = updates.reviewerId;
  if (updates.reviewerNotes !== undefined) payload.reviewer_notes = updates.reviewerNotes;
  const { error } = await supabase.from('applications').update(payload).eq('id', id);
  if (error) throw error;
}

// Applicant's own confirmation that they want the offer -- routed through a
// narrow SECURITY DEFINER function (022_offer_acceptance.sql) rather than a
// direct update, since applicants otherwise have no UPDATE path onto their
// own already-linked application row at all.
export async function acceptOffer(applicationId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.rpc('accept_offer', { p_application_id: applicationId });
  if (error) throw error;
}

// ─── Resume Files (Phase D.7) ─────────────────────────────────────

export interface DbResumeFile {
  id: string;
  applicationId?: string;
  userId?: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  extractedText?: string;
  uploadedAt: string;
}

export async function uploadResumeFile(
  applicationId: string,
  file: File,
  userId: string
): Promise<DbResumeFile> {
  const supabase = requireSupabase();
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${applicationId}/${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });
  if (uploadError) throw uploadError;
  const { error: dbError } = await supabase.from('resume_files').insert({
    application_id: applicationId,
    file_path: filePath,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type,
  });
  if (dbError) throw dbError;
  const { data: inserted } = await supabase
    .from('resume_files')
    .select('*')
    .eq('application_id', applicationId)
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  return {
    id: inserted?.id || '',
    applicationId: inserted?.application_id || applicationId,
    filePath: inserted?.file_path || filePath,
    fileName: inserted?.file_name || file.name,
    fileSize: inserted?.file_size || file.size,
    mimeType: inserted?.mime_type || file.type,
    extractedText: inserted?.extracted_text || null,
    uploadedAt: inserted?.uploaded_at || new Date().toISOString(),
  };
}

export async function getResumeFiles(applicationId: string): Promise<DbResumeFile[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('resume_files')
    .select('*')
    .eq('application_id', applicationId)
    .order('uploaded_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    applicationId: r.application_id as string,
    filePath: r.file_path as string,
    fileName: r.file_name as string,
    fileSize: r.file_size as number,
    mimeType: r.mime_type as string,
    extractedText: r.extracted_text as string | undefined,
    uploadedAt: r.uploaded_at as string,
  }));
}

export async function getResumeDownloadUrl(filePath: string): Promise<string> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage.from('resumes').createSignedUrl(filePath, 300);
  if (error || !data) throw error || new Error('Failed to create signed URL');
  return data.signedUrl;
}

export async function deleteResumeFile(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { data: file } = await supabase.from('resume_files').select('file_path').eq('id', id).single();
  if (file) {
    await supabase.storage.from('resumes').remove([file.file_path]);
  }
  const { error } = await supabase.from('resume_files').delete().eq('id', id);
  if (error) throw error;
}

// Profile-level resume -- uploaded once, before any application exists
// (023_applicant_profile.sql made application_id nullable and added
// user_id specifically for this). Apply flow attaches it to the real
// application id at submit time via attachResumeToApplication rather than
// re-uploading the file.
export async function uploadProfileResume(userId: string, file: File): Promise<DbResumeFile> {
  const supabase = requireSupabase();
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/profile/${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (uploadError) throw uploadError;
  const { data: inserted, error: dbError } = await supabase
    .from('resume_files')
    .insert({ user_id: userId, file_path: filePath, file_name: file.name, file_size: file.size, mime_type: file.type })
    .select()
    .single();
  if (dbError) throw dbError;
  return {
    id: inserted.id,
    applicationId: inserted.application_id ?? undefined,
    userId: inserted.user_id ?? undefined,
    filePath: inserted.file_path,
    fileName: inserted.file_name,
    fileSize: inserted.file_size,
    mimeType: inserted.mime_type,
    extractedText: inserted.extracted_text,
    uploadedAt: inserted.uploaded_at,
  };
}

export async function getProfileResume(userId: string): Promise<DbResumeFile | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('resume_files')
    .select('*')
    .eq('user_id', userId)
    .is('application_id', null)
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    applicationId: data.application_id ?? undefined,
    userId: data.user_id ?? undefined,
    filePath: data.file_path,
    fileName: data.file_name,
    fileSize: data.file_size,
    mimeType: data.mime_type,
    extractedText: data.extracted_text,
    uploadedAt: data.uploaded_at,
  };
}

// Links a profile-level resume to a real application once one exists,
// instead of asking the applicant to upload the same file again.
export async function attachResumeToApplication(resumeId: string, applicationId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('resume_files').update({ application_id: applicationId }).eq('id', resumeId);
  if (error) throw error;
}

// ─── Applicant Experiences (Phase D.10) ───────────────────────────
// Repeatable work/project history, filled once on the profile and reused
// across the (currently one, ever) real application an applicant submits.

export interface DbApplicantExperience {
  id: string;
  userId: string;
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  sortOrder: number;
}

export async function getApplicantExperiences(userId: string): Promise<DbApplicantExperience[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('applicant_experiences')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });
  return ((data as Record<string, unknown>[]) || []).map(r => ({
    id: r.id as string,
    userId: r.user_id as string,
    title: r.title as string,
    company: r.company as string,
    startDate: (r.start_date as string) ?? undefined,
    endDate: (r.end_date as string) ?? undefined,
    description: (r.description as string) ?? undefined,
    sortOrder: r.sort_order as number,
  }));
}

export async function createApplicantExperience(data: {
  userId: string;
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  sortOrder?: number;
}): Promise<string> {
  const supabase = requireSupabase();
  const { data: inserted, error } = await supabase
    .from('applicant_experiences')
    .insert({
      user_id: data.userId,
      title: data.title,
      company: data.company,
      start_date: data.startDate ?? null,
      end_date: data.endDate ?? null,
      description: data.description ?? null,
      sort_order: data.sortOrder ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return inserted.id;
}

export async function deleteApplicantExperience(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('applicant_experiences').delete().eq('id', id);
  if (error) throw error;
}

// ─── Resume Analysis (Phase D.7) ──────────────────────────────────

export interface DbResumeAnalysis {
  id: string;
  applicationId: string;
  opportunityId?: string;
  technicalScore?: number;
  projectsScore?: number;
  githubScore?: number;
  portfolioScore?: number;
  educationScore?: number;
  experienceScore?: number;
  communicationScore?: number;
  learningPotentialScore?: number;
  motivationScore?: number;
  resumeQualityScore?: number;
  overallScore?: number;
  recommendation?: 'strongly_recommend' | 'recommend' | 'neutral' | 'weak' | 'reject';
  confidenceScore?: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  riskIndicators: string[];
  positiveFindings: string[];
  topReasons: string[];
  rawResponse: Record<string, unknown>;
  modelUsed?: string;
  analysisVersion: number;
  processingTimeMs?: number;
  analyzedAt?: string;
  createdAt: string;
}

export async function getResumeAnalysis(applicationId: string): Promise<DbResumeAnalysis | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('application_id', applicationId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    applicationId: data.application_id,
    opportunityId: data.opportunity_id,
    technicalScore: data.technical_score,
    projectsScore: data.projects_score,
    githubScore: data.github_score,
    portfolioScore: data.portfolio_score,
    educationScore: data.education_score,
    experienceScore: data.experience_score,
    communicationScore: data.communication_score,
    learningPotentialScore: data.learning_potential_score,
    motivationScore: data.motivation_score,
    resumeQualityScore: data.resume_quality_score,
    overallScore: data.overall_score,
    recommendation: data.recommendation,
    confidenceScore: data.confidence_score,
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    missingSkills: data.missing_skills || [],
    riskIndicators: data.risk_indicators || [],
    positiveFindings: data.positive_findings || [],
    topReasons: data.top_reasons || [],
    rawResponse: data.raw_response || {},
    modelUsed: data.model_used,
    analysisVersion: data.analysis_version,
    processingTimeMs: data.processing_time_ms,
    analyzedAt: data.analyzed_at,
    createdAt: data.created_at,
  };
}

export async function triggerAnalysis(applicationId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.functions.invoke('analyze-resume', {
    body: { applicationId },
  });
  if (error) throw error;
}

// ─── Scoring Weights ──────────────────────────────────────────────

export interface DbScoringWeights {
  id: string;
  opportunityCategory: string;
  technicalWeight: number;
  projectsWeight: number;
  githubWeight: number;
  portfolioWeight: number;
  educationWeight: number;
  experienceWeight: number;
  communicationWeight: number;
  learningPotentialWeight: number;
  motivationWeight: number;
}

export async function getScoringWeights(category: string): Promise<DbScoringWeights | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('opportunity_scoring_weights')
    .select('*')
    .eq('opportunity_category', category)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    opportunityCategory: data.opportunity_category,
    technicalWeight: Number(data.technical_weight),
    projectsWeight: Number(data.projects_weight),
    githubWeight: Number(data.github_weight),
    portfolioWeight: Number(data.portfolio_weight),
    educationWeight: Number(data.education_weight),
    experienceWeight: Number(data.experience_weight),
    communicationWeight: Number(data.communication_weight),
    learningPotentialWeight: Number(data.learning_potential_weight),
    motivationWeight: Number(data.motivation_weight),
  };
}

export async function getAllScoringWeights(): Promise<DbScoringWeights[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('opportunity_scoring_weights')
    .select('*')
    .order('opportunity_category');
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    opportunityCategory: r.opportunity_category as string,
    technicalWeight: Number(r.technical_weight),
    projectsWeight: Number(r.projects_weight),
    githubWeight: Number(r.github_weight),
    portfolioWeight: Number(r.portfolio_weight),
    educationWeight: Number(r.education_weight),
    experienceWeight: Number(r.experience_weight),
    communicationWeight: Number(r.communication_weight),
    learningPotentialWeight: Number(r.learning_potential_weight),
    motivationWeight: Number(r.motivation_weight),
  }));
}

export async function updateScoringWeights(
  category: string,
  weights: Partial<Omit<DbScoringWeights, 'id' | 'opportunityCategory'>>
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = {};
  if (weights.technicalWeight !== undefined) payload.technical_weight = weights.technicalWeight;
  if (weights.projectsWeight !== undefined) payload.projects_weight = weights.projectsWeight;
  if (weights.githubWeight !== undefined) payload.github_weight = weights.githubWeight;
  if (weights.portfolioWeight !== undefined) payload.portfolio_weight = weights.portfolioWeight;
  if (weights.educationWeight !== undefined) payload.education_weight = weights.educationWeight;
  if (weights.experienceWeight !== undefined) payload.experience_weight = weights.experienceWeight;
  if (weights.communicationWeight !== undefined) payload.communication_weight = weights.communicationWeight;
  if (weights.learningPotentialWeight !== undefined) payload.learning_potential_weight = weights.learningPotentialWeight;
  if (weights.motivationWeight !== undefined) payload.motivation_weight = weights.motivationWeight;
  const { error } = await supabase
    .from('opportunity_scoring_weights')
    .update(payload)
    .eq('opportunity_category', category);
  if (error) throw error;
}

// ─── Analysis Versions ────────────────────────────────────────────

export interface DbAnalysisVersion {
  id: string;
  applicationId: string;
  analysisId: string;
  versionNumber: number;
  triggerReason: string;
  scores: Record<string, unknown>;
  recommendation?: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  riskIndicators: string[];
  rawResponse: Record<string, unknown>;
  modelUsed?: string;
  processingTimeMs?: number;
  createdAt: string;
}

export async function getAnalysisVersions(applicationId: string): Promise<DbAnalysisVersion[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('resume_analysis_versions')
    .select('*')
    .eq('application_id', applicationId)
    .order('version_number', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    applicationId: r.application_id as string,
    analysisId: r.analysis_id as string,
    versionNumber: r.version_number as number,
    triggerReason: r.trigger_reason as string,
    scores: (r.scores as Record<string, unknown>) || {},
    recommendation: r.recommendation as string | undefined,
    strengths: (r.strengths as string[]) || [],
    weaknesses: (r.weaknesses as string[]) || [],
    missingSkills: (r.missing_skills as string[]) || [],
    riskIndicators: (r.risk_indicators as string[]) || [],
    rawResponse: (r.raw_response as Record<string, unknown>) || {},
    modelUsed: r.model_used as string | undefined,
    processingTimeMs: r.processing_time_ms as number | undefined,
    createdAt: r.created_at as string,
  }));
}

export async function linkApplicationToUser(
  email: string,
  userId: string
): Promise<{ status: DbApplication['status'] } | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('applications')
    .update({ user_id: userId })
    .eq('email', email)
    .is('user_id', null)
    .select('status')
    .maybeSingle();
  if (error) throw error;
  return data ? { status: data.status as DbApplication['status'] } : null;
}

// ─── Interviews (Phase C) ─────────────────────────────────────────

export interface DbInterview {
  id: string;
  applicationId: string;
  applicantId: string;
  scheduledAt: string;
  durationMinutes: number;
  interviewers: string[];
  meetLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt: string;
}

export async function createInterview(data: {
  applicationId: string;
  applicantId: string;
  scheduledAt: string;
  durationMinutes?: number;
  interviewers?: string[];
  meetLink?: string;
  notes?: string;
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('interviews').insert({
    application_id: data.applicationId,
    applicant_id: data.applicantId,
    scheduled_at: data.scheduledAt,
    duration_minutes: data.durationMinutes ?? 45,
    interviewers: data.interviewers ?? [],
    meet_link: data.meetLink ?? null,
    notes: data.notes ?? null,
  });
  if (error) throw error;
}

export async function getInterviews(): Promise<DbInterview[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('interviews').select('*').order('scheduled_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    applicationId: r.application_id as string,
    applicantId: r.applicant_id as string,
    scheduledAt: r.scheduled_at as string,
    durationMinutes: r.duration_minutes as number,
    interviewers: (r.interviewers as string[]) || [],
    meetLink: r.meet_link as string | undefined,
    status: r.status as DbInterview['status'],
    notes: r.notes as string | undefined,
    createdAt: r.created_at as string,
  }));
}

export async function getInterviewsByApplicant(applicantId: string): Promise<DbInterview[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('interviews')
    .select('*')
    .eq('applicant_id', applicantId)
    .order('scheduled_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    applicationId: r.application_id as string,
    applicantId: r.applicant_id as string,
    scheduledAt: r.scheduled_at as string,
    durationMinutes: r.duration_minutes as number,
    interviewers: (r.interviewers as string[]) || [],
    meetLink: r.meet_link as string | undefined,
    status: r.status as DbInterview['status'],
    notes: r.notes as string | undefined,
    createdAt: r.created_at as string,
  }));
}

export async function getInterview(id: string): Promise<DbInterview | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('interviews').select('*').eq('id', id).single();
  if (!data) return null;
  return {
    id: data.id,
    applicationId: data.application_id,
    applicantId: data.applicant_id,
    scheduledAt: data.scheduled_at,
    durationMinutes: data.duration_minutes,
    interviewers: data.interviewers || [],
    meetLink: data.meet_link,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
  };
}

export async function updateInterview(
  id: string,
  updates: {
    status?: DbInterview['status'];
    scheduledAt?: string;
    meetLink?: string;
    notes?: string;
  }
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = {};
  if (updates.status) payload.status = updates.status;
  if (updates.scheduledAt) payload.scheduled_at = updates.scheduledAt;
  if (updates.meetLink) payload.meet_link = updates.meetLink;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  const { error } = await supabase.from('interviews').update(payload).eq('id', id);
  if (error) throw error;
}

// ─── Interview Evaluations (Phase C) ──────────────────────────────

export interface DbInterviewEvaluation {
  id: string;
  interviewId: string;
  evaluatorId: string;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  overallScore?: number;
  strengths: string[];
  weaknesses: string[];
  notes?: string;
  recommendation?: 'strong_accept' | 'accept' | 'maybe' | 'reject';
}

export async function upsertInterviewEvaluation(data: {
  interviewId: string;
  evaluatorId: string;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  overallScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  notes?: string;
  recommendation?: 'strong_accept' | 'accept' | 'maybe' | 'reject';
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('interview_evaluations').upsert({
    interview_id: data.interviewId,
    evaluator_id: data.evaluatorId,
    technical_score: data.technicalScore ?? null,
    communication_score: data.communicationScore ?? null,
    problem_solving_score: data.problemSolvingScore ?? null,
    overall_score: data.overallScore ?? null,
    strengths: data.strengths ?? [],
    weaknesses: data.weaknesses ?? [],
    notes: data.notes ?? null,
    recommendation: data.recommendation ?? null,
  }, { onConflict: '(interview_id, evaluator_id)' });
  if (error) throw error;
}

export async function getInterviewEvaluation(
  interviewId: string
): Promise<DbInterviewEvaluation | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('interview_evaluations')
    .select('*')
    .eq('interview_id', interviewId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    interviewId: data.interview_id,
    evaluatorId: data.evaluator_id,
    technicalScore: data.technical_score,
    communicationScore: data.communication_score,
    problemSolvingScore: data.problem_solving_score,
    overallScore: data.overall_score,
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    notes: data.notes,
    recommendation: data.recommendation,
  };
}

export async function getInterviewEvaluationsForApplicant(
  applicantId: string
): Promise<DbInterviewEvaluation[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('interview_evaluations')
    .select('*, interviews!inner(applicant_id)')
    .eq('interviews.applicant_id', applicantId);
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    interviewId: r.interview_id as string,
    evaluatorId: r.evaluator_id as string,
    technicalScore: r.technical_score as number | undefined,
    communicationScore: r.communication_score as number | undefined,
    problemSolvingScore: r.problem_solving_score as number | undefined,
    overallScore: r.overall_score as number | undefined,
    strengths: (r.strengths as string[]) || [],
    weaknesses: (r.weaknesses as string[]) || [],
    notes: r.notes as string | undefined,
    recommendation: r.recommendation as DbInterviewEvaluation['recommendation'],
  }));
}

// ─── Mentor Assignments (Phase C) ─────────────────────────────────

export interface DbMentorAssignment {
  id: string;
  internId: string;
  mentorId: string;
  mentorName?: string;
  internName?: string;
  assignedAt: string;
  status: 'active' | 'completed';
}

export async function assignMentor(internId: string, mentorId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('mentor_assignments').upsert({
    intern_id: internId,
    mentor_id: mentorId,
    status: 'active',
  }, { onConflict: 'intern_id' });
  if (error) throw error;
}

export async function getMentorAssignmentByIntern(internId: string): Promise<DbMentorAssignment | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('mentor_assignments')
    .select('*, mentor:mentor_id(name), intern:intern_id(name)')
    .eq('intern_id', internId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    internId: data.intern_id,
    mentorId: data.mentor_id,
    mentorName: (data.mentor as Record<string, unknown> | undefined)?.name as string | undefined,
    internName: (data.intern as Record<string, unknown> | undefined)?.name as string | undefined,
    assignedAt: data.assigned_at,
    status: data.status,
  };
}

export async function getMentorAssignments(): Promise<DbMentorAssignment[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('mentor_assignments')
    .select('*, mentor:mentor_id(name, email), intern:intern_id(name, email)')
    .order('assigned_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    internId: r.intern_id as string,
    mentorId: r.mentor_id as string,
    mentorName: (r.mentor as Record<string, unknown> | undefined)?.name as string | undefined,
    internName: (r.intern as Record<string, unknown> | undefined)?.name as string | undefined,
    assignedAt: r.assigned_at as string,
    status: r.status as DbMentorAssignment['status'],
  }));
}

export async function getMentorMentees(mentorId: string): Promise<DbMentorAssignment[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('mentor_assignments')
    .select('*, intern:intern_id(name, email)')
    .eq('mentor_id', mentorId)
    .eq('status', 'active')
    .order('assigned_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    internId: r.intern_id as string,
    mentorId: r.mentor_id as string,
    internName: (r.intern as Record<string, unknown> | undefined)?.name as string | undefined,
    assignedAt: r.assigned_at as string,
    status: r.status as DbMentorAssignment['status'],
  }));
}

// ─── Readiness Evaluations (Phase C) ──────────────────────────────

export interface DbReadinessEvaluation {
  id: string;
  internId: string;
  evaluatorId: string;
  technicalReadiness: number;
  communicationReadiness: number;
  problemSolvingReadiness: number;
  overallReadiness: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: 'ready' | 'needs_improvement' | 'not_ready';
  evaluatedAt: string;
}

export async function createReadinessEvaluation(data: {
  internId: string;
  evaluatorId: string;
  technicalReadiness: number;
  communicationReadiness: number;
  problemSolvingReadiness: number;
  overallReadiness: number;
  strengths?: string[];
  areasForImprovement?: string[];
  recommendation: 'ready' | 'needs_improvement' | 'not_ready';
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('readiness_evaluations').insert({
    intern_id: data.internId,
    evaluator_id: data.evaluatorId,
    technical_readiness: data.technicalReadiness,
    communication_readiness: data.communicationReadiness,
    problem_solving_readiness: data.problemSolvingReadiness,
    overall_readiness: data.overallReadiness,
    strengths: data.strengths ?? [],
    areas_for_improvement: data.areasForImprovement ?? [],
    recommendation: data.recommendation,
  });
  if (error) throw error;
}

export async function getReadinessEvaluations(
  internId: string
): Promise<DbReadinessEvaluation[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('readiness_evaluations')
    .select('*')
    .eq('intern_id', internId)
    .order('evaluated_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    internId: r.intern_id as string,
    evaluatorId: r.evaluator_id as string,
    technicalReadiness: r.technical_readiness as number,
    communicationReadiness: r.communication_readiness as number,
    problemSolvingReadiness: r.problem_solving_readiness as number,
    overallReadiness: r.overall_readiness as number,
    strengths: (r.strengths as string[]) || [],
    areasForImprovement: (r.areas_for_improvement as string[]) || [],
    recommendation: r.recommendation as DbReadinessEvaluation['recommendation'],
    evaluatedAt: r.evaluated_at as string,
  }));
}

// ─── Project Allocations (Phase C) ────────────────────────────────

export interface DbProjectAllocation {
  id: string;
  internId: string;
  internName?: string;
  projectName: string;
  clientName: string;
  role: string;
  startDate: string;
  endDate?: string;
  status: 'allocated' | 'in-progress' | 'completed';
  notes?: string;
}

export async function createProjectAllocation(data: {
  internId: string;
  projectName: string;
  clientName: string;
  role: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('project_allocations').insert({
    intern_id: data.internId,
    project_name: data.projectName,
    client_name: data.clientName,
    role: data.role,
    start_date: data.startDate,
    end_date: data.endDate ?? null,
    notes: data.notes ?? null,
  });
  if (error) throw error;
}

export async function getProjectAllocations(): Promise<DbProjectAllocation[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('project_allocations')
    .select('*, intern:intern_id(name)')
    .order('created_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    internId: r.intern_id as string,
    internName: (r.intern as Record<string, unknown> | undefined)?.name as string | undefined,
    projectName: r.project_name as string,
    clientName: r.client_name as string,
    role: r.role as string,
    startDate: r.start_date as string,
    endDate: r.end_date as string | undefined,
    status: r.status as DbProjectAllocation['status'],
    notes: r.notes as string | undefined,
  }));
}

export async function getProjectAllocationByIntern(
  internId: string
): Promise<DbProjectAllocation | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('project_allocations')
    .select('*')
    .eq('intern_id', internId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    internId: data.intern_id,
    projectName: data.project_name,
    clientName: data.client_name,
    role: data.role,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
    notes: data.notes,
  };
}

export async function updateProjectAllocation(
  id: string,
  updates: {
    status?: DbProjectAllocation['status'];
    endDate?: string;
    notes?: string;
  }
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = {};
  if (updates.status) payload.status = updates.status;
  if (updates.endDate) payload.end_date = updates.endDate;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  const { error } = await supabase.from('project_allocations').update(payload).eq('id', id);
  if (error) throw error;
}

// ─── Opportunities (Phase D.4) ────────────────────────────────────

export const OPPORTUNITY_FORTES = ['Frontend', 'Backend', 'Agentic AI', 'Mobile Development', 'UI / UX Design'] as const;
export type OpportunityForte = (typeof OPPORTUNITY_FORTES)[number];

export interface DbOpportunity {
  id: string;
  title: string;
  description: string;
  category: 'internship' | 'training' | 'fellowship' | 'project';
  status: 'draft' | 'active' | 'closed';
  forte?: OpportunityForte;
  startDate?: string;
  endDate?: string;
  slots?: number;
  createdBy?: string;
  createdAt: string;
}

export interface DbOpportunityQuestion {
  id: string;
  opportunityId: string;
  question: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  sortOrder: number;
}

export async function getOpportunities(status?: string): Promise<DbOpportunity[]> {
  const supabase = requireSupabase();
  let query = supabase.from('opportunities').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data } = await query;
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    title: r.title as string,
    description: r.description as string,
    category: r.category as DbOpportunity['category'],
    status: r.status as DbOpportunity['status'],
    forte: r.forte as DbOpportunity['forte'],
    startDate: r.start_date as string | undefined,
    endDate: r.end_date as string | undefined,
    slots: r.slots as number | undefined,
    createdBy: r.created_by as string | undefined,
    createdAt: r.created_at as string,
  }));
}

export async function getOpportunity(id: string): Promise<DbOpportunity | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('opportunities').select('*').eq('id', id).single();
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    status: data.status,
    forte: data.forte,
    startDate: data.start_date,
    endDate: data.end_date,
    slots: data.slots,
    createdBy: data.created_by,
    createdAt: data.created_at,
  };
}

export async function createOpportunity(data: {
  title: string;
  description: string;
  category?: string;
  status?: string;
  forte?: string;
  startDate?: string;
  endDate?: string;
  slots?: number;
  createdBy: string;
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('opportunities').insert({
    title: data.title,
    description: data.description,
    category: data.category ?? 'internship',
    status: data.status ?? 'draft',
    forte: data.forte || null,
    start_date: data.startDate ?? null,
    end_date: data.endDate ?? null,
    slots: data.slots ?? null,
    created_by: data.createdBy,
  });
  if (error) throw error;
}

export async function updateOpportunity(
  id: string,
  updates: {
    title?: string;
    description?: string;
    category?: string;
    status?: string;
    forte?: string;
    startDate?: string;
    endDate?: string;
    slots?: number;
  }
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.forte !== undefined) payload.forte = updates.forte || null;
  if (updates.startDate !== undefined) payload.start_date = updates.startDate;
  if (updates.endDate !== undefined) payload.end_date = updates.endDate;
  if (updates.slots !== undefined) payload.slots = updates.slots;
  const { error } = await supabase.from('opportunities').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteOpportunity(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('opportunities').delete().eq('id', id);
  if (error) throw error;
}

export async function getOpportunityQuestions(opportunityId: string): Promise<DbOpportunityQuestion[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('opportunity_questions')
    .select('*')
    .eq('opportunity_id', opportunityId)
    .order('sort_order');
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    opportunityId: r.opportunity_id as string,
    question: r.question as string,
    type: r.type as DbOpportunityQuestion['type'],
    required: r.required as boolean,
    options: (r.options as string[]) || undefined,
    sortOrder: r.sort_order as number,
  }));
}

export async function createOpportunityQuestion(data: {
  opportunityId: string;
  question: string;
  type?: string;
  required?: boolean;
  options?: string[];
  sortOrder?: number;
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('opportunity_questions').insert({
    opportunity_id: data.opportunityId,
    question: data.question,
    type: data.type ?? 'text',
    required: data.required ?? true,
    options: data.options ?? null,
    sort_order: data.sortOrder ?? 0,
  });
  if (error) throw error;
}

export async function deleteOpportunityQuestion(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('opportunity_questions').delete().eq('id', id);
  if (error) throw error;
}

// ─── Notifications (Phase D.6) ────────────────────────────────────

export interface DbNotification {
  id: string;
  recipientId: string;
  eventType: string;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface DbNotificationPreference {
  userId: string;
  emailEnabled: boolean;
  applicationNotifications: boolean;
  interviewNotifications: boolean;
  trainingNotifications: boolean;
  projectNotifications: boolean;
  certificateNotifications: boolean;
}

export interface DbEmailLog {
  id: string;
  recipientId?: string;
  recipientEmail: string;
  eventType: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  providerMessageId?: string;
  failureReason?: string;
  retryCount: number;
  sentAt?: string;
  createdAt: string;
}

export interface DbNotificationTemplate {
  id: string;
  eventType: string;
  subject: string;
  emailBody: string;
  inAppTemplate: string;
}

// ─── Notifications ────────────────────────────────────────────────

export async function createNotification(data: {
  recipientId: string;
  eventType: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('notifications').insert({
    recipient_id: data.recipientId,
    event_type: data.eventType,
    title: data.title,
    message: data.message,
    metadata: data.metadata ?? {},
  });
  if (error) throw error;
}

export async function getNotifications(
  recipientId: string,
  limit = 20,
  offset = 0
): Promise<DbNotification[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', recipientId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    recipientId: r.recipient_id as string,
    eventType: r.event_type as string,
    title: r.title as string,
    message: r.message as string,
    metadata: (r.metadata as Record<string, unknown>) || {},
    isRead: r.is_read as boolean,
    createdAt: r.created_at as string,
  }));
}

export async function getUnreadNotificationsCount(recipientId: string): Promise<number> {
  const supabase = requireSupabase();
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', recipientId)
    .eq('is_read', false);
  return count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead(recipientId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', recipientId)
    .eq('is_read', false);
  if (error) throw error;
}

// ─── Notification Preferences ─────────────────────────────────────

export async function getNotificationPreferences(
  userId: string
): Promise<DbNotificationPreference | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (!data) return null;
  return {
    userId: data.user_id,
    emailEnabled: data.email_enabled,
    applicationNotifications: data.application_notifications,
    interviewNotifications: data.interview_notifications,
    trainingNotifications: data.training_notifications,
    projectNotifications: data.project_notifications,
    certificateNotifications: data.certificate_notifications,
  };
}

export async function upsertNotificationPreferences(
  userId: string,
  prefs: Partial<Omit<DbNotificationPreference, 'userId'>>
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = { user_id: userId };
  if (prefs.emailEnabled !== undefined) payload.email_enabled = prefs.emailEnabled;
  if (prefs.applicationNotifications !== undefined) payload.application_notifications = prefs.applicationNotifications;
  if (prefs.interviewNotifications !== undefined) payload.interview_notifications = prefs.interviewNotifications;
  if (prefs.trainingNotifications !== undefined) payload.training_notifications = prefs.trainingNotifications;
  if (prefs.projectNotifications !== undefined) payload.project_notifications = prefs.projectNotifications;
  if (prefs.certificateNotifications !== undefined) payload.certificate_notifications = prefs.certificateNotifications;
  const { error } = await supabase
    .from('notification_preferences')
    .upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
}

// ─── Email Logs ───────────────────────────────────────────────────

export async function createEmailLog(data: {
  recipientEmail: string;
  eventType: string;
  subject: string;
  body: string;
  recipientId?: string;
}): Promise<string> {
  const supabase = requireSupabase();
  const { data: row, error } = await supabase
    .from('email_logs')
    .insert({
      recipient_id: data.recipientId ?? null,
      recipient_email: data.recipientEmail,
      event_type: data.eventType,
      subject: data.subject,
      body: data.body,
    })
    .select('id')
    .single();
  if (error) throw error;
  return row.id;
}

export async function updateEmailLogStatus(
  id: string,
  status: DbEmailLog['status'],
  details?: { providerMessageId?: string; failureReason?: string }
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = { status };
  if (details?.providerMessageId) payload.provider_message_id = details.providerMessageId;
  if (details?.failureReason) payload.failure_reason = details.failureReason;
  if (status === 'sent') payload.sent_at = new Date().toISOString();
  const { error } = await supabase.from('email_logs').update(payload).eq('id', id);
  if (error) throw error;
}

export async function getEmailLogs(options?: {
  limit?: number;
  status?: string;
}): Promise<DbEmailLog[]> {
  const supabase = requireSupabase();
  let query = supabase.from('email_logs').select('*').order('created_at', { ascending: false });
  if (options?.status) query = query.eq('status', options.status);
  if (options?.limit) query = query.limit(options.limit);
  const { data } = await query;
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    recipientId: r.recipient_id as string | undefined,
    recipientEmail: r.recipient_email as string,
    eventType: r.event_type as string,
    subject: r.subject as string,
    body: r.body as string,
    status: r.status as DbEmailLog['status'],
    providerMessageId: r.provider_message_id as string | undefined,
    failureReason: r.failure_reason as string | undefined,
    retryCount: r.retry_count as number,
    sentAt: r.sent_at as string | undefined,
    createdAt: r.created_at as string,
  }));
}

export async function getEmailLogsSummary(): Promise<{
  total: number;
  sent: number;
  failed: number;
  pending: number;
}> {
  const supabase = requireSupabase();
  const { data } = await supabase.rpc('get_email_logs_summary');
  if (data) return data as { total: number; sent: number; failed: number; pending: number };
  return { total: 0, sent: 0, failed: 0, pending: 0 };
}

// ─── Notification Templates ───────────────────────────────────────

export async function getNotificationTemplate(
  eventType: string
): Promise<DbNotificationTemplate | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('event_type', eventType)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    eventType: data.event_type,
    subject: data.subject,
    emailBody: data.email_body,
    inAppTemplate: data.in_app_template,
  };
}

export async function getAllNotificationTemplates(): Promise<DbNotificationTemplate[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('notification_templates')
    .select('*')
    .order('event_type');
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    eventType: r.event_type as string,
    subject: r.subject as string,
    emailBody: r.email_body as string,
    inAppTemplate: r.in_app_template as string,
  }));
}

export async function upsertNotificationTemplate(
  data: { eventType: string; subject: string; emailBody: string; inAppTemplate: string }
): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('notification_templates').upsert({
    event_type: data.eventType,
    subject: data.subject,
    email_body: data.emailBody,
    in_app_template: data.inAppTemplate,
  }, { onConflict: 'event_type' });
  if (error) throw error;
}

export async function getNotificationsByEventType(
  eventType: string
): Promise<{ count: number }> {
  const supabase = requireSupabase();
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', eventType);
  return { count: count ?? 0 };
}

export async function getNotificationsSummary(): Promise<{
  total: number;
  unread: number;
  byEvent: Record<string, number>;
}> {
  const supabase = requireSupabase();
  const { data: totalData } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true });
  const { data: unreadData } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
  const total = totalData?.length ?? 0;
  const unread = unreadData?.length ?? 0;
  const byEvent: Record<string, number> = {};
  const { data: eventData } = await supabase
    .from('notifications')
    .select('event_type');
  if (eventData) {
    for (const r of eventData) {
      const et = (r as Record<string, unknown>).event_type as string;
      byEvent[et] = (byEvent[et] || 0) + 1;
    }
  }
  return { total, unread, byEvent };
}

// ─── Leaderboard ──────────────────────────────────────────────────

export interface LeaderboardEntry {
  userId: string;
  name: string;
  level: number;
  xp: number;
  completedLessons: number;
  completedChallenges: number;
  passedQuizzes: number;
  assessmentScore: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = requireSupabase();
  const { data } = await supabase.rpc('get_leaderboard');
  return (data || []).map((r: Record<string, unknown>) => ({
    userId: r.user_id as string,
    name: r.name as string,
    level: r.level as number,
    xp: r.xp as number,
    completedLessons: Number(r.completed_lessons),
    completedChallenges: Number(r.completed_challenges),
    passedQuizzes: Number(r.passed_quizzes),
    assessmentScore: Number(r.assessment_score),
  }));
}

// ─── Training Certificates (Phase D.8) ────────────────────────────

export interface DbTrainingCertificate {
  id: string;
  userId: string;
  userName?: string;
  opportunityId?: string;
  certificateNumber: string;
  issuedAt: string;
  generatedPdfUrl?: string;
  status: 'issued' | 'revoked';
}

export async function getTrainingCertificates(userId: string): Promise<DbTrainingCertificate[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('training_certificates')
    .select('*')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    userId: r.user_id as string,
    opportunityId: r.opportunity_id as string | undefined,
    certificateNumber: r.certificate_number as string,
    issuedAt: r.issued_at as string,
    generatedPdfUrl: r.generated_pdf_url as string | undefined,
    status: r.status as 'issued' | 'revoked',
  }));
}

export async function getAllTrainingCertificates(): Promise<DbTrainingCertificate[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('training_certificates')
    .select('*, users!inner(name, email)')
    .order('issued_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    userId: r.user_id as string,
    userName: (r.users as Record<string, unknown> | undefined)?.name as string | undefined,
    opportunityId: r.opportunity_id as string | undefined,
    certificateNumber: r.certificate_number as string,
    issuedAt: r.issued_at as string,
    generatedPdfUrl: r.generated_pdf_url as string | undefined,
    status: r.status as 'issued' | 'revoked',
  }));
}

export async function issueTrainingCertificate(data: {
  userId: string;
  opportunityId?: string;
}): Promise<string> {
  const supabase = requireSupabase();
  const certNumber = `TR-${Date.now()}-${data.userId.slice(0, 8)}`;
  const { error } = await supabase.from('training_certificates').insert({
    user_id: data.userId,
    opportunity_id: data.opportunityId ?? null,
    certificate_number: certNumber,
  });
  if (error) throw error;
  return certNumber;
}

// ─── Internship Certificates (Phase D.8) ──────────────────────────

export interface DbInternshipCertificate {
  id: string;
  userId: string;
  userName?: string;
  opportunityId?: string;
  projectId?: string;
  mentorId?: string;
  certificateNumber: string;
  issuedAt: string;
  generatedPdfUrl?: string;
  status: 'issued' | 'revoked';
}

export async function getInternshipCertificates(userId: string): Promise<DbInternshipCertificate[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('internship_certificates')
    .select('*')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    userId: r.user_id as string,
    opportunityId: r.opportunity_id as string | undefined,
    projectId: r.project_id as string | undefined,
    mentorId: r.mentor_id as string | undefined,
    certificateNumber: r.certificate_number as string,
    issuedAt: r.issued_at as string,
    generatedPdfUrl: r.generated_pdf_url as string | undefined,
    status: r.status as 'issued' | 'revoked',
  }));
}

export async function getAllInternshipCertificates(): Promise<DbInternshipCertificate[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('internship_certificates')
    .select('*, users!inner(name, email)')
    .order('issued_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    userId: r.user_id as string,
    userName: (r.users as Record<string, unknown> | undefined)?.name as string | undefined,
    opportunityId: r.opportunity_id as string | undefined,
    projectId: r.project_id as string | undefined,
    mentorId: r.mentor_id as string | undefined,
    certificateNumber: r.certificate_number as string,
    issuedAt: r.issued_at as string,
    generatedPdfUrl: r.generated_pdf_url as string | undefined,
    status: r.status as 'issued' | 'revoked',
  }));
}

export async function issueInternshipCertificate(data: {
  userId: string;
  opportunityId?: string;
  projectId?: string;
  mentorId?: string;
}): Promise<string> {
  const supabase = requireSupabase();
  const certNumber = `IN-${Date.now()}-${data.userId.slice(0, 8)}`;
  const { error } = await supabase.from('internship_certificates').insert({
    user_id: data.userId,
    opportunity_id: data.opportunityId ?? null,
    project_id: data.projectId ?? null,
    mentor_id: data.mentorId ?? null,
    certificate_number: certNumber,
  });
  if (error) throw error;
  return certNumber;
}

// ─── Internship Outcomes (Phase D.8) ──────────────────────────────

export interface DbInternshipOutcome {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  opportunityId?: string;
  trainingCompleted: boolean;
  readinessScore?: number;
  projectCompleted: boolean;
  mentorApproved: boolean;
  internshipCompleted: boolean;
  completedAt?: string;
  mentorNotes?: string;
  finalRating?: number;
}

export async function getInternshipOutcome(userId: string, opportunityId?: string): Promise<DbInternshipOutcome | null> {
  const supabase = requireSupabase();
  let query = supabase.from('internship_outcomes').select('*').eq('user_id', userId);
  if (opportunityId) query = query.eq('opportunity_id', opportunityId);
  const { data } = await query.maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    opportunityId: data.opportunity_id,
    trainingCompleted: data.training_completed,
    readinessScore: data.readiness_score,
    projectCompleted: data.project_completed,
    mentorApproved: data.mentor_approved,
    internshipCompleted: data.internship_completed,
    completedAt: data.completed_at,
    mentorNotes: data.mentor_notes,
    finalRating: data.final_rating,
  };
}

export async function upsertInternshipOutcome(
  userId: string,
  data: Partial<{
    opportunityId: string;
    trainingCompleted: boolean;
    readinessScore: number;
    projectCompleted: boolean;
    mentorApproved: boolean;
    internshipCompleted: boolean;
    completedAt: string;
    mentorNotes: string;
    finalRating: number;
  }>
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = { user_id: userId };
  if (data.opportunityId !== undefined) payload.opportunity_id = data.opportunityId;
  if (data.trainingCompleted !== undefined) payload.training_completed = data.trainingCompleted;
  if (data.readinessScore !== undefined) payload.readiness_score = data.readinessScore;
  if (data.projectCompleted !== undefined) payload.project_completed = data.projectCompleted;
  if (data.mentorApproved !== undefined) payload.mentor_approved = data.mentorApproved;
  if (data.internshipCompleted !== undefined) payload.internship_completed = data.internshipCompleted;
  if (data.completedAt !== undefined) payload.completed_at = data.completedAt;
  if (data.mentorNotes !== undefined) payload.mentor_notes = data.mentorNotes;
  if (data.finalRating !== undefined) payload.final_rating = data.finalRating;
  const { error } = await supabase.from('internship_outcomes').upsert(payload, { onConflict: '(user_id, opportunity_id)' });
  if (error) throw error;
}

export async function getAllInternshipOutcomes(): Promise<DbInternshipOutcome[]> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('internship_outcomes')
    .select('*, users!inner(name, email)')
    .order('completed_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    userId: r.user_id as string,
    userName: (r.users as Record<string, unknown> | undefined)?.name as string | undefined,
    userEmail: (r.users as Record<string, unknown> | undefined)?.email as string | undefined,
    opportunityId: r.opportunity_id as string | undefined,
    trainingCompleted: r.training_completed as boolean,
    readinessScore: r.readiness_score as number | undefined,
    projectCompleted: r.project_completed as boolean,
    mentorApproved: r.mentor_approved as boolean,
    internshipCompleted: r.internship_completed as boolean,
    completedAt: r.completed_at as string | undefined,
    mentorNotes: r.mentor_notes as string | undefined,
    finalRating: r.final_rating as number | undefined,
  }));
}

// ─── Project Allocation Extended (Phase D.8) ──────────────────────

export interface DbProjectAllocationExtended extends DbProjectAllocation {
  outcome?: 'successful' | 'partially_successful' | 'unsuccessful';
  mentorNotes?: string;
  lessonsLearned?: string;
  skillsDemonstrated?: string[];
  completedDate?: string;
  mentorApproved?: boolean;
}

export async function getProjectAllocationExtended(id: string): Promise<DbProjectAllocationExtended | null> {
  const supabase = requireSupabase();
  const { data } = await supabase.from('project_allocations').select('*').eq('id', id).single();
  if (!data) return null;
  return {
    id: data.id,
    internId: data.intern_id,
    projectName: data.project_name,
    clientName: data.client_name,
    role: data.role,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
    outcome: data.outcome,
    mentorNotes: data.mentor_notes,
    lessonsLearned: data.lessons_learned,
    skillsDemonstrated: data.skills_demonstrated || [],
    completedDate: data.completed_date,
    mentorApproved: data.mentor_approved,
  };
}

export async function updateProjectAllocationExtended(
  id: string,
  updates: Partial<Omit<DbProjectAllocationExtended, 'id' | 'internId' | 'projectName' | 'clientName' | 'role' | 'startDate'>>
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = {};
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.endDate !== undefined) payload.end_date = updates.endDate;
  if (updates.outcome !== undefined) payload.outcome = updates.outcome;
  if (updates.mentorNotes !== undefined) payload.mentor_notes = updates.mentorNotes;
  if (updates.lessonsLearned !== undefined) payload.lessons_learned = updates.lessonsLearned;
  if (updates.skillsDemonstrated !== undefined) payload.skills_demonstrated = updates.skillsDemonstrated;
  if (updates.completedDate !== undefined) payload.completed_date = updates.completedDate;
  if (updates.mentorApproved !== undefined) payload.mentor_approved = updates.mentorApproved;
  const { error } = await supabase.from('project_allocations').update(payload).eq('id', id);
  if (error) throw error;
}

// ─── Mentor Assignment Completion (Phase D.8) ─────────────────────

export async function updateMentorAssignmentCompletion(
  internId: string,
  updates: {
    completionStatus?: 'pending' | 'approved' | 'additional_work' | 'rejected';
    completionReviewNotes?: string;
  }
): Promise<void> {
  const supabase = requireSupabase();
  const payload: Record<string, unknown> = {
    completion_reviewed_at: new Date().toISOString(),
  };
  if (updates.completionStatus) payload.completion_status = updates.completionStatus;
  if (updates.completionReviewNotes !== undefined) payload.completion_review_notes = updates.completionReviewNotes;
  const { error } = await supabase.from('mentor_assignments').update(payload).eq('intern_id', internId);
  if (error) throw error;
}

// ─── Completion Stats (Phase D.8.9) ───────────────────────────────

export async function getCompletionStats(): Promise<{
  totalApplications: number;
  totalInterviews: number;
  totalAccepted: number;
  trainingCompleted: number;
  readinessApproved: number;
  projectsAssigned: number;
  projectsCompleted: number;
  trainingCertificatesIssued: number;
  internshipCertificatesIssued: number;
  trainingCompletionRate: number;
  readinessPassRate: number;
  projectCompletionRate: number;
  avgReadinessScore: number;
}> {
  const supabase = requireSupabase();
  const { count: totalApps } = await supabase.from('applications').select('*', { count: 'exact', head: true });
  const { count: totalInterviews } = await supabase.from('interviews').select('*', { count: 'exact', head: true });
  const { count: totalAccepted } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'accepted');
  const { count: trainingCert } = await supabase.from('training_certificates').select('*', { count: 'exact', head: true });
  const { count: internshipCert } = await supabase.from('internship_certificates').select('*', { count: 'exact', head: true });
  const { count: outcomesTrainingDone } = await supabase.from('internship_outcomes').select('*', { count: 'exact', head: true }).eq('training_completed', true);
  const { count: projectsAssigned } = await supabase.from('project_allocations').select('*', { count: 'exact', head: true });
  const { count: projectsCompleted } = await supabase.from('project_allocations').select('*', { count: 'exact', head: true }).eq('status', 'completed');
  const { data: readinessData } = await supabase.from('readiness_evaluations').select('overall_readiness');
  const avgReadiness = readinessData && readinessData.length > 0
    ? Math.round(readinessData.reduce((s: number, r: Record<string, unknown>) => s + Number(r.overall_readiness), 0) / readinessData.length * 10)
    : 0;
  const accepted = totalAccepted ?? 0;
  return {
    totalApplications: totalApps ?? 0,
    totalInterviews: totalInterviews ?? 0,
    totalAccepted: accepted,
    trainingCompleted: outcomesTrainingDone ?? 0,
    readinessApproved: outcomesTrainingDone ?? 0,
    projectsAssigned: projectsAssigned ?? 0,
    projectsCompleted: projectsCompleted ?? 0,
    trainingCertificatesIssued: trainingCert ?? 0,
    internshipCertificatesIssued: internshipCert ?? 0,
    trainingCompletionRate: accepted > 0 ? Math.round(((outcomesTrainingDone ?? 0) / accepted) * 100) : 0,
    readinessPassRate: accepted > 0 ? Math.round(((outcomesTrainingDone ?? 0) / accepted) * 100) : 0,
    projectCompletionRate: (projectsAssigned ?? 0) > 0 ? Math.round(((projectsCompleted ?? 0) / (projectsAssigned ?? 0)) * 100) : 0,
    avgReadinessScore: avgReadiness,
  };
}

// ─── Training Tracks (Phase D.9) ──────────────────────────────────
// Schema has existed since migration 019 (training_tracks, track_fortes,
// intern_track_assignments) but nothing in the app read or wrote it until
// now -- Onboarding.tsx just showed a generic hardcoded "Foundation Track"
// line regardless of what, if anything, an intern was assigned.

export interface DbTrainingTrack {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  fortes: OpportunityForte[];
}

export async function getTrainingTracks(): Promise<DbTrainingTrack[]> {
  const supabase = requireSupabase();
  const [{ data: tracks }, { data: fortes }] = await Promise.all([
    supabase.from('training_tracks').select('*').order('sort_order', { ascending: true }),
    supabase.from('track_fortes').select('*'),
  ]);
  const forteMap = new Map<string, OpportunityForte[]>();
  for (const f of (fortes || []) as { track_id: string; forte: OpportunityForte }[]) {
    const arr = forteMap.get(f.track_id) || [];
    arr.push(f.forte);
    forteMap.set(f.track_id, arr);
  }
  return ((tracks || []) as Record<string, unknown>[]).map(t => ({
    id: t.id as string,
    name: t.name as string,
    description: t.description as string | undefined,
    sortOrder: t.sort_order as number,
    fortes: forteMap.get(t.id as string) || [],
  }));
}

export async function createTrainingTrack(data: {
  name: string;
  description?: string;
  sortOrder?: number;
  fortes: OpportunityForte[];
}): Promise<string> {
  const supabase = requireSupabase();
  const { data: inserted, error } = await supabase
    .from('training_tracks')
    .insert({ name: data.name, description: data.description ?? null, sort_order: data.sortOrder ?? 0 })
    .select()
    .single();
  if (error) throw error;
  if (data.fortes.length > 0) {
    const { error: forteError } = await supabase
      .from('track_fortes')
      .insert(data.fortes.map(forte => ({ track_id: inserted.id, forte })));
    if (forteError) throw forteError;
  }
  return inserted.id;
}

export async function deleteTrainingTrack(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from('training_tracks').delete().eq('id', id);
  if (error) throw error;
}

export interface DbInternTrackAssignment {
  internId: string;
  trackId?: string;
  trackName?: string;
  trainingDeadline?: string;
  assignedAt: string;
}

export async function getInternTrackAssignment(internId: string): Promise<DbInternTrackAssignment | null> {
  const supabase = requireSupabase();
  const { data } = await supabase
    .from('intern_track_assignments')
    .select('*, training_tracks(name)')
    .eq('intern_id', internId)
    .maybeSingle();
  if (!data) return null;
  const trackName = (data as { training_tracks?: { name?: string } }).training_tracks?.name;
  return {
    internId: data.intern_id,
    trackId: data.track_id ?? undefined,
    trackName: trackName ?? undefined,
    trainingDeadline: data.training_deadline ?? undefined,
    assignedAt: data.assigned_at,
  };
}

export async function assignInternTrack(internId: string, trackId: string | null): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from('intern_track_assignments')
    .upsert({ intern_id: internId, track_id: trackId }, { onConflict: 'intern_id' });
  if (error) throw error;
}
