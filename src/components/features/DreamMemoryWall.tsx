import React, { useState } from 'react';
import {
  Image,
  Plus,
  Trash2,
  Calendar,
  Quote,
  Sparkles,
  Award,
  Tag,
  X,
  Heart,
  Bookmark,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { MemoryItem } from '../../types';

export const DreamMemoryWall: React.FC = () => {
  const { memories, addMemory, deleteMemory } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quote, setQuote] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('🏆');
  const [type, setType] = useState<MemoryItem['type']>('achievement');
  const [tagInput, setTagInput] = useState('');

  const icons = ['🏆', '🗿', '🍵', '🏅', '✨', '🚀', '🎨', '🎓', '🌱', '🔥'];

  const filteredMemories =
    filterType === 'all' ? memories : memories.filter((m) => m.type === filterType);

  const handleSaveMemory = () => {
    if (!title.trim() || !description.trim()) return;

    addMemory({
      userId: 'dreamer_1',
      title: title.trim(),
      description: description.trim(),
      date: new Date().toISOString().split('T')[0],
      type,
      badgeIcon,
      quote: quote.trim() || undefined,
      tags: tagInput
        ? tagInput.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Milestone', 'Dream'],
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    setTitle('');
    setDescription('');
    setQuote('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-left">
      
      {/* Banner */}
      <div className="clay-card p-6 md:p-8 rounded-3xl bg-gradient-to-r from-pink-50/70 via-purple-50/70 to-blue-50/70 dark:from-slate-900 dark:to-slate-800 border border-purple-100 dark:border-purple-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 text-xs font-bold mb-2">
            <span>📷 Visual Nostalgia & Proof of Growth</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Dream Memory Wall
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            A scrapbook celebrating every breakthrough, certification, race finish, and mindful insight you’ve conquered along the path.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="clay-button-primary px-5 py-3 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Pin New Memory</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'achievement', 'breakthrough', 'certificate', 'reflection'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition cursor-pointer ${
              filterType === t
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Memory Wall Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="clay-card p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-4 hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-xl shadow-inner">
                  {mem.badgeIcon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400">{mem.date}</span>
                  <button
                    onClick={() => deleteMemory(mem.id)}
                    className="text-gray-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 block mb-1">
                  {mem.type}
                </span>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                  {mem.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                  {mem.description}
                </p>
              </div>

              {mem.quote && (
                <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-slate-800/60 border border-purple-100 dark:border-purple-900 text-xs italic text-purple-900 dark:text-purple-300">
                  "{mem.quote}"
                </div>
              )}
            </div>

            {/* Tags footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 flex-wrap">
              {mem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl clay-card bg-white dark:bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                Pin Achievement Memory
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mastered Three.js PBR Studio Rig!"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was the breakthrough or feeling?"
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Quote or Reflection</label>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="e.g. 'In the pottery wheel of life, patience shapes true harmony.'"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Badge Icon</label>
                <div className="flex gap-2">
                  {icons.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setBadgeIcon(ic)}
                      className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center border ${
                        badgeIcon === ic ? 'bg-amber-100 border-amber-400' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Three.js, Milestone, Victory"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs text-gray-500 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMemory}
                className="clay-button-primary px-5 py-2 text-xs font-bold"
              >
                Pin Memory
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
