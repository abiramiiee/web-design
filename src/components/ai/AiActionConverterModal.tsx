import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  X,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  BookOpen,
  Compass,
  Shuffle,
  AlertCircle,
  Flame,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { DreamCategory, AlternatePath } from '../../types';

interface AiActionConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AiActionConverterModal: React.FC<AiActionConverterModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = '',
}) => {
  const { createGoal, activeBoardId, boards } = useData();

  const [dreamText, setDreamText] = useState('');
  const [selectedCategoryHint, setSelectedCategoryHint] = useState<string>('');
  const [timelinePreference, setTimelinePreference] = useState<string>('6 Months');

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generated Plan state
  const [planResult, setPlanResult] = useState<{
    title: string;
    category: DreamCategory;
    summary: string;
    difficulty: string;
    suggestedTimeline: string;
    recommendedHabits: string[];
    milestones: {
      title: string;
      description?: string;
      estimatedHours?: number;
      order: number;
      rewardBadge?: string;
      subTasks?: { title: string; estimatedHours?: number }[];
    }[];
    learningResources: string[];
    alternatePaths: AlternatePath[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'plan' | 'alternate-paths'>('plan');
  const [targetBoardId, setTargetBoardId] = useState<string>(activeBoardId || boards[0]?.id || '');

  useEffect(() => {
    if (initialPrompt) {
      setDreamText(initialPrompt);
    }
  }, [initialPrompt]);

  if (!isOpen) return null;

  // Web Speech API Voice Recognition
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your dream.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDreamText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech API error:', e);
      setIsRecording(false);
    }
  };

  const handleConvertDream = async () => {
    if (!dreamText.trim()) {
      setErrorMsg('Please describe your dream in words or use voice input.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/convert-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamText: dreamText.trim(),
          categoryHint: selectedCategoryHint || undefined,
          timelinePref: timelinePreference,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with AI planner');
      }

      const data = await response.json();
      setPlanResult(data);
      setActiveTab('plan');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error converting dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Plan editing handlers
  const handleMilestoneTitleChange = (index: number, newTitle: string) => {
    if (!planResult) return;
    const updated = [...planResult.milestones];
    updated[index].title = newTitle;
    setPlanResult({ ...planResult, milestones: updated });
  };

  const handleRemoveMilestone = (index: number) => {
    if (!planResult) return;
    const updated = planResult.milestones.filter((_, idx) => idx !== index);
    setPlanResult({ ...planResult, milestones: updated });
  };

  const handleAddMilestone = () => {
    if (!planResult) return;
    const newM = {
      title: 'New Milestone Objective',
      description: 'Detail your milestone target',
      estimatedHours: 20,
      order: planResult.milestones.length + 1,
      rewardBadge: 'Dream Builder ⚡',
      subTasks: [{ title: 'First actionable task', estimatedHours: 5 }],
    };
    setPlanResult({ ...planResult, milestones: [...planResult.milestones, newM] });
  };

  // Save as actual goal
  const handleSaveAsGoal = () => {
    if (!planResult) return;

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 6);

    createGoal({
      userId: 'dreamer_1',
      boardId: targetBoardId || undefined,
      title: planResult.title,
      description: planResult.summary,
      category: planResult.category,
      priority: 'high',
      status: 'planned',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: targetDate.toISOString().split('T')[0],
      dependencies: [],
      gardenPlantType: planResult.category === 'Career' ? 'bonsai' : planResult.category === 'Education' ? 'tulip' : 'sunflower',
      learningResources: planResult.learningResources,
      milestones: planResult.milestones.map((m, idx) => ({
        id: 'm_' + Date.now() + '_' + idx,
        title: m.title,
        description: m.description,
        completed: false,
        estimatedHours: m.estimatedHours,
        order: m.order,
        rewardBadge: m.rewardBadge,
      })),
      subTasks: planResult.milestones.flatMap((m, mIdx) =>
        (m.subTasks || []).map((st, stIdx) => ({
          id: `st_${mIdx}_${stIdx}_${Date.now()}`,
          milestoneId: 'm_' + Date.now() + '_' + mIdx,
          title: st.title,
          completed: false,
          estimatedHours: st.estimatedHours,
        }))
      ),
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FF758F', '#B5E2FA', '#FFD166', '#06B6D4', '#A855F7'],
      });
    } catch {}

    onClose();
  };

  const samplePrompts = [
    'I want to become a full-stack 3D and AI developer',
    'I want to open a serene ceramic pottery studio in Kyoto',
    'I want to run my first 21K half-marathon with joy',
    'I want to write and publish a science fantasy illustrated novel',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-6 rounded-3xl p-6 md:p-8 clay-card bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg md:text-xl text-gray-900 dark:text-white">
                AI Dream-to-Action Converter
              </h2>
              <p className="text-xs text-gray-500">
                Powered by Gemini 3.8 Flash • Convert freeform dreams into structured milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Describe your dream... e.g., 'I want to build a sustainable solar tech startup' or 'I want to learn classical guitar and perform for friends'"
              rows={3}
              className="w-full p-4 pr-14 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
            />
            
            {/* Voice Input Button */}
            <button
              onClick={toggleVoiceRecording}
              className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg'
                  : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200'
              }`}
              title={isRecording ? 'Listening... click to stop' : 'Speak your dream (Voice Input)'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Listening to your voice... Speak freely!</span>
            </div>
          )}

          {/* Prompt Inspo Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-gray-400">Try:</span>
            {samplePrompts.map((s) => (
              <button
                key={s}
                onClick={() => setDreamText(s)}
                className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-[11px] text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-950 transition cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Optional constraints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <label className="font-bold text-gray-600 dark:text-gray-400 block mb-1">
                Category Pillar (Optional)
              </label>
              <select
                value={selectedCategoryHint}
                onChange={(e) => setSelectedCategoryHint(e.target.value)}
                className="w-full p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
              >
                <option value="">AI Auto-Detect Category</option>
                <option value="Education">Education</option>
                <option value="Career">Career</option>
                <option value="Travel">Travel</option>
                <option value="Creativity">Creativity</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Personal Growth">Personal Growth</option>
                <option value="Hobbies">Hobbies</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-600 dark:text-gray-400 block mb-1">
                Target Timeline
              </label>
              <select
                value={timelinePreference}
                onChange={(e) => setTimelinePreference(e.target.value)}
                className="w-full p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
              >
                <option value="3 Months">3 Months (Intensive)</option>
                <option value="6 Months">6 Months (Standard)</option>
                <option value="1 Year">1 Year (Deep Journey)</option>
                <option value="Flexible">Flexible Pace</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 text-xs text-rose-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Convert Button */}
          <div className="pt-2">
            <button
              onClick={handleConvertDream}
              disabled={isLoading}
              className="w-full clay-button-primary py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Synthesizing Dream into Milestones with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Concrete Milestone Action Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Plan Section */}
        {planResult && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-5 animate-fade-in">
            
            {/* Tabs: Plan vs Alternate Paths */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`pb-1 text-xs font-bold border-b-2 transition ${
                    activeTab === 'plan'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  Action Plan & Milestones
                </button>
                <button
                  onClick={() => setActiveTab('alternate-paths')}
                  className={`pb-1 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === 'alternate-paths'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Alternate Path Explorer ({planResult.alternatePaths?.length || 0})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-500">Board:</span>
                <select
                  value={targetBoardId}
                  onChange={(e) => setTargetBoardId(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs font-semibold"
                >
                  {boards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeTab === 'plan' ? (
              <div className="space-y-4">
                
                {/* Plan Overview Card */}
                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-200 dark:bg-purple-950 text-purple-800 dark:text-purple-200">
                      {planResult.category} • {planResult.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      ⏱️ {planResult.suggestedTimeline}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    {planResult.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {planResult.summary}
                  </p>
                </div>

                {/* Milestones List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                      Milestones ({planResult.milestones.length}) • Click title to edit
                    </h4>
                    <button
                      onClick={handleAddMilestone}
                      className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Milestone</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {planResult.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 space-y-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={m.title}
                              onChange={(e) => handleMilestoneTitleChange(idx, e.target.value)}
                              className="w-full font-bold text-xs text-gray-900 dark:text-white bg-transparent outline-none focus:border-b border-purple-400"
                            />
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {m.estimatedHours && (
                              <span className="text-[11px] text-gray-400">
                                ~{m.estimatedHours}h
                              </span>
                            )}
                            <button
                              onClick={() => handleRemoveMilestone(idx)}
                              className="text-gray-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Subtasks */}
                        {m.subTasks && m.subTasks.length > 0 && (
                          <div className="pl-7 space-y-1 text-xs text-gray-500">
                            {m.subTasks.map((st, sIdx) => (
                              <div key={sIdx} className="flex items-center gap-1.5 text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                <span>{st.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Habits & Learning suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {planResult.recommendedHabits && (
                    <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900 space-y-1.5">
                      <span className="font-bold text-amber-800 dark:text-amber-400 block">
                        🌱 Daily Anchor Habits
                      </span>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                        {planResult.recommendedHabits.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {planResult.learningResources && (
                    <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900 space-y-1.5">
                      <span className="font-bold text-blue-800 dark:text-blue-400 block">
                        📚 Learning Suggestions
                      </span>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                        {planResult.learningResources.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    onClick={handleSaveAsGoal}
                    className="w-full clay-button-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Save As Active Goal & Add to Board</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Alternate Paths */
              <div className="space-y-4">
                <p className="text-xs text-gray-500">
                  Not everyone takes the same road. Explore 3 alternative pathways to reach this dream:
                </p>

                <div className="space-y-3">
                  {planResult.alternatePaths?.map((path) => (
                    <div
                      key={path.id}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-purple-700 dark:text-purple-300">
                          {path.title}
                        </h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200">
                          {path.timeline} • {path.estimatedCost}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {path.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="text-emerald-600 dark:text-emerald-400">
                          <strong className="block">Pros:</strong>
                          {path.pros?.map((p, i) => <div key={i}>✓ {p}</div>)}
                        </div>
                        <div className="text-rose-600 dark:text-rose-400">
                          <strong className="block">Considerations:</strong>
                          {path.cons?.map((c, i) => <div key={i}>⚠ {c}</div>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
