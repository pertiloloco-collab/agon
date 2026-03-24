import { create } from "zustand";

interface UserState {
  // User data
  userId: string | null;
  name: string | null;
  startDate: string | null;
  currentWeight: number | null;
  targetWeight: number | null;

  // Training info
  dayNumber: number;
  phase: number;
  phaseName: string;
  weekInProgram: number;
  isRestDay: boolean;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  honorScore: number;

  // UI state
  isMorningProtocolActive: boolean;
  isDebriefActive: boolean;
  sidebarOpen: boolean;

  // Actions
  setUser: (user: Partial<UserState>) => void;
  setTrainingInfo: (info: Partial<UserState>) => void;
  setSidebarOpen: (open: boolean) => void;
  setMorningProtocol: (active: boolean) => void;
  setDebrief: (active: boolean) => void;
  reset: () => void;
}

const initialState = {
  userId: null,
  name: null,
  startDate: null,
  currentWeight: null,
  targetWeight: null,
  dayNumber: 1,
  phase: 1,
  phaseName: "Foundation",
  weekInProgram: 1,
  isRestDay: false,
  currentStreak: 0,
  longestStreak: 0,
  honorScore: 0,
  isMorningProtocolActive: false,
  isDebriefActive: false,
  sidebarOpen: true,
};

export const useAppStore = create<UserState>((set) => ({
  ...initialState,
  setUser: (user) => set((state) => ({ ...state, ...user })),
  setTrainingInfo: (info) => set((state) => ({ ...state, ...info })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMorningProtocol: (active) => set({ isMorningProtocolActive: active }),
  setDebrief: (active) => set({ isDebriefActive: active }),
  reset: () => set(initialState),
}));
