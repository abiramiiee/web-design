import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  Sun,
  Moon,
  Sparkles,
  Award,
  Flower2,
  Heart,
  CheckCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Goal } from '../../types';

export const DreamGarden: React.FC = () => {
  const { goals, waterGardenPlant, setCurrentView } = useData();

  const [atmosphere, setAtmosphere] = useState<'morning' | 'sunset' | 'twilight'>('morning');

  const plantEmojis: Record<string, string[]> = {
    sunflower: ['🌱', '🌿', '🌻', '✨🌻✨'],
    bonsai: ['🌱', '🪴', '🌲', '👑🪴👑'],
    tulip: ['🌱', '🌷', '🌷', '💖🌷💖'],
    cactus: ['🌱', '🌵', '🌵', '⭐🌵⭐'],
    rose: ['🌱', '🌹', '🌹', '🌟🌹🌟'],
    'magic-sprout': ['🌱', '🌿', '🌺', '✨🌸✨'],
  };

  const atmosphereStyles = {
    morning: 'from-amber-100/50 via-emerald-50/40 to-sky-100/50',
    sunset: 'from-orange-100/50 via-pink-100/40 to-purple-100/50',
    twilight: 'from-indigo-900/60 via-purple-900/50 to-slate-900/70 text-white',
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-left">
      
      {/* Banner */}
      <div className="clay-card p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 text-xs font-bold mb-2">
            <span>🌸 Living Achievement Ecosystem</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            The Dream Garden
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Every completed milestone nourishes your plants. Goals start as humble clay seeds and blossom into majestic 3D flowers and bonsai trees as you achieve victory.
          </p>
        </div>

        {/* Atmosphere Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAtmosphere('morning')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
              atmosphere === 'morning' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Morning Sun</span>
          </button>
          <button
            onClick={() => setAtmosphere('sunset')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
              atmosphere === 'sunset' ? 'bg-pink-100 text-pink-900 border-pink-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Golden Sunset</span>
          </button>
          <button
            onClick={() => setAtmosphere('twilight')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
              atmosphere === 'twilight' ? 'bg-indigo-900 text-white border-indigo-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>Twilight Bloom</span>
          </button>
        </div>
      </div>

      {/* Garden Canvas Field */}
      <div
        className={`w-full min-h-[550px] rounded-3xl p-8 clay-inset border-2 border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-br ${atmosphereStyles[atmosphere]} transition-all duration-700 relative overflow-hidden`}
      >
        <div className="absolute top-4 right-6 text-xs font-bold text-emerald-800/60 dark:text-emerald-300/60">
          🌱 Tap Water Droplet to nurture plant growth
        </div>

        {/* Botanical Plants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {goals.map((goal) => {
            const plantType = goal.gardenPlantType || 'sunflower';
            const stage = goal.plantStage || (goal.progress === 100 ? 4 : goal.progress >= 60 ? 3 : goal.progress >= 30 ? 2 : 1);
            const emojis = plantEmojis[plantType] || plantEmojis['sunflower'];
            const plantEmoji = emojis[stage - 1] || '🌱';
            const isFullBloom = stage === 4;

            return (
              <div
                key={goal.id}
                className="clay-card p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-emerald-100 dark:border-emerald-950 flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-all group"
              >
                {/* Plant Graphic */}
                <div className="flex flex-col items-center justify-center py-4 relative">
                  <div className={`text-6xl mb-2 transition-transform duration-300 group-hover:scale-110 ${isFullBloom ? 'animate-clay-float' : ''}`}>
                    {plantEmoji}
                  </div>
                  {isFullBloom && (
                    <div className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Full Victory Bloom</span>
                    </div>
                  )}
                  <div className="w-24 h-2 bg-emerald-200/60 rounded-full mt-2" />
                </div>

                {/* Goal Metadata */}
                <div className="space-y-1.5 text-center">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {goal.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Stage {stage} of 4 • {goal.progress}% Nurtured
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {/* Action Buttons: Water Plant & View Details */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <button
                    onClick={() => waterGardenPlant(goal.id)}
                    className="clay-button-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-sky-600"
                    title="Nourish Plant with Water"
                  >
                    <Droplets className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
                    <span>Water</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    View Milestones →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
