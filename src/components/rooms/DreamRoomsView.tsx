import React, { useState } from 'react';
import {
  Box,
  Layers,
  Sparkles,
  Trophy,
  CheckCircle,
  Eye,
  Sliders,
  Maximize2,
  RefreshCw,
  Info,
  Palette,
} from 'lucide-react';
import { ClayRoomCanvas } from '../3d/ClayRoomCanvas';
import { useData } from '../../context/DataContext';
import { DreamCategory } from '../../types';

export const DreamRoomsView: React.FC = () => {
  const { goals, setCurrentView, openAiModal } = useData();

  const [activeCategory, setActiveCategory] = useState<DreamCategory>('Education');
  const [wallColor, setWallColor] = useState<string>('#FDF2F8');
  const [floorColor, setFloorColor] = useState<string>('#FCE7F3');
  const [decorationsEnabled, setDecorationsEnabled] = useState(true);
  const [inspectModal, setInspectModal] = useState<{ title: string; desc: string } | null>(null);
  const [is2DMode, setIs2DMode] = useState(false);

  const roomCategories: { cat: DreamCategory; icon: string; title: string; color: string }[] = [
    { cat: 'Education', icon: '🎓', title: 'Knowledge Sanctum', color: '#8B5CF6' },
    { cat: 'Career', icon: '💼', title: 'Executive Atelier', color: '#EC4899' },
    { cat: 'Travel', icon: '✈️', title: 'World Wanderer Pod', color: '#06B6D4' },
    { cat: 'Creativity', icon: '🎨', title: 'Maker Studio', color: '#F59E0B' },
    { cat: 'Health & Wellness', icon: '🧘', title: 'Vitality Oasis', color: '#10B981' },
    { cat: 'Personal Growth', icon: '🌱', title: 'Mindfulness Alcove', color: '#A855F7' },
  ];

  const wallPalettes = [
    { name: 'Rose Clay', wall: '#FDF2F8', floor: '#FCE7F3' },
    { name: 'Mint Sanctuary', wall: '#F0FDF4', floor: '#DCFCE7' },
    { name: 'Sky Breeze', wall: '#F0F9FF', floor: '#E0F2FE' },
    { name: 'Butter Cream', wall: '#FEFCE8', floor: '#FEF08A' },
    { name: 'Lavender Mist', wall: '#FAF5FF', floor: '#F3E8FF' },
    { name: 'Midnight Charcoal', wall: '#1E1B2E', floor: '#2A243D' },
  ];

  // Associated goals for currently selected room
  const roomGoals = goals.filter((g) => g.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-left">
      
      {/* Header Banner */}
      <div className="clay-card p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 text-xs font-bold mb-2">
            <span>🏰 Interactive 3D Spatial Visualization</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Miniature Clay Dream Rooms
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Explore and customize tactile miniature spaces tailored to each dream pillar. Drag to rotate 360°, zoom in, and tap objects to view associated goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIs2DMode(!is2DMode)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
              is2DMode
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
            }`}
          >
            {is2DMode ? 'Switch to 3D View' : '2D Accessible Mode'}
          </button>

          <button
            onClick={() => setDecorationsEnabled(!decorationsEnabled)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
              decorationsEnabled
                ? 'bg-purple-100 border-purple-300 text-purple-900'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 text-gray-500'
            }`}
          >
            {decorationsEnabled ? '🌿 Extras ON' : 'Extras OFF'}
          </button>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {roomCategories.map((r) => {
          const isActive = activeCategory === r.cat;
          return (
            <button
              key={r.cat}
              onClick={() => setActiveCategory(r.cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'clay-button-primary shadow-md scale-105'
                  : 'clay-button-secondary'
              }`}
            >
              <span className="text-base">{r.icon}</span>
              <span>{r.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Viewport & Inspection Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 3D Canvas Viewport (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="w-full h-[500px] md:h-[580px] rounded-3xl p-2 clay-card bg-gradient-to-br from-pink-50/40 via-purple-50/30 to-blue-50/40 dark:from-slate-950 dark:to-slate-900 relative">
            <ClayRoomCanvas
              category={activeCategory}
              wallColor={wallColor}
              floorColor={floorColor}
              decorationsEnabled={decorationsEnabled}
              showFallback2D={is2DMode}
              onObjectClick={(name, desc) => {
                setInspectModal({ title: name, desc });
              }}
            />
          </div>

          {/* Wall & Floor Clay Palette Bar */}
          <div className="clay-card p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-950 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-500" />
              <span className="font-bold text-gray-700 dark:text-gray-300">Room Clay Palette:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {wallPalettes.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setWallColor(p.wall);
                    setFloorColor(p.floor);
                  }}
                  className="px-2.5 py-1 rounded-xl border border-gray-200 dark:border-gray-700 text-[11px] font-semibold flex items-center gap-1.5 hover:scale-105 transition cursor-pointer"
                  style={{ backgroundColor: p.floor }}
                >
                  <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: p.wall }} />
                  <span className="text-gray-800">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Info & Associated Goals Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Inspected Object Card */}
          {inspectModal ? (
            <div className="clay-card p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-pink-300 dark:border-pink-800 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600">
                  ✨ Interactive Object Inspected
                </span>
                <button
                  onClick={() => setInspectModal(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  Close
                </button>
              </div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                {inspectModal.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {inspectModal.desc}
              </p>
            </div>
          ) : (
            <div className="clay-card p-4 rounded-3xl bg-purple-50/60 dark:bg-slate-800/60 border border-purple-100 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>Tap on any miniature clay prop (laptop, bookshelf, trophy, plants) to inspect its purpose.</span>
            </div>
          )}

          {/* Associated Active Goals in this Category */}
          <div className="clay-card p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Associated Goals ({roomGoals.length})</span>
              </h3>
              <button
                onClick={() => openAiModal(`Goal in ${activeCategory}`)}
                className="text-[11px] font-bold text-pink-600 hover:underline"
              >
                + Add Goal
              </button>
            </div>

            {roomGoals.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-gray-400">No active goals yet in {activeCategory}.</p>
                <button
                  onClick={() => openAiModal(`I want to achieve a goal in ${activeCategory}`)}
                  className="clay-button-primary px-3 py-1.5 text-xs font-bold"
                >
                  Create Goal with AI
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {roomGoals.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {g.title}
                      </p>
                      <span className="text-xs font-extrabold text-purple-600">
                        {g.progress}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full"
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                      <span>{g.milestones.filter((m) => m.completed).length} of {g.milestones.length} milestones done</span>
                      <button
                        onClick={() => setCurrentView('board-editor')}
                        className="font-bold text-pink-600 hover:underline"
                      >
                        Board →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Room Customization Tips */}
          <div className="clay-card p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-2 text-xs">
            <h4 className="font-bold text-gray-700 dark:text-gray-300">Room Navigation Controls</h4>
            <ul className="space-y-1 text-gray-500">
              <li>• Left click + drag: Orbit around miniature room</li>
              <li>• Right click + drag: Pan camera position</li>
              <li>• Scroll wheel / pinch: Zoom into study desk & props</li>
              <li>• Click object: Inspect associated dream milestone</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
