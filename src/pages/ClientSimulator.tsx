import { clientProjectDays } from '../data/clientProjects';
import ClientSimDay from '../components/ClientSimDay';
import { useProgress } from '../hooks/useProgress';

export default function ClientSimulator() {
  const { progress, advanceClientProject } = useProgress();
  const allComplete = clientProjectDays.every(d => progress.clientProjectProgress.includes(d.id));

  if (allComplete) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-primary">Client Project Complete!</h1>
          <p className="text-secondary mt-2 max-w-md mx-auto">
            You successfully navigated all 7 days of the client project simulation.
            You've demonstrated real-world engineering and communication skills.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Client Project Simulator</h1>
        <p className="text-sm text-secondary mt-1">
          Navigate real-world client scenarios. Each day presents a new challenge. Choose wisely.
        </p>
      </div>

      <ClientSimDay
        days={clientProjectDays}
        completedDays={progress.clientProjectProgress}
        onAdvance={(dayId) => advanceClientProject(dayId)}
      />
    </div>
  );
}
