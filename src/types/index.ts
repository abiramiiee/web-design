export type ThemeId =
  | 'clay-dream-world'
  | 'candy-pop'
  | 'nature-bloom'
  | 'midnight-creative'
  | 'minimal-calm'
  | 'sunset-studio'
  | 'ocean-breeze'
  | 'monochrome-focus'
  | 'custom';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  bgMain: string;
  bgSurface: string;
  bgCard: string;
  primary: string;
  primaryText: string;
  secondary: string;
  accent: string;
  clayShadowLight: string;
  clayShadowDark: string;
  clayInset: string;
  clayBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  fontFamily: 'Fredoka' | 'Plus Jakarta Sans' | 'Quicksand' | 'Outfit' | 'Inter';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  isDark: boolean;
  animationIntensity: 'subtle' | 'normal' | 'bouncy' | 'none';
}

export type DreamCategory =
  | 'Education'
  | 'Career'
  | 'Travel'
  | 'Personal Growth'
  | 'Creativity'
  | 'Health & Wellness'
  | 'Hobbies'
  | 'Wealth & Life';

export type DreamMood =
  | 'Motivated'
  | 'Serene'
  | 'Joyful'
  | 'Courageous'
  | 'Focused'
  | 'Playful';

export interface BoardElement {
  id: string;
  type: 'image' | 'text' | 'quote' | 'sticker' | 'milestone' | 'clay-badge';
  content: string;
  title?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  color?: string;
  bgStyle?: string;
  fontSize?: number;
  associatedGoalId?: string;
  stickerCategory?: 'clay-star' | 'clay-trophy' | 'clay-heart' | 'clay-bulb' | 'clay-rocket' | 'clay-book' | 'clay-cloud' | 'clay-leaf';
}

export interface BoardSnapshot {
  id: string;
  name: string;
  timestamp: string;
  elements: BoardElement[];
  mood: DreamMood;
  thumbnail?: string;
}

export interface CollaborativeComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  reaction?: string;
  x?: number;
  y?: number;
}

export interface DreamBoard {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: DreamCategory;
  mood: DreamMood;
  themeId?: ThemeId;
  customBg?: string;
  elements: BoardElement[];
  snapshots: BoardSnapshot[];
  collaborators: string[];
  comments: CollaborativeComment[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  targetDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  order: number;
  rewardBadge?: string;
}

export interface SubTask {
  id: string;
  milestoneId: string;
  title: string;
  completed: boolean;
  estimatedHours?: number;
}

export interface Goal {
  id: string;
  userId: string;
  boardId?: string;
  title: string;
  description: string;
  category: DreamCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planned' | 'in_progress' | 'achieved' | 'paused';
  progress: number; // 0 - 100
  startDate: string;
  targetDate: string;
  milestones: Milestone[];
  subTasks: SubTask[];
  dependencies: string[]; // ids of goals that must be done first
  learningResources?: string[];
  notes?: string;
  gardenPlantType?: 'sunflower' | 'cactus' | 'rose' | 'bonsai' | 'tulip' | 'magic-sprout';
  plantStage?: 1 | 2 | 3 | 4; // 4 is fully bloomed
  createdAt: string;
  updatedAt: string;
}

export interface DreamDrift {
  goalId: string;
  goalTitle: string;
  plannedProgress: number;
  actualProgress: number;
  driftPercentage: number;
  status: 'on_track' | 'slight_drift' | 'behind' | 'critical_drift';
  diagnosedBlockers: string[];
  catchUpRecommendations: string[];
  suggestedAdjustmentDays: number;
}

export interface AlternatePath {
  id: string;
  title: string;
  description: string;
  timeline: string;
  estimatedCost: string;
  pros: string[];
  cons: string[];
  steps: string[];
}

export interface MemoryItem {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  description: string;
  date: string;
  type: 'achievement' | 'photo' | 'reflection' | 'certificate' | 'breakthrough';
  badgeIcon: string;
  photoUrl?: string;
  quote?: string;
  tags: string[];
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: DreamCategory | 'General';
  unlocked: boolean;
  unlockedAt?: string;
  clayColor: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  preferredTheme: ThemeId;
  mode: 'simple' | 'advanced';
  dreamsCount: number;
  completedCount: number;
  currentStreak: number;
  xpPoints: number;
  isGuest: boolean;
}

export interface RoomDecoration {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  unlocked: boolean;
  goalIdRef?: string;
}
