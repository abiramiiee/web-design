import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Compass,
  RefreshCw,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const DreamDriftDetector: React.FC = () => {
  const { goals, driftData, analyzeGoalDrift } = useData();

  const [analyzingGoalId, setAnalyzingGoalId] = useState<string | null>(null);

  const handleRunAiAnalysis = async (goalId: string) => {
    setAnalyzingGoalId(goalId);
    await analyzeGoalDrift(goalId);
    setAnalyzingGoalId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-left">
      
      {/* Banner Card */}
      <div className="clay-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-50/80 via-orange-50/70 to-pink-50/70 dark:from-slate-900 dark:to-slate-800 border border-amber-200/80 dark:border-amber-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 text-xs font-bold mb-2">
            <span>⚡ Intelligent Trajectory Monitor</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Dream Drift Detector
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xl">
            Gentle, non-judgmental tracking. We compare planned schedule vs. real-life progress, identify subtle friction points, and generate kind, realistic catch-up strategies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-sm border border-amber-200 text-xs">
            <span className="text-gray-400 block font-bold">Monitored Goals</span>
            <span className="text-lg font-extrabold text-gray-800 dark:text-white">
              {goals.length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Goals Drift Analysis Cards */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const drift = driftData.find((d) => d.goalId === goal.id);
          const isAnalyzing = analyzingGoalId === goal.id;
          const plannedProgress = drift ? drift.plannedProgress : 70;
          const actualProgress = goal.progress;
          const diff = actualProgress - plannedProgress;
          const isAhead = diff >= 0;

          return (
            <div
              key={goal.id}
              className="clay-card p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-4 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {goal.category}
                    </span>
                    <span className="text-xs text-gray-400">Target Date: {goal.targetDate}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                    {goal.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 ${
                      isAhead
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : diff > -15
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {isAhead ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span>On Track (+{diff}%)</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-amber-600" />
                        <span>Drift Detected ({diff}%)</span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleRunAiAnalysis(goal.id)}
                    disabled={isAnalyzing}
                    className="clay-button-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-purple-600 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzing ? 'Analyzing...' : 'AI Re-Scan'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Dual Bar comparison: Planned vs Actual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Planned Pace */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-500">Scheduled Pace:</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{plannedProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-400 h-full rounded-full transition-all"
                      style={{ width: `${plannedProgress}%` }}
                    />
                  </div>
                </div>

                {/* Actual Pace */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-500">Actual Real-World Pace:</span>
                    <span className="font-bold text-purple-600">{actualProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${actualProgress}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Blockers & Catch-up Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                
                {/* Diagnosed Blockers */}
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800/50 border border-rose-100 dark:border-rose-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Identified Friction Points</span>
                  </div>
                  {drift && drift.diagnosedBlockers.length > 0 ? (
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                      {drift.diagnosedBlockers.map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No significant blockers detected! Pacing is smooth and healthy.</p>
                  )}
                </div>

                {/* Catch-Up Recommendations */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/50 border border-emerald-100 dark:border-emerald-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Gentle Action Plan</span>
                  </div>
                  {drift && drift.catchUpRecommendations.length > 0 ? (
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                      {drift.catchUpRecommendations.map((r, i) => (
                        <li key={i}>✓ {r}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Keep doing what you are doing. Remember to take rest days!</p>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
