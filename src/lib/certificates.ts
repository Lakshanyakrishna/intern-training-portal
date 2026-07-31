import { issueTrainingCertificate, issueInternshipCertificate, upsertInternshipOutcome, getUser } from './db';
import { notifyEvent } from './notifications';

export async function generateTrainingCertificate(
  userId: string,
  opportunityId?: string,
  opportunityName?: string
): Promise<string> {
  const certNumber = await issueTrainingCertificate({ userId, opportunityId });
  const user = await getUser(userId);
  const name = user?.name || 'Intern';
  notifyEvent('certificate_issued', userId, {
    name,
    certificate_type: 'Training',
    opportunity: opportunityName || 'the program',
  }).catch(() => {});
  await upsertInternshipOutcome(userId, {
    opportunityId,
    trainingCompleted: true,
  });
  return certNumber;
}

export async function generateInternshipCertificate(
  userId: string,
  opportunityId?: string,
  projectId?: string,
  mentorId?: string,
  opportunityName?: string,
  projectName?: string
): Promise<string> {
  const certNumber = await issueInternshipCertificate({
    userId,
    opportunityId,
    projectId,
    mentorId,
  });
  const user = await getUser(userId);
  const name = user?.name || 'Intern';
  notifyEvent('certificate_issued', userId, {
    name,
    certificate_type: 'Internship',
    opportunity: opportunityName || 'the program',
    project_name: projectName || '',
  }).catch(() => {});
  await upsertInternshipOutcome(userId, {
    opportunityId,
    projectCompleted: true,
    internshipCompleted: true,
    completedAt: new Date().toISOString(),
  });
  return certNumber;
}
