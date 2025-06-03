import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserProgress, Skill } from './types';

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  currentSkill: string | null;
  currentExercise: string | null;
  worldMapOpen: boolean;
  blenderInterfaceVisible: boolean;
  showLoginModal: boolean;
  showSignupModal: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  setCurrentSkill: (skillId: string | null) => void;
  setCurrentExercise: (exerciseId: string | null) => void;
  toggleWorldMap: () => void;
  toggleBlenderInterface: () => void;
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      currentSkill: null,
      currentExercise: null,
      worldMapOpen: false,
      blenderInterfaceVisible: false,
      showLoginModal: false,
      showSignupModal: false,
      
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      
      login: async (email, password) => {
        // Mock implementation
        // In a real app, this would call an API
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const mockUser: User = {
            id: '1',
            username: 'learner',
            email,
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=learner',
            progress: {
              currentLesson: 'intro-1',
              completedLessons: [],
              skills: {
                'basics': {
                  id: 'basics',
                  level: 1,
                  completed: false,
                  exercises: [
                    { id: 'basics-1', completed: false, score: 0 },
                    { id: 'basics-2', completed: false, score: 0 },
                  ]
                }
              },
              skillPoints: 0,
              streak: 0,
              lastActive: new Date()
            },
            stats: {
              daysActive: 1,
              totalPoints: 0,
              longestStreak: 0,
              achievements: []
            },
            createdAt: new Date()
          };
          
          set({ user: mockUser, isLoggedIn: true });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      signup: async (username, email, password) => {
        // Mock implementation
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const mockUser: User = {
            id: '1',
            username,
            email,
            avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
            progress: {
              currentLesson: 'intro-1',
              completedLessons: [],
              skills: {
                'basics': {
                  id: 'basics',
                  level: 0,
                  completed: false,
                  exercises: [
                    { id: 'basics-1', completed: false, score: 0 },
                    { id: 'basics-2', completed: false, score: 0 },
                  ]
                }
              },
              skillPoints: 0,
              streak: 0,
              lastActive: new Date()
            },
            stats: {
              daysActive: 1,
              totalPoints: 0,
              longestStreak: 0,
              achievements: []
            },
            createdAt: new Date()
          };
          
          set({ user: mockUser, isLoggedIn: true });
          return true;
        } catch (error) {
          console.error('Signup error:', error);
          return false;
        }
      },
      
      logout: () => set({ user: null, isLoggedIn: false }),
      
      updateUserProgress: (progress) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            progress: {
              ...user.progress,
              ...progress
            }
          }
        });
      },
      
      setCurrentSkill: (skillId) => set({ currentSkill: skillId }),
      setCurrentExercise: (exerciseId) => set({ currentExercise: exerciseId }),
      toggleWorldMap: () => set((state) => ({ worldMapOpen: !state.worldMapOpen })),
      toggleBlenderInterface: () => set((state) => ({ blenderInterfaceVisible: !state.blenderInterfaceVisible })),
      setShowLoginModal: (show) => set({ showLoginModal: show }),
      setShowSignupModal: (show) => set({ showSignupModal: show }),
    }),
    {
      name: 'blender-learn-storage',
    }
  )
);