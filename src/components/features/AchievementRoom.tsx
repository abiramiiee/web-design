import React from 'react';
import {
  Award,
  Trophy,
  Flame,
  Sparkles,
  Lock,
  CheckCircle2,
  Crown,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const AchievementRoom: React.FC = () => {
  const { badges, unlockBadge } = useData();
  const { user } = useAuth();

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const level = Math.floor((user?.xpPoints || 1200) / 500) + 1;

  const handleInspectBadge = (badgeId: string, unlocked: boolean) => {
    if (!unlocked) {
      unlockBadge(badgeId);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FBBF24', '#F472B6', '#38BDF8'],
        });
      } catch {}
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-left">
      
      {/* Banner */}
      <div className="clay-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-50/80 via-yellow-50/70 to-pink-50/70 dark:from-slate-900 dark:to-slate-800 border border-amber-200/80 dark:border-amber-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 text-xs font-bold mb-2">
            <span>🏆 3D Clay Trophy Room</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Trophy Cabinet & Badges
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Each trophy is sculpted in tactile 3D clay, commemorating your milestones, consistency streaks, and creative courage.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-sm border border-amber-200 text-xs text-center">
            <span className="text-gray-400 block font-bold">Dreamer Level</span>
            <span className="text-xl font-extrabold text-purple-600 flex items-center justify-center gap-1">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Lvl {level}</span>
            </span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-sm border border-amber-200 text-xs text-center">
            <span className="text-gray-400 block font-bold">Total Dream XP</span>
            <span className="text-xl font-extrabold text-amber-600">
              {user?.xpPoints || 2450} XP
            </span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-sm border border-amber-200 text-xs text-center">
            <span className="text-gray-400 block font-bold">Trophies Earned</span>
            <span className="text-xl font-extrabold text-emerald-600">
              {unlockedCount} / {badges.length}
            </span>
          </div>
        </div>
      </div>

      {/* Trophy Pedestals Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {badges.map((b) => {
          return (
            <div
              key={b.id}
              onClick={() => handleInspectBadge(b.id, b.unlocked)}
              className={`clay-card p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer select-none border ${
                b.unlocked
                  ? 'bg-white/95 dark:bg-slate-900/95 border-amber-200/80 dark:border-amber-900/60 hover:-translate-y-1.5 shadow-md'
                  : 'bg-gray-100/60 dark:bg-slate-800/40 border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-90'
              }`}
            >
              {/* 3D Clay Trophy Pedestal */}
              <div className="flex flex-col items-center justify-center py-4 relative">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-md border-2 border-white/80 transition-transform ${
                    b.unlocked ? 'animate-clay-float' : 'grayscale'
                  }`}
                  style={{ backgroundColor: b.clayColor }}
                >
                  {b.icon}
                </div>
                
                {/* Clay pedestal base */}
                <div className="w-24 h-3 bg-amber-200/70 dark:bg-amber-950/70 rounded-full mt-2 shadow-inner" />

                {!b.unlocked && (
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Badge info */}
              <div className="space-y-1.5 text-center">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  {b.category}
                </span>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                  {b.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {b.description}
                </p>
              </div>

              {/* Status pill */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-center text-xs">
                {b.unlocked ? (
                  <span className="font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked {b.unlockedAt ? `• ${b.unlockedAt}` : ''}</span>
                  </span>
                ) : (
                  <span className="font-semibold text-gray-400">
                    Click to unlock milestone
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
