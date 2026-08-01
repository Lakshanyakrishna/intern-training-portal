import { useState } from 'react';
import type { DebugScenario } from '../types';

interface DebugSimulatorProps {
  scenarios: DebugScenario[];
  completedScenarios: string[];
  onComplete: (scenarioId: string, xp: number) => void;
}

export default function DebugSimulator({ scenarios, completedScenarios, onComplete }: DebugSimulatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const activeScenarios = scenarios.filter(s => !completedScenarios.includes(s.id));
  const scenario = activeScenarios[currentIndex] ?? null;

  if (!scenario) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-line text-center">
        <p className="text-green-600 dark:text-green-400 font-medium">All scenarios completed!</p>
      </div>
    );
  }

  const completedCount = completedScenarios.length;
  const totalCount = scenarios.length;

  const handleAction = (actionId: string) => {
    setSelectedAction(actionId);
    setShowResult(true);
    if (actionId === scenario.correctActionId) {
      onComplete(scenario.id, scenario.xpReward);
    }
  };

  const handleNext = () => {
    setSelectedAction(null);
    setShowResult(false);
    setCurrentIndex(i => i + 1);
  };

  const isCorrect = selectedAction === scenario.correctActionId;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-secondary">
        <span className="font-medium">{scenario.title}</span>
        <span>{completedCount}/{totalCount} scenarios</span>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
        <p className="text-xs font-semibold text-accent mb-1">Client Report</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{scenario.clientReport}</p>
      </div>

      <div className="bg-surface-alt rounded-xl p-4">
        <p className="text-xs font-semibold text-secondary mb-1">Context</p>
        <p className="text-sm text-secondary">{scenario.context}</p>
      </div>

      {!showResult ? (
        <div className="grid gap-2">
          {scenario.actions.map(action => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="text-left p-3 rounded-xl border border-line bg-surface hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            >
              <span className="text-sm font-medium text-primary">{action.label}</span>
              <p className="text-xs text-secondary mt-0.5">{action.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-xl p-4 border ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <p className={`text-sm font-medium mb-1 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite right'}
            </p>
            <p className="text-sm text-secondary">
              {scenario.actions.find(a => a.id === selectedAction)?.outcome}
            </p>
          </div>
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs font-semibold text-secondary mb-1">Explanation</p>
            <p className="text-sm text-secondary">{scenario.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Next Scenario
          </button>
        </div>
      )}
    </div>
  );
}
