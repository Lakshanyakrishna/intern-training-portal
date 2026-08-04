import { useProgress } from '../hooks/useProgress';
import { debugScenarios } from '../data/debugScenarios';
import DebugSimulatorComponent from '../components/DebugSimulator';

export default function DebugSimulatorPage() {
  const { progress, completeDebugScenario } = useProgress();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Debugging Simulator</h1>
          <p className="text-sm text-secondary">Practice debugging real-world issues in a safe environment.</p>
        </div>
      </div>
      <DebugSimulatorComponent
        scenarios={debugScenarios}
        completedScenarios={progress.completedDebugScenarios}
        onComplete={(id, xp) => completeDebugScenario(id, xp)}
      />
    </div>
  );
}
