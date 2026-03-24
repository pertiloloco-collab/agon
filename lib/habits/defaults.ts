// ═══════════════════════════════════════════════════════════
// AGON — Default Habit Definitions
// ═══════════════════════════════════════════════════════════

export type HabitType = "good" | "bad";

export type HabitCategory =
  | "fitness"
  | "nutrition"
  | "recovery"
  | "mindset"
  | "productivity"
  | "social"
  | "custom";

export type HabitFrequency = "daily" | "weekly" | "per_occurrence";

export type HabitSource = "agon" | "custom";

export interface AgonHabit {
  id: string;
  name: string;
  icon: string;
  type: HabitType;
  category: HabitCategory;
  drachma: number;
  frequency: HabitFrequency;
  target?: number;
  unit?: string;
  description: string;
  allPhases: boolean;
  phases?: number[];
  source: HabitSource;
}

// ───────────────────────────────────────────────────────────
// Good Habits — Earn Drachma
// ───────────────────────────────────────────────────────────

const GOOD_HABITS: AgonHabit[] = [
  {
    id: "agon-stomach-vacuum",
    name: "Stomach Vacuum",
    icon: "\uD83D\uDCA8",
    type: "good",
    category: "fitness",
    drachma: 3,
    frequency: "daily",
    description: "Practice stomach vacuum holds to strengthen the transverse abdominis and tighten your waistline.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-10k-steps",
    name: "10,000 Steps",
    icon: "\uD83D\uDEB6",
    type: "good",
    category: "fitness",
    drachma: 5,
    frequency: "daily",
    target: 10000,
    unit: "steps",
    description: "Hit your daily step target. Non-negotiable movement baseline.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-stretching",
    name: "Stretching/Mobility",
    icon: "\uD83E\uDDD8",
    type: "good",
    category: "recovery",
    drachma: 3,
    frequency: "daily",
    target: 10,
    unit: "minutes",
    description: "Dedicated mobility work to prevent injury and improve range of motion.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-protein-target",
    name: "Hit Protein Target 160g+",
    icon: "\uD83E\uDD69",
    type: "good",
    category: "nutrition",
    drachma: 5,
    frequency: "daily",
    target: 160,
    unit: "grams",
    description: "Consume at least 160g of protein to fuel muscle growth and recovery.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-water-3l",
    name: "Drink 3L Water",
    icon: "\uD83D\uDCA7",
    type: "good",
    category: "nutrition",
    drachma: 3,
    frequency: "daily",
    target: 3,
    unit: "liters",
    description: "Stay fully hydrated. Minimum 3 liters of water throughout the day.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-creatine",
    name: "Take Creatine 5g",
    icon: "\uD83D\uDC8A",
    type: "good",
    category: "nutrition",
    drachma: 2,
    frequency: "daily",
    description: "Daily 5g creatine monohydrate. Consistency is king.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-sleep",
    name: "Sleep 7-9 Hours",
    icon: "\uD83D\uDE34",
    type: "good",
    category: "recovery",
    drachma: 5,
    frequency: "daily",
    target: 7,
    unit: "hours",
    description: "Get quality sleep. Your muscles grow when you rest, warrior.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-no-phone-bed",
    name: "No Phone 30 Min Before Bed",
    icon: "\uD83D\uDCF5",
    type: "good",
    category: "recovery",
    drachma: 3,
    frequency: "daily",
    description: "Put the device down. Blue light destroys your sleep quality.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-read-learn",
    name: "Read/Learn 20 Min",
    icon: "\uD83D\uDCD6",
    type: "good",
    category: "mindset",
    drachma: 3,
    frequency: "daily",
    target: 20,
    unit: "minutes",
    description: "Feed your mind. Read, study, or learn something valuable every day.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-cold-shower",
    name: "Cold Shower",
    icon: "\uD83E\uDD76",
    type: "good",
    category: "mindset",
    drachma: 5,
    frequency: "daily",
    description: "Embrace discomfort. Cold exposure builds mental fortitude and aids recovery.",
    allPhases: true,
    source: "agon",
  },
  // Phase-specific habits (The Cut — Phase 4)
  {
    id: "agon-track-meals",
    name: "Track All Meals",
    icon: "\uD83D\uDCDD",
    type: "good",
    category: "nutrition",
    drachma: 5,
    frequency: "daily",
    description: "Log every single meal. During the cut, precision is everything.",
    allPhases: false,
    phases: [4],
    source: "agon",
  },
  {
    id: "agon-post-lift-cardio",
    name: "Post-Lift Cardio LISS",
    icon: "\uD83C\uDFC3",
    type: "good",
    category: "fitness",
    drachma: 5,
    frequency: "per_occurrence",
    description: "20-40 minutes of low-intensity steady-state cardio after lifting. Burn fat, preserve muscle.",
    allPhases: false,
    phases: [4],
    source: "agon",
  },
  {
    id: "agon-fasted-walk",
    name: "Fasted Morning Walk",
    icon: "\uD83C\uDF05",
    type: "good",
    category: "fitness",
    drachma: 5,
    frequency: "per_occurrence",
    description: "Walk 20-30 minutes fasted in the morning. Sunrise exposure + fat oxidation.",
    allPhases: false,
    phases: [4],
    source: "agon",
  },
];

// ───────────────────────────────────────────────────────────
// Bad Habits — Burn Drachma
// ───────────────────────────────────────────────────────────

const BAD_HABITS: AgonHabit[] = [
  {
    id: "agon-junk-food",
    name: "Ate Junk Food",
    icon: "\uD83C\uDF54",
    type: "bad",
    category: "nutrition",
    drachma: -10,
    frequency: "per_occurrence",
    description: "Processed garbage has no place in your transformation.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-alcohol",
    name: "Drank Alcohol",
    icon: "\uD83C\uDF7A",
    type: "bad",
    category: "nutrition",
    drachma: -15,
    frequency: "per_occurrence",
    description: "Alcohol destroys testosterone, sleep quality, and muscle protein synthesis.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-skipped-meal",
    name: "Skipped Meal/Under-ate",
    icon: "\u23ED\uFE0F",
    type: "bad",
    category: "nutrition",
    drachma: -8,
    frequency: "per_occurrence",
    description: "Under-eating sabotages your gains. You cannot build from nothing.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-stayed-up-late",
    name: "Stayed Up Past Midnight",
    icon: "\uD83E\uDD89",
    type: "bad",
    category: "recovery",
    drachma: -8,
    frequency: "per_occurrence",
    description: "Late nights destroy recovery and hormonal balance. Get to bed.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-phone-scroll",
    name: "Scrolled Phone 2+ Hours",
    icon: "\uD83D\uDCF1",
    type: "bad",
    category: "productivity",
    drachma: -5,
    frequency: "per_occurrence",
    description: "Mindless scrolling steals your time and focus. Be intentional.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-skipped-workout",
    name: "Skipped Workout No Reason",
    icon: "\uD83D\uDECB\uFE0F",
    type: "bad",
    category: "fitness",
    drachma: -20,
    frequency: "per_occurrence",
    description: "No valid excuse? This is the heaviest penalty. Show up.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-sugar-binge",
    name: "Sugar Binge",
    icon: "\uD83C\uDF70",
    type: "bad",
    category: "nutrition",
    drachma: -12,
    frequency: "per_occurrence",
    description: "Sugar spikes insulin, stores fat, and kills discipline. Cut it.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-smoked",
    name: "Smoked/Vaped",
    icon: "\uD83D\uDEAC",
    type: "bad",
    category: "recovery",
    drachma: -15,
    frequency: "per_occurrence",
    description: "Poisons your lungs, wrecks your cardio, and ages you. Stop.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-complained",
    name: "Complained/Made Excuses",
    icon: "\uD83D\uDE24",
    type: "bad",
    category: "mindset",
    drachma: -5,
    frequency: "per_occurrence",
    description: "Excuses are the currency of the weak. Own your situation.",
    allPhases: true,
    source: "agon",
  },
  {
    id: "agon-compared-self",
    name: "Compared Self Negatively",
    icon: "\uD83D\uDC40",
    type: "bad",
    category: "mindset",
    drachma: -3,
    frequency: "per_occurrence",
    description: "Your only competition is who you were yesterday. Stay in your lane.",
    allPhases: true,
    source: "agon",
  },
];

// ───────────────────────────────────────────────────────────
// Combined Export
// ───────────────────────────────────────────────────────────

export const AGON_DEFAULT_HABITS: AgonHabit[] = [...GOOD_HABITS, ...BAD_HABITS];

export const HABIT_CATEGORIES: { id: HabitCategory; label: string; icon: string }[] = [
  { id: "fitness", label: "Fitness", icon: "\uD83C\uDFCB\uFE0F" },
  { id: "nutrition", label: "Nutrition", icon: "\uD83E\uDD57" },
  { id: "recovery", label: "Recovery", icon: "\uD83D\uDE34" },
  { id: "mindset", label: "Mindset", icon: "\uD83E\uDDE0" },
  { id: "productivity", label: "Productivity", icon: "\u26A1" },
  { id: "custom", label: "Custom", icon: "\u2728" },
];
