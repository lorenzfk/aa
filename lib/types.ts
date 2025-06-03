// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  progress: UserProgress;
  stats: UserStats;
  createdAt: Date;
}

export interface UserProgress {
  currentLesson: string;
  completedLessons: string[];
  skills: Record<string, SkillProgress>;
  skillPoints: number;
  streak: number;
  lastActive: Date;
}

export interface SkillProgress {
  id: string;
  level: number;
  completed: boolean;
  exercises: {
    id: string;
    completed: boolean;
    score: number;
  }[];
}

export interface UserStats {
  daysActive: number;
  totalPoints: number;
  longestStreak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
}

// Learning content
export interface World {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  theme: {
    primary: string;
    secondary: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  world: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  type: 'tutorial' | 'quiz' | 'practice';
  title: string;
  description: string;
  content: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Blender interface
export interface BlenderTool {
  id: string;
  name: string;
  icon: string;
  shortcut?: string;
  description: string;
  category: 'modeling' | 'sculpting' | 'texturing' | 'animation' | 'rendering' | 'other';
}

export interface BlenderPanel {
  id: string;
  name: string;
  icon: string;
  content: React.ReactNode;
}

export interface Object3D {
  id: string;
  type: 'mesh' | 'light' | 'camera' | 'empty';
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  visible: boolean;
}

export interface Lesson {
  id: string;
  messages: {
    welcome: string;
    selectCube: string;
    deleteSelected?: string;
    moveObject?: string;
    complete: string;
    [key: string]: string | undefined;
  };
  objectives: string[];
  checkpoints: {
    selected: boolean;
    deleted?: boolean;
    moved?: boolean;
    [key: string]: boolean | undefined;
  };
}