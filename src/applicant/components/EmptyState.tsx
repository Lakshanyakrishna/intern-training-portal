import type { ReactNode } from 'react';

// Generic, reusable empty state -- every "nothing here yet" moment in the
// applicant experience (no opportunities, no interview, no updates, no
// notifications, no activity) renders through this one component so the
// tone stays consistent instead of each screen inventing its own.
export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      <div className="w-11 h-11 rounded-full bg-surface-alt flex items-center justify-center mb-4 text-secondary">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-secondary max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
