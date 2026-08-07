import type { UserRole } from '../types';

// App Flow doc, "Redirects": after login, send to Dashboard (Intern/Mentor/
// Admin) or Applicant Dashboard, depending on role.
export function roleHomePath(role: UserRole | undefined): string {
  switch (role) {
    case 'applicant':
      return '/applicant';
    case 'mentor':
      return '/mentor';
    case 'admin':
      return '/admin/applications';
    case 'intern':
      return '/training';
    default:
      return '/profile';
  }
}
