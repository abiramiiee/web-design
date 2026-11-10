import React, { useState } from 'react';
import {
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Goal } from '../../types';

export const DreamDependencyMap: React.FC = () => {
  const { goals, openAiModal, setCurrentView } = useData();

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(goals[0]?.id || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || goals[0] || null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-left">
      
      {/* Banner */}
      <div className="clay-card p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold mb-2">
            <span>🗺️ Visual Logic Architecture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Dream Dependency Map
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            See how your dreams interconnect. Foundational skills unlock advanced ventures, illustrating clear causality between today's small habits and tomorrow's grand milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Graph + Node Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Node Graph Visualizer (8 cols) */}
        <div className="lg:col-span-8">
          <div className="clay-card p-6 rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/20 to-blue-50/20 dark:from-slate-950 dark:to-slate-900 border border-purple-100 dark:border-purple-950 min-h-[520px] relative overflow-hidden clay-inset">
            
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3 text-xs text-gray-500 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Done
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> Planned
              </span>
            </div>

            {/* Scaled Flow Container */}
            <div
              className="w-full h-full flex flex-col justify-around py-12 px-4 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
            >
              {/* Stage 1: Foundations */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                  Stage 1: Foundational Pillars
                </span>
                <div className="flex flex-wrap gap-4">
                  {goals
                    .filter((g) => g.dependencies.length === 0)
                    .map((goal) => {
                      const isSelected = selectedGoalId === goal.id;
                      return (
                        <div
                          key={goal.id}
                          onClick={() => setSelectedGoalId(goal.id)}
                          className={`p-4 rounded-3xl clay-card cursor-pointer transition-all w-72 space-y-2 select-none border-2 ${
                            isSelected
                              ? 'border-purple-500 shadow-xl scale-105 bg-white dark:bg-slate-800'
                              : 'border-transparent bg-white/90 dark:bg-slate-900/90 hover:scale-102'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                              {goal.category}
                            </span>
                            <span className="text-xs font-extrabold text-purple-600">
                              {goal.progress}%
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1">
                            {goal.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 line-clamp-2">
                            {goal.description}
                          </p>
                          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-gray-400">
                            <span>{goal.milestones.length} Milestones</span>
                            <span className="text-pink-500 font-bold">Inspect Node →</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Connecting Connector Indicator */}
              <div className="py-4 pl-12 flex items-center gap-2 text-xs font-bold text-purple-400">
                <div className="w-0.5 h-8 bg-purple-300 dark:bg-purple-700" />
                <span>Prerequisites Flow & Unlocks</span>
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Stage 2: Advanced Venturing */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                  Stage 2: Advanced Dependent Ventures
                </span>
                <div className="flex flex-wrap gap-4">
                  {goals
                    .filter((g) => g.dependencies.length > 0)
                    .map((goal) => {
                      const isSelected = selectedGoalId === goal.id;
                      return (
                        <div
                          key={goal.id}
                          onClick={() => setSelectedGoalId(goal.id)}
                          className={`p-4 rounded-3xl clay-card cursor-pointer transition-all w-72 space-y-2 select-none border-2 ${
                            isSelected
                              ? 'border-purple-500 shadow-xl scale-105 bg-white dark:bg-slate-800'
                              : 'border-transparent bg-white/90 dark:bg-slate-900/90 hover:scale-102'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                              {goal.category}
                            </span>
                            <span className="text-xs font-extrabold text-teal-600">
                              {goal.progress}%
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1">
                            {goal.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 line-clamp-2">
                            {goal.description}
                          </p>
                          <div className="text-[10px] text-purple-600 font-bold flex items-center gap-1">
                            <span>Requires:</span>
                            <span className="truncate">Stage 1 Mastery</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right Details Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedGoal ? (
            <div className="clay-card p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200">
                  {selectedGoal.category}
                </span>
                <span className="text-xs text-gray-400">Target: {selectedGoal.targetDate}</span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-1">
                  {selectedGoal.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedGoal.description}
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-500">Progress</span>
                  <span className="font-extrabold text-purple-600">{selectedGoal.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full"
                    style={{ width: `${selectedGoal.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones in this node */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Milestone Sequence
                </h4>
                <div className="space-y-1.5">
                  {selectedGoal.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                        m.completed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-gray-600 dark:text-gray-300'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">{idx + 1}.</span>
                        <span className={m.completed ? 'line-through text-gray-400' : 'font-semibold'}>
                          {m.title}
                        </span>
                      </div>
                      {m.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => openAiModal(`Generate alternate path for ${selectedGoal.title}`)}
                  className="clay-button-secondary py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Alternate Route Explorer</span>
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="clay-button-primary py-2 text-xs font-bold"
                >
                  View on Dashboard
                </button>
              </div>

            </div>
          ) : (
            <div className="clay-card p-6 text-center text-xs text-gray-400">
              Select a goal node to inspect its dependencies and milestones.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
