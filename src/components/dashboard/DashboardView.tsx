import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  Compass,
  CheckCircle2,
  Circle,
  Trophy,
  Flame,
  Palette,
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sprout,
  GitBranch,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const {
    boards,
    goals,
    badges,
    memories,
    setCurrentView,
    setActiveBoardId,
    toggleMilestone,
    openAiModal,
  } = useData();
  const { openThemeStudio } = useTheme();
  const { mode } = useAccessibility();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Metrics
  const activeGoals = goals.filter((g) => g.status !== 'achieved');
  const completedGoals = goals.filter((g) => g.status === 'achieved');
  const totalMilestones = goals.reduce((acc, g) => acc + g.milestones.length, 0);
  const completedMilestones = goals.reduce(
    (acc, g) => acc + g.milestones.filter((m) => m.completed).length,
    0
  );
  const overallProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Upcoming milestones
  const upcomingMilestonesList = goals
    .flatMap((g) =>
      g.milestones
        .filter((m) => !m.completed)
        .map((m) => ({ ...m, goalId: g.id, goalTitle: g.title, category: g.category }))
    )
    .slice(0, 5);

  const dailyQuotes = [
    { text: "Every dream begins with a single bold visual. Keep sculpting.", author: "DreamBoard AI" },
    { text: "Small daily habits compound into monumental breakthroughs.", author: "James Clear" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  ];
  const todayQuote = dailyQuotes[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 text-left">
      
      {/* Welcome Banner Card */}
      <div className="clay-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-pink-100/70 via-purple-100/70 to-blue-100/70 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 border border-purple-200/60 dark:border-purple-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Day {user?.currentStreak || 14} Consistency Streak • Mode: {mode === 'simple' ? '🧸 Simple' : '⚡ Advanced'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'Dreamer'}! ✨
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">
              You are currently nurturing <strong className="text-pink-600 dark:text-pink-400">{activeGoals.length} active dreams</strong> with {overallProgress}% global milestone completion.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openAiModal()}
              className="clay-button-primary px-5 py-3 text-xs md:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Plan New Dream</span>
            </button>
            <button
              onClick={openThemeStudio}
              className="clay-button-secondary px-4 py-3 text-xs md:text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-pink-500" />
              <span>Theme Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="clay-card p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-purple-100/70 dark:border-purple-950 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Progress</span>
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center text-sm font-bold">
              🎯
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{overallProgress}%</span>
              <span className="text-xs text-gray-500">{completedMilestones}/{totalMilestones} Tasks</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="clay-card p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-purple-100/70 dark:border-purple-950 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Dream Boards</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center text-sm font-bold">
              🖼️
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{boards.length}</span>
            <p className="text-xs text-gray-500 mt-1">Interactive Visual Worlds</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="clay-card p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-purple-100/70 dark:border-purple-950 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Dream Streak</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-sm font-bold">
              🔥
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{user?.currentStreak || 14} Days</span>
            <p className="text-xs text-gray-500 mt-1">Consistent Habit Flow</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="clay-card p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-purple-100/70 dark:border-purple-950 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Dream Badges</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-sm font-bold">
              🏆
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
              {badges.filter((b) => b.unlocked).length} / {badges.length}
            </span>
            <p className="text-xs text-gray-500 mt-1">3D Clay Trophies Unlocked</p>
          </div>
        </div>

      </div>

      {/* Main Grid: My Dream Boards + Active Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Boards & Goals */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: My Dream Boards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  My Dream Boards
                </h2>
                <p className="text-xs text-gray-500">Visual tactile boards with cards, stickers, and snapshots</p>
              </div>
              <button
                onClick={() => setCurrentView('board-editor')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Boards ({boards.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => {
                    setActiveBoardId(board.id);
                    setCurrentView('board-editor');
                  }}
                  className="clay-card p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                  style={{ background: board.customBg || undefined }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm">
                        {board.category}
                      </span>
                      <span className="text-xs">Mood: <strong>{board.mood}</strong></span>
                    </div>
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">
                      {board.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {board.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span>{board.elements.length} Clay Items</span>
                    <span className="font-bold text-pink-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Open Canvas →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Active Goals & Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Active Dream Goals
                </h2>
                <p className="text-xs text-gray-500">Milestone breakdown and live progress</p>
              </div>
              <button
                onClick={() => openAiModal()}
                className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </div>

            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="clay-card p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {goal.category}
                        </span>
                        <span className="text-xs text-gray-400">• Target: {goal.targetDate}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {goal.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                          {goal.progress}%
                        </span>
                        <p className="text-[10px] text-gray-400">Completed</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>

                  {/* Milestones checklist inside goal */}
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Key Milestones ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {goal.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(goal.id, m.id)}
                          className={`p-2.5 rounded-2xl flex items-start gap-2.5 text-xs transition-all cursor-pointer border ${
                            m.completed
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-gray-500 line-through'
                              : 'bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          <div className="mt-0.5">
                            {m.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 shrink-0" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-semibold">{m.title}</p>
                            {m.estimatedHours && (
                              <span className="text-[10px] text-gray-400">~{m.estimatedHours} hrs</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer link to garden & dependencies */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {goal.gardenPlantType === 'bonsai' ? '🪴' : goal.gardenPlantType === 'rose' ? '🌹' : '🌻'}
                      </span>
                      <span className="text-gray-500">Plant Stage {goal.plantStage || 1}/4 in Garden</span>
                    </div>
                    <button
                      onClick={() => setCurrentView('dependencies')}
                      className="text-purple-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>View in Dependency Map</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Inspiration, Upcoming, Garden Preview */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Daily Inspiration Clay Widget */}
          <div className="clay-card p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 border border-amber-200/70 dark:border-amber-900/50 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>💡 Daily Vision Inspiration</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 italic leading-relaxed">
              "{todayQuote.text}"
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-amber-200/40">
              <span>— {todayQuote.author}</span>
              <button
                onClick={() => openAiModal()}
                className="text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Ask AI Insight →
              </button>
            </div>
          </div>

          {/* Upcoming Next Milestones */}
          <div className="clay-card p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>Next Priorities</span>
              </h3>
              <span className="text-xs text-gray-400">Click to complete</span>
            </div>

            <div className="space-y-2.5">
              {upcomingMilestonesList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(m.goalId, m.id)}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 hover:bg-purple-50/60 dark:hover:bg-purple-950/40 border border-gray-100 dark:border-gray-800 transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">
                      {m.title}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">{m.goalTitle}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0 group-hover:border-emerald-500 group-hover:bg-emerald-50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-transparent group-hover:text-emerald-600 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dream Garden Quick Teaser */}
          <div className="clay-card p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 border border-emerald-200 dark:border-emerald-900 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Dream Garden</span>
              </div>
              <span className="text-xs font-bold text-emerald-700">3 Plants Blooming</span>
            </div>
            <div className="flex items-center justify-around py-2">
              <div className="text-center">
                <span className="text-3xl block animate-bounce">🌻</span>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Sunflower</span>
              </div>
              <div className="text-center">
                <span className="text-3xl block animate-pulse">🪴</span>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Bonsai</span>
              </div>
              <div className="text-center">
                <span className="text-3xl block">🌷</span>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Tulip</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('garden')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Enter Full Dream Garden →
            </button>
          </div>

          {/* 3D Clay Trophy Room Shortcut */}
          <div className="clay-card p-6 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border border-purple-200 dark:border-purple-900 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Achievement Trophies</span>
              </div>
              <span className="text-xs font-bold text-purple-700">
                {badges.filter((b) => b.unlocked).length} Unlocked
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {badges.slice(0, 5).map((badge) => (
                <div
                  key={badge.id}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm shrink-0 ${
                    badge.unlocked ? 'bg-amber-100 border border-amber-300' : 'bg-gray-100 opacity-40'
                  }`}
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentView('achievements')}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Explore 3D Trophy Cabinet →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
