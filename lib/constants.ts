// ═══════════════════════════════════════════════════════════
// AGON — Constants & Configuration
// ═══════════════════════════════════════════════════════════

export const APP_NAME = "AGON";
export const APP_VERSION = "0.1.0";
export const APP_TAGLINE = "Your 365-Day Transformation";

// ───────────────────────────────────────────────────────────
// Color Palette
// ───────────────────────────────────────────────────────────

export const colors = {
  background: "#050505",
  card: "#111111",
  cardHover: "#1A1A1A",
  gold: "#C9A84C",
  goldLight: "#E5D494",
  goldDark: "#8B7432",
  success: "#22C55E",
  danger: "#DC2626",
  dangerDark: "#8B0000",
  warning: "#F59E0B",
  textPrimary: "#F5F5F5",
  textSecondary: "#A3A3A3",
  textMuted: "#525252",
  border: "#1F1F1F",
  borderGold: "rgba(201, 168, 76, 0.3)",
} as const;

// ───────────────────────────────────────────────────────────
// Phases
// ───────────────────────────────────────────────────────────

export const PHASE_NAMES = [
  "Foundation",
  "Hypertrophy Push",
  "Advanced Hypertrophy",
  "The Cut",
] as const;

export type PhaseName = (typeof PHASE_NAMES)[number];

export const PHASE_WEEK_RANGES: readonly [number, number][] = [
  [1, 12],
  [13, 26],
  [27, 40],
  [41, 52],
] as const;

export const PHASES = PHASE_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  weekStart: PHASE_WEEK_RANGES[i][0],
  weekEnd: PHASE_WEEK_RANGES[i][1],
  totalWeeks: PHASE_WEEK_RANGES[i][1] - PHASE_WEEK_RANGES[i][0] + 1,
}));

// ───────────────────────────────────────────────────────────
// Accountability Levels
// ───────────────────────────────────────────────────────────

export const ACCOUNTABILITY_LEVELS = [
  { level: 1, label: "Recruit", description: "Just getting started", minStreak: 0 },
  { level: 2, label: "Warrior", description: "Building momentum", minStreak: 7 },
  { level: 3, label: "Gladiator", description: "Consistent and driven", minStreak: 21 },
  { level: 4, label: "Champion", description: "Unbreakable discipline", minStreak: 60 },
  { level: 5, label: "God of War", description: "Legendary status", minStreak: 120 },
] as const;

export type AccountabilityLevel = (typeof ACCOUNTABILITY_LEVELS)[number];

// ───────────────────────────────────────────────────────────
// Task Categories
// ───────────────────────────────────────────────────────────

export const TASK_CATEGORIES = [
  { id: "workout", label: "Workout", icon: "dumbbell" },
  { id: "nutrition", label: "Nutrition", icon: "utensils" },
  { id: "recovery", label: "Recovery", icon: "moon" },
  { id: "mindset", label: "Mindset", icon: "brain" },
  { id: "accountability", label: "Accountability", icon: "shield" },
  { id: "measurement", label: "Measurement", icon: "ruler" },
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number]["id"];

// ───────────────────────────────────────────────────────────
// Proof Types
// ───────────────────────────────────────────────────────────

export const PROOF_TYPES = [
  { id: "photo", label: "Photo", description: "Upload a progress photo" },
  { id: "video", label: "Video", description: "Upload a video clip" },
  { id: "screenshot", label: "Screenshot", description: "Screenshot of workout log or app" },
  { id: "manual", label: "Manual Entry", description: "Log data manually" },
  { id: "device_sync", label: "Device Sync", description: "Synced from fitness device" },
] as const;

export type ProofType = (typeof PROOF_TYPES)[number]["id"];

// ───────────────────────────────────────────────────────────
// Total Program Duration
// ───────────────────────────────────────────────────────────

export const TOTAL_DAYS = 365;
export const TOTAL_WEEKS = 52;
