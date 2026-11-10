import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Download,
  Camera,
  History,
  Users,
  Smile,
  Palette,
  RotateCw,
  Maximize2,
  Type,
  Quote,
  Star,
  Trophy,
  Heart,
  Lightbulb,
  Rocket,
  BookOpen,
  Cloud,
  Leaf,
  MessageCircle,
  X,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { BoardElement, DreamMood, DreamCategory } from '../../types';

export const BoardEditorView: React.FC = () => {
  const {
    activeBoard,
    boards,
    setActiveBoardId,
    createBoard,
    updateBoard,
    deleteBoard,
    duplicateBoard,
    addElementToBoard,
    updateBoardElement,
    removeBoardElement,
    saveBoardSnapshot,
    restoreSnapshot,
    addBoardComment,
    openAiModal,
  } = useData();

  const { theme } = useTheme();

  const canvasRef = useRef<HTMLDivElement>(null);

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isSnapshotDrawerOpen, setIsSnapshotDrawerOpen] = useState(false);
  const [isCollabDrawerOpen, setIsCollabDrawerOpen] = useState(false);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardCategory, setNewBoardCategory] = useState<DreamCategory>('Career');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  if (!activeBoard) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">No Dream Boards Found</h2>
        <button
          onClick={() => createBoard('My Creative Universe', 'Career')}
          className="clay-button-primary px-6 py-3"
        >
          Create First Board
        </button>
      </div>
    );
  }

  const moods: { mood: DreamMood; icon: string; bg: string }[] = [
    { mood: 'Motivated', icon: '🔥', bg: 'linear-gradient(135deg, #FFF0F5 0%, #E8F0FE 50%, #E8F5E9 100%)' },
    { mood: 'Serene', icon: '🌊', bg: 'linear-gradient(135deg, #F0FDF4 0%, #FEF3C7 50%, #ECFDF5 100%)' },
    { mood: 'Joyful', icon: '✨', bg: 'linear-gradient(135deg, #FFFBEB 0%, #FCE7F3 50%, #EFF6FF 100%)' },
    { mood: 'Courageous', icon: '🦁', bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FEE2E2 100%)' },
    { mood: 'Focused', icon: '🎯', bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #E0E7FF 100%)' },
    { mood: 'Playful', icon: '🎨', bg: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FEF08A 100%)' },
  ];

  const clayStickers = [
    { cat: 'clay-star' as const, icon: '⭐', label: 'Star', color: '#F59E0B' },
    { cat: 'clay-trophy' as const, icon: '🏆', label: 'Trophy', color: '#EAB308' },
    { cat: 'clay-heart' as const, icon: '💖', label: 'Heart', color: '#EC4899' },
    { cat: 'clay-bulb' as const, icon: '💡', label: 'Idea', color: '#06B6D4' },
    { cat: 'clay-rocket' as const, icon: '🚀', label: 'Launch', color: '#8B5CF6' },
    { cat: 'clay-book' as const, icon: '📚', label: 'Study', color: '#10B981' },
    { cat: 'clay-cloud' as const, icon: '☁️', label: 'Dream', color: '#3B82F6' },
    { cat: 'clay-leaf' as const, icon: '🌿', label: 'Growth', color: '#84CC16' },
  ];

  // Element addition helpers
  const handleAddText = () => {
    addElementToBoard(activeBoard.id, {
      type: 'text',
      title: 'New Aspiration',
      content: 'Write your bold vision here...',
      x: 100,
      y: 100,
      width: 280,
      height: 140,
      rotation: 0,
      zIndex: activeBoard.elements.length + 1,
      color: '#332744',
      bgStyle: '#FFFFFF',
      fontSize: 15,
    });
  };

  const handleAddQuote = () => {
    addElementToBoard(activeBoard.id, {
      type: 'quote',
      title: 'Mantra',
      content: '"What you seek is seeking you." — Rumi',
      x: 120,
      y: 140,
      width: 290,
      height: 130,
      rotation: 2,
      zIndex: activeBoard.elements.length + 1,
      color: '#7C3AED',
      bgStyle: '#FAF5FF',
      fontSize: 15,
    });
  };

  const handleAddSticker = (stickerCat: any, icon: string, color: string) => {
    addElementToBoard(activeBoard.id, {
      type: 'sticker',
      title: 'Focus Sticker',
      content: `${icon} Anchor Goal`,
      x: 150,
      y: 150,
      width: 220,
      height: 90,
      rotation: -2,
      zIndex: activeBoard.elements.length + 1,
      stickerCategory: stickerCat,
      color: color,
    });
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    addElementToBoard(activeBoard.id, {
      type: 'image',
      title: 'Visual Anchor',
      content: imageUrlInput.trim(),
      x: 160,
      y: 160,
      width: 280,
      height: 200,
      rotation: 1,
      zIndex: activeBoard.elements.length + 1,
    });
    setImageUrlInput('');
    setIsImageModalOpen(false);
  };

  // Dragging logic
  const handlePointerDown = (e: React.PointerEvent, element: BoardElement) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
    setIsDragging(true);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    setDragOffset({
      x: e.clientX - canvasRect.left - element.x,
      y: e.clientY - canvasRect.top - element.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selectedElementId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(canvasRect.width - 240, e.clientX - canvasRect.left - dragOffset.x));
    const newY = Math.max(10, Math.min(canvasRect.height - 120, e.clientY - canvasRect.top - dragOffset.y));

    updateBoardElement(activeBoard.id, selectedElementId, {
      x: Math.round(newX),
      y: Math.round(newY),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleRotate = (el: BoardElement) => {
    const nextRot = (el.rotation + 15) % 360;
    updateBoardElement(activeBoard.id, el.id, { rotation: nextRot });
  };

  const handleResize = (el: BoardElement) => {
    const newW = el.width >= 360 ? 240 : el.width + 50;
    const newH = el.height >= 240 ? 120 : el.height + 40;
    updateBoardElement(activeBoard.id, el.id, { width: newW, height: newH });
  };

  // Export board as PNG (renders to canvas and downloads)
  const handleExportPNG = () => {
    if (!canvasRef.current) return;
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#FFF8F4';
    ctx.fillRect(0, 0, width, height);

    // Title header
    ctx.fillStyle = '#2E2238';
    ctx.font = 'bold 36px Fredoka, sans-serif';
    ctx.fillText(activeBoard.title, 50, 60);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#6B5B7B';
    ctx.fillText(`${activeBoard.category} • Mood: ${activeBoard.mood} • DreamBoard AI`, 50, 95);

    // Render cards
    activeBoard.elements.forEach((el) => {
      ctx.save();
      ctx.translate(el.x * 1.3, el.y * 1.3 + 80);
      ctx.rotate((el.rotation * Math.PI) / 180);

      // Card shadow & fill
      ctx.fillStyle = el.bgStyle || '#FFFFFF';
      ctx.shadowColor = 'rgba(190, 160, 205, 0.4)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 8;

      ctx.beginPath();
      ctx.roundRect(0, 0, el.width * 1.2, el.height * 1.2, 16);
      ctx.fill();

      // Card text
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = el.color || '#2E2238';
      ctx.font = 'bold 18px Fredoka, sans-serif';
      ctx.fillText(el.title || el.type.toUpperCase(), 15, 30);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#4B5563';
      ctx.fillText(el.content.slice(0, 50), 15, 60);

      ctx.restore();
    });

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${activeBoard.title.toLowerCase().replace(/\s+/g, '-')}-dreamboard.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 md:px-6 py-4 space-y-4 text-left">
      
      {/* Top Board Toolbar */}
      <div className="clay-card p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Board Selector & Title */}
        <div className="flex items-center gap-3">
          <select
            value={activeBoard.id}
            onChange={(e) => setActiveBoardId(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-purple-50 dark:bg-slate-800 text-xs font-bold text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 cursor-pointer"
          >
            {boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsNewBoardModalOpen(true)}
            className="clay-button-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Create New Dream Board"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Board</span>
          </button>
        </div>

        {/* Center: Mood Customizer */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-bold text-gray-500 mr-1 hidden md:inline">Mood:</span>
          {moods.map((m) => {
            const isCurrent = activeBoard.mood === m.mood;
            return (
              <button
                key={m.mood}
                onClick={() => updateBoard(activeBoard.id, { mood: m.mood, customBg: m.bg })}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  isCurrent
                    ? 'bg-pink-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
                title={`Set mood to ${m.mood}`}
              >
                <span>{m.icon}</span>
                <span className="hidden sm:inline">{m.mood}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions (Snapshot, Duplicate, Export, Comments) */}
        <div className="flex items-center gap-2">
          {/* Snapshots Button */}
          <button
            onClick={() => setIsSnapshotDrawerOpen(!isSnapshotDrawerOpen)}
            className="p-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
            title="Vision Board Snapshots / Versions"
          >
            <History className="w-4 h-4" />
            <span className="hidden md:inline">Snapshots ({activeBoard.snapshots.length})</span>
          </button>

          {/* Collaborator Comments */}
          <button
            onClick={() => setIsCollabDrawerOpen(!isCollabDrawerOpen)}
            className="p-2 rounded-xl text-xs font-bold bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 hover:bg-pink-100 flex items-center gap-1 cursor-pointer"
            title="Collaborative Feedback Notes"
          >
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">Notes ({activeBoard.comments.length})</span>
          </button>

          {/* Duplicate Board */}
          <button
            onClick={() => duplicateBoard(activeBoard.id)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Duplicate Board"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Export PNG */}
          <button
            onClick={handleExportPNG}
            className="clay-button-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Export Dream Board to PNG Image"
          >
            <Download className="w-3.5 h-3.5 text-pink-500" />
            <span>Export</span>
          </button>

          {/* Delete Board */}
          {boards.length > 1 && (
            <button
              onClick={() => {
                if (confirm('Delete this dream board?')) {
                  deleteBoard(activeBoard.id);
                }
              }}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
              title="Delete Board"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Main Canvas Area with Left Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Palette: Add Items (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="clay-card p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-3">
            <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">
              Add Clay Items
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddText}
                className="clay-button-secondary p-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold cursor-pointer justify-center"
              >
                <Type className="w-4 h-4 text-purple-600" />
                <span>Text Card</span>
              </button>

              <button
                onClick={handleAddQuote}
                className="clay-button-secondary p-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold cursor-pointer justify-center"
              >
                <Quote className="w-4 h-4 text-pink-600" />
                <span>Mantra</span>
              </button>
            </div>

            <button
              onClick={() => setIsImageModalOpen(true)}
              className="w-full clay-button-secondary p-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold cursor-pointer justify-center"
            >
              <Camera className="w-4 h-4 text-blue-500" />
              <span>Add Image / Photo</span>
            </button>

            <button
              onClick={() => openAiModal(`Generate milestones for ${activeBoard.title}`)}
              className="w-full clay-button-primary p-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold cursor-pointer justify-center shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Milestone Planner</span>
            </button>
          </div>

          {/* Clay Stickers Grid */}
          <div className="clay-card p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-2">
            <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">
              3D Clay Stickers
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {clayStickers.map((st) => (
                <button
                  key={st.cat}
                  onClick={() => handleAddSticker(st.cat, st.icon, st.color)}
                  className="p-2 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:scale-110 active:scale-95 transition-all text-xl flex flex-col items-center justify-center cursor-pointer shadow-sm border border-gray-100 dark:border-gray-700"
                  title={`Add ${st.label}`}
                >
                  <span>{st.icon}</span>
                  <span className="text-[9px] font-semibold text-gray-500 mt-1">{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Board Info & Description */}
          <div className="clay-card p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-950 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-400">Category:</span>
              <span className="font-bold text-pink-600">{activeBoard.category}</span>
            </div>
            <textarea
              value={activeBoard.description}
              onChange={(e) => updateBoard(activeBoard.id, { description: e.target.value })}
              placeholder="Describe your vision board intention..."
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 resize-none h-20 outline-none"
            />
          </div>

        </div>

        {/* Right: Tactile Board Canvas (9 cols) */}
        <div className="lg:col-span-9 relative">
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-[620px] rounded-3xl p-6 relative overflow-hidden clay-inset border-2 border-dashed border-purple-200/80 dark:border-purple-900/80 select-none shadow-inner"
            style={{ background: activeBoard.customBg || '#FFF8F4' }}
          >
            {/* Background watermark / mood watermark */}
            <div className="absolute top-4 right-6 text-xs font-extrabold uppercase tracking-widest text-black/15 dark:text-white/15 pointer-events-none">
              {activeBoard.title} • {activeBoard.mood}
            </div>

            {/* Elements */}
            {activeBoard.elements.map((el) => {
              const isSelected = selectedElementId === el.id;

              return (
                <div
                  key={el.id}
                  onPointerDown={(e) => handlePointerDown(e, el)}
                  className={`absolute rounded-3xl p-4 transition-shadow cursor-grab active:cursor-grabbing select-none clay-card ${
                    isSelected ? 'ring-3 ring-pink-500 shadow-2xl z-30' : 'z-10'
                  }`}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    minHeight: `${el.height}px`,
                    transform: `rotate(${el.rotation}deg)`,
                    backgroundColor: el.bgStyle || '#FFFFFF',
                    color: el.color || '#2E2238',
                  }}
                >
                  {/* Item top controls */}
                  <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      {el.title || el.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotate(el);
                        }}
                        className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-gray-500"
                        title="Rotate element"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResize(el);
                        }}
                        className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-gray-500"
                        title="Resize element"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBoardElement(activeBoard.id, el.id);
                        }}
                        className="p-1 rounded-md hover:bg-rose-100 text-rose-500"
                        title="Delete element"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Element Content */}
                  {el.type === 'image' ? (
                    <div className="w-full h-32 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={el.content}
                        alt="Vision inspiration"
                        className="w-full h-full object-cover pointer-events-none"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60';
                        }}
                      />
                    </div>
                  ) : el.type === 'quote' ? (
                    <div className="space-y-1">
                      <p className="text-xs italic font-medium leading-relaxed">
                        {el.content}
                      </p>
                    </div>
                  ) : el.type === 'sticker' ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl animate-clay-float">
                        {el.content.slice(0, 2)}
                      </span>
                      <p className="text-xs font-bold leading-tight">
                        {el.content.slice(2)}
                      </p>
                    </div>
                  ) : (
                    <textarea
                      value={el.content}
                      onChange={(e) =>
                        updateBoardElement(activeBoard.id, el.id, { content: e.target.value })
                      }
                      className="w-full bg-transparent resize-none border-none outline-none text-xs font-medium leading-relaxed"
                      rows={3}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Snapshots Drawer / Modal */}
      {isSnapshotDrawerOpen && (
        <div className="clay-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              <span>Dream Snapshot Version History</span>
            </h3>
            <button
              onClick={() => setIsSnapshotDrawerOpen(false)}
              className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSnapshotName}
              onChange={(e) => setNewSnapshotName(e.target.value)}
              placeholder="e.g. November Iteration V3"
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
            />
            <button
              onClick={() => {
                if (!newSnapshotName.trim()) return;
                saveBoardSnapshot(activeBoard.id, newSnapshotName.trim());
                setNewSnapshotName('');
              }}
              className="clay-button-primary px-4 py-2 text-xs font-bold"
            >
              Save Current State
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeBoard.snapshots.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 col-span-3 text-center">
                No snapshots saved yet. Capture your board state before making big changes!
              </p>
            ) : (
              activeBoard.snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3 rounded-2xl bg-purple-50/60 dark:bg-slate-800/60 border border-purple-100 dark:border-purple-900 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{snap.name}</p>
                    <p className="text-[10px] text-gray-400">{snap.timestamp} • {snap.mood}</p>
                  </div>
                  <button
                    onClick={() => {
                      restoreSnapshot(activeBoard.id, snap.id);
                      setIsSnapshotDrawerOpen(false);
                    }}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    Restore
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Collaborator Comments Drawer */}
      {isCollabDrawerOpen && (
        <div className="clay-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-600" />
              <span>Collaborative Dream Sticky Notes</span>
            </h3>
            <button
              onClick={() => setIsCollabDrawerOpen(false)}
              className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Leave an encouraging note or advice..."
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
            />
            <button
              onClick={() => {
                if (!commentInput.trim()) return;
                addBoardComment(activeBoard.id, commentInput.trim());
                setCommentInput('');
              }}
              className="clay-button-primary px-4 py-2 text-xs font-bold"
            >
              Post Note
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activeBoard.comments.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900 flex items-start gap-3"
              >
                <span className="text-xl">{c.authorAvatar}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{c.authorName}</span>
                    <span className="text-[10px] text-gray-400">{c.createdAt}</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Board Modal */}
      {isNewBoardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl clay-card bg-white dark:bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Create Dream Board</h3>
              <button onClick={() => setIsNewBoardModalOpen(false)}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Board Title</label>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="e.g. Independent Ceramic & Design Atelier"
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Category</label>
                <select
                  value={newBoardCategory}
                  onChange={(e) => setNewBoardCategory(e.target.value as DreamCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs"
                >
                  <option value="Career">Career</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                  <option value="Creativity">Creativity</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Personal Growth">Personal Growth</option>
                  <option value="Hobbies">Hobbies</option>
                  <option value="Wealth & Life">Wealth & Life</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewBoardModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-gray-500 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newBoardTitle.trim()) return;
                  createBoard(newBoardTitle.trim(), newBoardCategory);
                  setNewBoardTitle('');
                  setIsNewBoardModalOpen(false);
                }}
                className="clay-button-primary px-5 py-2 text-xs font-bold"
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl clay-card bg-white dark:bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Add Visual Anchor Image</h3>
              <button onClick={() => setIsImageModalOpen(false)}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste image URL (e.g. Unsplash URL or hosted photo)..."
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs"
              />
              <p className="text-[11px] text-gray-400">
                Quick sample: https://images.unsplash.com/photo-1518770660439-4636190af475?w=500
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 text-xs text-gray-500 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImage}
                className="clay-button-primary px-4 py-2 text-xs font-bold"
              >
                Add Image to Canvas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
