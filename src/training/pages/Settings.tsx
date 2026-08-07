import { Link } from 'react-router-dom';
import { ArrowRight, Bell, User } from '../../components/Icons';

export default function TrainingSettings() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-secondary mt-1">Manage your account and notification preferences.</p>
      </div>

      <div className="bg-surface border border-line rounded-xl divide-y divide-line">
        <Link to="/profile" className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-surface-alt transition-colors">
          <span className="flex items-center gap-3 text-sm text-primary">
            <User className="w-4 h-4 text-secondary" />
            Profile
          </span>
          <ArrowRight className="w-4 h-4 text-secondary" />
        </Link>
        <Link to="/notifications/settings" className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-surface-alt transition-colors">
          <span className="flex items-center gap-3 text-sm text-primary">
            <Bell className="w-4 h-4 text-secondary" />
            Notification Settings
          </span>
          <ArrowRight className="w-4 h-4 text-secondary" />
        </Link>
      </div>
    </div>
  );
}
