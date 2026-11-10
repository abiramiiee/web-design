import React from 'react';
import { Heart, Sparkles, Compass, ShieldCheck, Box, Sprout } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useData();
  const { openThemeStudio } = useTheme();

  return (
    <footer className="w-full mt-16 pb-8 px-4 text-center">
      <div className="max-w-6xl mx-auto rounded-3xl p-8 clay-card bg-white/70 dark:bg-slate-900/70 border border-purple-100 dark:border-purple-900">
        
        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <span className="font-extrabold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                DreamBoard AI
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Dream It. Design It. Grow Into It. An innovative 3D clay world for visual dream visualization and real goal execution.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              <span>🎓</span>
              <span>College Expo Demonstration Ready</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-[11px]">
              Explore
            </h4>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>
                <button onClick={() => setCurrentView('board-editor')} className="hover:text-purple-600 cursor-pointer">
                  Visual Dream Boards
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('rooms')} className="hover:text-purple-600 cursor-pointer">
                  Interactive 3D Clay Rooms
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('garden')} className="hover:text-purple-600 cursor-pointer">
                  Dream Garden Growth
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dependencies')} className="hover:text-purple-600 cursor-pointer">
                  Dependency Goal Map
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-[11px]">
              AI & Innovation
            </h4>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>
                <button onClick={() => setCurrentView('drift')} className="hover:text-purple-600 cursor-pointer">
                  Dream Drift Detector
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('memories')} className="hover:text-purple-600 cursor-pointer">
                  Memory Wall & Scrapbook
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('achievements')} className="hover:text-purple-600 cursor-pointer">
                  3D Clay Trophy Room
                </button>
              </li>
              <li>
                <button onClick={openThemeStudio} className="hover:text-purple-600 cursor-pointer">
                  Theme Studio (8 Palettes)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-[11px]">
              Values & Craft
            </h4>
            <p className="text-gray-500 leading-relaxed">
              Designed with 3D tactile claymorphism to inspire playfulness, agency, and steady daily progress across all generations.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-lg">🌱</span>
              <span className="text-lg">⚡</span>
              <span className="text-lg">🔮</span>
              <span className="text-lg">🏆</span>
            </div>
          </div>

        </div>

        {/* Lower footer copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} DreamBoard AI • Tagline: "Dream It. Design It. Grow Into It."</p>
          <div className="flex items-center gap-2">
            <span>Powered by Three.js & Gemini 3.8 Flash</span>
            <span>•</span>
            <span className="text-rose-500 flex items-center gap-1 font-semibold">
              Crafted with <Heart className="w-3 h-3 fill-rose-500" /> for Dreamers
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
