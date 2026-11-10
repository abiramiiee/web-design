import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  DreamBoard,
  Goal,
  MemoryItem,
  AchievementBadge,
  DreamDrift,
  BoardElement,
  Milestone,
  DreamMood,
} from '../types';
import {
  INITIAL_BOARDS,
  INITIAL_GOALS,
  INITIAL_MEMORIES,
  INITIAL_BADGES,
  INITIAL_DRIFT,
} from '../data/mockData';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'board-editor'
  | 'rooms'
  | 'garden'
  | 'dependencies'
  | 'drift'
  | 'memories'
  | 'achievements';

interface DataContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  boards: DreamBoard[];
  activeBoard: DreamBoard | null;
  activeBoardId: string | null;
  setActiveBoardId: (id: string | null) => void;
  createBoard: (title: string, category: DreamBoard['category'], description?: string) => string;
  updateBoard: (id: string, updates: Partial<DreamBoard>) => void;
  deleteBoard: (id: string) => void;
  duplicateBoard: (id: string) => void;
  saveBoardSnapshot: (boardId: string, name: string) => void;
  restoreSnapshot: (boardId: string, snapshotId: string) => void;
  addBoardComment: (boardId: string, text: string, reaction?: string) => void;
  // Board element editing
  addElementToBoard: (boardId: string, element: Omit<BoardElement, 'id'>) => void;
  updateBoardElement: (boardId: string, elementId: string, updates: Partial<BoardElement>) => void;
  removeBoardElement: (boardId: string, elementId: string) => void;
  // Goals
  goals: Goal[];
  createGoal: (newGoal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => string;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  toggleSubTask: (goalId: string, subTaskId: string) => void;
  waterGardenPlant: (goalId: string) => void;
  // Memories
  memories: MemoryItem[];
  addMemory: (memory: Omit<MemoryItem, 'id'>) => void;
  deleteMemory: (id: string) => void;
  // Badges
  badges: AchievementBadge[];
  unlockBadge: (badgeId: string) => void;
  // Drift
  driftData: DreamDrift[];
  analyzeGoalDrift: (goalId: string) => Promise<void>;
  // AI Modal
  isAiModalOpen: boolean;
  openAiModal: (initialPrompt?: string) => void;
  closeAiModal: () => void;
  aiInitialPrompt: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_BOARDS = 'dreamboard_boards_v1';
const STORAGE_KEY_GOALS = 'dreamboard_goals_v1';
const STORAGE_KEY_MEMORIES = 'dreamboard_memories_v1';
const STORAGE_KEY_BADGES = 'dreamboard_badges_v1';
const STORAGE_KEY_DRIFT = 'dreamboard_drift_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [activeBoardId, setActiveBoardId] = useState<string | null>('board-1');

  // Load state from localStorage or mock defaults
  const [boards, setBoards] = useState<DreamBoard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOARDS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BOARDS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GOALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GOALS;
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMORIES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEMORIES;
  });

  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BADGES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BADGES;
  });

  const [driftData, setDriftData] = useState<DreamDrift[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRIFT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DRIFT;
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  // Persist locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOARDS, JSON.stringify(boards));
      localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
      localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(memories));
      localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(badges));
      localStorage.setItem(STORAGE_KEY_DRIFT, JSON.stringify(driftData));
    } catch (e) {
      console.warn('Storage sync warn:', e);
    }

    // Background sync to backend server
    fetch('/api/data/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boards, goals, memories, badges }),
    }).catch(() => {});
  }, [boards, goals, memories, badges, driftData]);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0] || null;

  // Board operations
  const createBoard = (title: string, category: DreamBoard['category'], description = ''): string => {
    const newBoardId = 'board_' + Date.now();
    const newBoard: DreamBoard = {
      id: newBoardId,
      userId: 'dreamer_1',
      title,
      description,
      category,
      mood: 'Motivated',
      themeId: 'clay-dream-world',
      customBg: 'linear-gradient(135deg, #FFF0F5 0%, #F5F0FF 100%)',
      elements: [
        {
          id: 'el_' + Date.now(),
          type: 'text',
          title: 'Vision Statement',
          content: `My journey towards ${title}. Dream it, design it, grow into it!`,
          x: 40,
          y: 40,
          width: 300,
          height: 140,
          rotation: 0,
          zIndex: 1,
          color: '#FF758F',
          bgStyle: '#FFFFFF',
          fontSize: 16,
        },
      ],
      snapshots: [],
      collaborators: [],
      comments: [],
      isPublic: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setBoards((prev) => [newBoard, ...prev]);
    setActiveBoardId(newBoardId);
    return newBoardId;
  };

  const updateBoard = (id: string, updates: Partial<DreamBoard>) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : b
      )
    );
  };

  const deleteBoard = (id: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== id));
    if (activeBoardId === id) {
      const remaining = boards.filter((b) => b.id !== id);
      setActiveBoardId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const duplicateBoard = (id: string) => {
    const target = boards.find((b) => b.id === id);
    if (!target) return;
    const dupId = 'board_' + Date.now();
    const duplicated: DreamBoard = {
      ...target,
      id: dupId,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      elements: target.elements.map((el) => ({ ...el, id: 'el_' + Math.random().toString(36).slice(2, 9) })),
      snapshots: [],
    };
    setBoards((prev) => [duplicated, ...prev]);
    setActiveBoardId(dupId);
  };

  const saveBoardSnapshot = (boardId: string, name: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    const snap = {
      id: 'snap_' + Date.now(),
      name,
      timestamp: new Date().toISOString().split('T')[0],
      elements: JSON.parse(JSON.stringify(board.elements)),
      mood: board.mood,
    };
    updateBoard(boardId, { snapshots: [snap, ...board.snapshots] });
  };

  const restoreSnapshot = (boardId: string, snapshotId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    const snap = board.snapshots.find((s) => s.id === snapshotId);
    if (!snap) return;
    updateBoard(boardId, { elements: snap.elements, mood: snap.mood });
  };

  const addBoardComment = (boardId: string, text: string, reaction = '✨') => {
    const newComment = {
      id: 'comm_' + Date.now(),
      authorName: 'You (Creator)',
      authorAvatar: '🎨',
      text,
      createdAt: 'Just now',
      reaction,
    };
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    updateBoard(boardId, { comments: [newComment, ...board.comments] });
  };

  const addElementToBoard = (boardId: string, element: Omit<BoardElement, 'id'>) => {
    const newEl: BoardElement = {
      ...element,
      id: 'el_' + Date.now() + Math.random().toString(36).slice(2, 5),
    };
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    updateBoard(boardId, { elements: [...board.elements, newEl] });
  };

  const updateBoardElement = (boardId: string, elementId: string, updates: Partial<BoardElement>) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    const updatedElements = board.elements.map((el) =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    updateBoard(boardId, { elements: updatedElements });
  };

  const removeBoardElement = (boardId: string, elementId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    updateBoard(boardId, { elements: board.elements.filter((el) => el.id !== elementId) });
  };

  // Goals
  const createGoal = (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): string => {
    const newId = 'goal_' + Date.now();
    const completedCount = newGoalData.milestones.filter((m) => m.completed).length;
    const progress = newGoalData.milestones.length > 0 ? Math.round((completedCount / newGoalData.milestones.length) * 100) : 0;
    
    const fullGoal: Goal = {
      ...newGoalData,
      id: newId,
      progress,
      plantStage: 1,
      gardenPlantType: newGoalData.gardenPlantType || 'sunflower',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setGoals((prev) => [fullGoal, ...prev]);

    // Add corresponding milestone cards to active board if linked
    if (newGoalData.boardId) {
      addElementToBoard(newGoalData.boardId, {
        type: 'milestone',
        title: fullGoal.title,
        content: `Target: ${fullGoal.targetDate} • ${fullGoal.milestones.length} Milestones`,
        x: 60,
        y: 60,
        width: 300,
        height: 140,
        rotation: 0,
        zIndex: 10,
        associatedGoalId: newId,
        color: '#FF758F',
      });
    }

    return newId;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const merged = { ...g, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        if (updates.milestones) {
          const done = updates.milestones.filter((m) => m.completed).length;
          merged.progress = Math.round((done / updates.milestones.length) * 100);
          merged.plantStage = merged.progress === 100 ? 4 : merged.progress >= 60 ? 3 : merged.progress >= 30 ? 2 : 1;
        }
        return merged;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        const updatedMilestones = goal.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          const nextCompleted = !m.completed;
          if (nextCompleted) {
            // Milestone achieved celebration
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF758F', '#B5E2FA', '#FFD166', '#06B6D4', '#A855F7'],
              });
            } catch {}
          }
          return {
            ...m,
            completed: nextCompleted,
            completedDate: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
          };
        });

        const done = updatedMilestones.filter((m) => m.completed).length;
        const progress = Math.round((done / updatedMilestones.length) * 100);
        const plantStage = progress === 100 ? 4 : progress >= 60 ? 3 : progress >= 30 ? 2 : 1;
        const status = progress === 100 ? 'achieved' : progress > 0 ? 'in_progress' : 'planned';

        if (progress === 100) {
          unlockBadge('b-3');
          // Add automatic memory item
          addMemory({
            userId: 'dreamer_1',
            goalId: goal.id,
            title: `Goal Achieved: ${goal.title}!`,
            description: `All milestones completed! Grew your dream to full bloom in the Dream Garden.`,
            date: new Date().toISOString().split('T')[0],
            type: 'achievement',
            badgeIcon: '🏆',
            tags: [goal.category, 'Victory'],
          });
        }

        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          plantStage: plantStage as 1 | 2 | 3 | 4,
          status,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const toggleSubTask = (goalId: string, subTaskId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          subTasks: g.subTasks.map((st) => (st.id === subTaskId ? { ...st, completed: !st.completed } : st)),
        };
      })
    );
  };

  const waterGardenPlant = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextStage = Math.min(4, ((g.plantStage || 1) + 1)) as 1 | 2 | 3 | 4;
        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#38BDF8', '#86EFAC', '#FDE047'],
          });
        } catch {}
        return { ...g, plantStage: nextStage };
      })
    );
  };

  // Memories
  const addMemory = (memoryData: Omit<MemoryItem, 'id'>) => {
    const newMem: MemoryItem = {
      ...memoryData,
      id: 'mem_' + Date.now(),
    };
    setMemories((prev) => [newMem, ...prev]);
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Badges
  const unlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] } : b))
    );
  };

  // Drift
  const analyzeGoalDrift = async (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    try {
      const res = await fetch('/api/ai/analyze-drift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: goal.title,
          plannedProgress: 75,
          actualProgress: goal.progress,
          targetDate: goal.targetDate,
          milestones: goal.milestones,
        }),
      });
      const data = await res.json();
      setDriftData((prev) => {
        const without = prev.filter((d) => d.goalId !== goalId);
        return [
          {
            goalId,
            goalTitle: goal.title,
            plannedProgress: 75,
            actualProgress: goal.progress,
            driftPercentage: data.driftPercentage ?? (goal.progress - 75),
            status: data.status || 'on_track',
            diagnosedBlockers: data.diagnosedBlockers || [],
            catchUpRecommendations: data.catchUpRecommendations || [],
            suggestedAdjustmentDays: data.suggestedAdjustmentDays || 0,
          },
          ...without,
        ];
      });
    } catch (e) {
      console.warn('Drift analysis request error:', e);
    }
  };

  const openAiModal = (prompt = '') => {
    setAiInitialPrompt(prompt);
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
    setAiInitialPrompt('');
  };

  return (
    <DataContext.Provider
      value={{
        currentView,
        setCurrentView,
        boards,
        activeBoard,
        activeBoardId,
        setActiveBoardId,
        createBoard,
        updateBoard,
        deleteBoard,
        duplicateBoard,
        saveBoardSnapshot,
        restoreSnapshot,
        addBoardComment,
        addElementToBoard,
        updateBoardElement,
        removeBoardElement,
        goals,
        createGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        toggleSubTask,
        waterGardenPlant,
        memories,
        addMemory,
        deleteMemory,
        badges,
        unlockBadge,
        driftData,
        analyzeGoalDrift,
        isAiModalOpen,
        openAiModal,
        closeAiModal,
        aiInitialPrompt,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
