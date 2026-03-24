// ═══════════════════════════════════════════════════════════
//  AGON — Drachma Currency Engine
//  The economic backbone of the transformation system
// ═══════════════════════════════════════════════════════════

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EarningSource = keyof typeof EARNING_TABLE;
export type BurningSource = keyof typeof BURNING_TABLE;
export type DrachmaSource = EarningSource | BurningSource;

export interface LedgerEntry {
  id: string;
  userId: string;
  amount: number;
  source: DrachmaSource;
  description: string;
  referenceId?: string;
  runningBalance: number;
  createdAt: string;
}

export interface DrachmaBalance {
  userId: string;
  current: number;
  cumulative: number;
  rank: RankInfo;
}

export interface RankInfo {
  number: number;
  name: string;
  threshold: number;
}

export interface RewardTier {
  name: "small" | "medium" | "large" | "epic" | "legendary";
  minCost: number;
  color: string;
}

export interface Reward {
  id: string;
  userId: string;
  name: string;
  description: string;
  externalLink?: string;
  category: RewardCategory;
  tier: RewardTier["name"];
  cost: number;
  images: string[];
  conditions: RewardConditions;
  isPriority: boolean;
  status: "active" | "forged" | "draft";
  forgedAt?: string;
  createdAt: string;
}

export type RewardCategory =
  | "gear"
  | "experience"
  | "food"
  | "travel"
  | "tech"
  | "custom";

export interface RewardConditions {
  minRank?: number;
  minStreak?: number;
  minHonor?: number;
  requiredAchievements?: string[];
}

export interface ForgeEligibility {
  eligible: boolean;
  reasons: string[];
}

export interface PriceSuggestion {
  suggestedPrice: number;
  tier: RewardTier["name"];
  reasoning: string;
  estimatedDays: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const EARNING_TABLE = {
  complete_all_daily_tasks: 15,
  workout_with_proof: 10,
  hit_protein_target: 5,
  hit_all_macros: 8,
  morning_confirm_fast: 3,
  evening_debrief: 3,
  seven_day_streak: 25,
  thirty_day_streak: 100,
  achievement_unlock: 20, // range: 20–80
  rank_up: 50,
  pr_on_lift: 15,
  perfect_honor_day: 10,
  weekly_compliance_90: 20,
} as const;

export const BURNING_TABLE = {
  missed_workout: -20,
  zero_compliance_day: -30,
  broken_streak: -15,
  sanction_triggered: -10,
  unfulfilled_sanction_48h: -25,
  honor_below_30: -20,
  task_skipped: -10,
  three_missed_days_row: -50,
  contract_unsigned_noon: -10,
  late_morning_30min: -5,
} as const;

export const EARNING_DESCRIPTIONS: Record<EarningSource, string> = {
  complete_all_daily_tasks: "Completed all daily tasks",
  workout_with_proof: "Workout completed with proof",
  hit_protein_target: "Hit protein target",
  hit_all_macros: "Hit all macro targets",
  morning_confirm_fast: "Morning fast confirmed",
  evening_debrief: "Evening debrief completed",
  seven_day_streak: "7-day streak bonus",
  thirty_day_streak: "30-day streak bonus",
  achievement_unlock: "Achievement unlocked",
  rank_up: "Rank promotion",
  pr_on_lift: "Personal record on lift",
  perfect_honor_day: "Perfect honor day",
  weekly_compliance_90: "Weekly compliance above 90%",
};

export const BURNING_DESCRIPTIONS: Record<BurningSource, string> = {
  missed_workout: "Missed workout",
  zero_compliance_day: "Zero compliance day",
  broken_streak: "Streak broken",
  sanction_triggered: "Sanction triggered",
  unfulfilled_sanction_48h: "Unfulfilled sanction (48h)",
  honor_below_30: "Honor score below 30",
  task_skipped: "Task skipped",
  three_missed_days_row: "Three missed days in a row",
  contract_unsigned_noon: "Contract unsigned by noon",
  late_morning_30min: "Late morning (30+ min)",
};

export const RANK_THRESHOLDS: { number: number; name: string; threshold: number }[] = [
  { number: 1, name: "Mortal", threshold: 0 },
  { number: 2, name: "Citizen", threshold: 100 },
  { number: 3, name: "Soldier", threshold: 300 },
  { number: 4, name: "Warrior", threshold: 600 },
  { number: 5, name: "Champion", threshold: 1000 },
  { number: 6, name: "Hero", threshold: 1500 },
  { number: 7, name: "Demigod", threshold: 2200 },
  { number: 8, name: "Titan", threshold: 3000 },
  { number: 9, name: "Olympian", threshold: 4000 },
  { number: 10, name: "Greek God", threshold: 5500 },
];

export const REWARD_TIERS: RewardTier[] = [
  { name: "small", minCost: 50, color: "#C0C0C0" },
  { name: "medium", minCost: 200, color: "#CD7F32" },
  { name: "large", minCost: 600, color: "#C9A84C" },
  { name: "epic", minCost: 2000, color: "#9B59B6" },
  { name: "legendary", minCost: 5000, color: "#00CED1" },
];

export const CATEGORY_ICONS: Record<RewardCategory, string> = {
  gear: "Dumbbell",
  experience: "Sparkles",
  food: "UtensilsCrossed",
  travel: "Plane",
  tech: "Monitor",
  custom: "Star",
};

const BALANCE_FLOOR = -500;

// ---------------------------------------------------------------------------
// In-memory store (mock — replace with DB in production)
// ---------------------------------------------------------------------------

const balances: Map<string, { current: number; cumulative: number }> = new Map();
const ledgers: Map<string, LedgerEntry[]> = new Map();
const rewards: Map<string, Reward> = new Map();

function ensureUser(userId: string) {
  if (!balances.has(userId)) {
    balances.set(userId, { current: 0, cumulative: 0 });
    ledgers.set(userId, []);
  }
}

// ---------------------------------------------------------------------------
// Core Functions
// ---------------------------------------------------------------------------

export function earnDrachma(
  userId: string,
  amount: number,
  source: EarningSource,
  referenceId?: string
): LedgerEntry {
  ensureUser(userId);
  const bal = balances.get(userId)!;

  const absAmount = Math.abs(amount);
  bal.current += absAmount;
  bal.cumulative += absAmount;

  const entry: LedgerEntry = {
    id: crypto.randomUUID(),
    userId,
    amount: absAmount,
    source,
    description: EARNING_DESCRIPTIONS[source],
    referenceId,
    runningBalance: bal.current,
    createdAt: new Date().toISOString(),
  };

  ledgers.get(userId)!.unshift(entry);
  return entry;
}

export function burnDrachma(
  userId: string,
  amount: number,
  source: BurningSource,
  referenceId?: string
): LedgerEntry {
  ensureUser(userId);
  const bal = balances.get(userId)!;

  const absAmount = Math.abs(amount);
  bal.current = Math.max(bal.current - absAmount, BALANCE_FLOOR);

  const entry: LedgerEntry = {
    id: crypto.randomUUID(),
    userId,
    amount: -absAmount,
    source,
    description: BURNING_DESCRIPTIONS[source],
    referenceId,
    runningBalance: bal.current,
    createdAt: new Date().toISOString(),
  };

  ledgers.get(userId)!.unshift(entry);
  return entry;
}

export function getBalance(userId: string): DrachmaBalance {
  ensureUser(userId);
  const bal = balances.get(userId)!;
  return {
    userId,
    current: bal.current,
    cumulative: bal.cumulative,
    rank: getRank(bal.cumulative),
  };
}

export function getLedger(userId: string, limit: number = 50): LedgerEntry[] {
  ensureUser(userId);
  return ledgers.get(userId)!.slice(0, limit);
}

// ---------------------------------------------------------------------------
// Rank System
// ---------------------------------------------------------------------------

export function getRank(cumulativeHonor: number): RankInfo {
  let rank = RANK_THRESHOLDS[0];
  for (const r of RANK_THRESHOLDS) {
    if (cumulativeHonor >= r.threshold) {
      rank = r;
    } else {
      break;
    }
  }
  return rank;
}

export function getNextRank(currentRankNumber: number): RankInfo | null {
  const next = RANK_THRESHOLDS.find((r) => r.number === currentRankNumber + 1);
  return next ?? null;
}

// ---------------------------------------------------------------------------
// Reward Forge
// ---------------------------------------------------------------------------

export function canForgeReward(
  userId: string,
  rewardId: string,
  userStreak: number = 0,
  userHonor: number = 100,
  userAchievements: string[] = []
): ForgeEligibility {
  ensureUser(userId);
  const reward = rewards.get(rewardId);
  if (!reward) {
    return { eligible: false, reasons: ["Reward not found"] };
  }

  const bal = balances.get(userId)!;
  const rank = getRank(bal.cumulative);
  const reasons: string[] = [];

  if (bal.current < reward.cost) {
    reasons.push(
      `Need ${reward.cost}₯, have ${bal.current}₯ (${reward.cost - bal.current}₯ short)`
    );
  }

  if (reward.conditions.minRank && rank.number < reward.conditions.minRank) {
    const needed = RANK_THRESHOLDS.find((r) => r.number === reward.conditions.minRank);
    reasons.push(`Requires rank ${needed?.name ?? reward.conditions.minRank}`);
  }

  if (reward.conditions.minStreak && userStreak < reward.conditions.minStreak) {
    reasons.push(
      `Requires ${reward.conditions.minStreak}-day streak (current: ${userStreak})`
    );
  }

  if (reward.conditions.minHonor && userHonor < reward.conditions.minHonor) {
    reasons.push(
      `Requires ${reward.conditions.minHonor} honor (current: ${userHonor})`
    );
  }

  if (reward.conditions.requiredAchievements) {
    const missing = reward.conditions.requiredAchievements.filter(
      (a) => !userAchievements.includes(a)
    );
    if (missing.length > 0) {
      reasons.push(`Missing achievements: ${missing.join(", ")}`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export function forgeReward(userId: string, rewardId: string): Reward | null {
  ensureUser(userId);
  const reward = rewards.get(rewardId);
  if (!reward) return null;

  const bal = balances.get(userId)!;
  if (bal.current < reward.cost) return null;

  // Deduct cost
  bal.current -= reward.cost;

  // Create ledger entry for the purchase
  const entry: LedgerEntry = {
    id: crypto.randomUUID(),
    userId,
    amount: -reward.cost,
    source: "complete_all_daily_tasks", // will display as forge purchase via description override
    description: `Forged: ${reward.name}`,
    referenceId: rewardId,
    runningBalance: bal.current,
    createdAt: new Date().toISOString(),
  };
  ledgers.get(userId)!.unshift(entry);

  // Mark reward as forged
  reward.status = "forged";
  reward.forgedAt = new Date().toISOString();
  rewards.set(rewardId, reward);

  return reward;
}

// ---------------------------------------------------------------------------
// Reward CRUD (mock)
// ---------------------------------------------------------------------------

export function getRewards(userId: string): Reward[] {
  return Array.from(rewards.values()).filter((r) => r.userId === userId);
}

export function getRewardById(rewardId: string): Reward | null {
  return rewards.get(rewardId) ?? null;
}

export function createReward(reward: Omit<Reward, "id" | "createdAt">): Reward {
  const newReward: Reward = {
    ...reward,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  rewards.set(newReward.id, newReward);
  return newReward;
}

// ---------------------------------------------------------------------------
// Price Suggestion
// ---------------------------------------------------------------------------

export function suggestPrice(
  name: string,
  description: string
): PriceSuggestion {
  const text = `${name} ${description}`.toLowerCase();

  // Simple heuristic based on keywords
  let tier: RewardTier["name"] = "small";
  let basePrice = 75;

  const epicKeywords = ["vacation", "trip", "weekend", "getaway", "retreat", "luxury"];
  const largeKeywords = ["shoes", "sneakers", "jacket", "watch", "headphones", "supplement"];
  const mediumKeywords = ["earbuds", "shirt", "meal", "dinner", "lunch", "book", "gear"];
  const legendaryKeywords = ["car", "rolex", "vacation abroad", "international", "dream"];

  if (legendaryKeywords.some((k) => text.includes(k))) {
    tier = "legendary";
    basePrice = 5000 + Math.floor(Math.random() * 3000);
  } else if (epicKeywords.some((k) => text.includes(k))) {
    tier = "epic";
    basePrice = 2000 + Math.floor(Math.random() * 1500);
  } else if (largeKeywords.some((k) => text.includes(k))) {
    tier = "large";
    basePrice = 600 + Math.floor(Math.random() * 400);
  } else if (mediumKeywords.some((k) => text.includes(k))) {
    tier = "medium";
    basePrice = 200 + Math.floor(Math.random() * 200);
  } else {
    tier = "small";
    basePrice = 50 + Math.floor(Math.random() * 100);
  }

  // Round to nearest 25
  const suggestedPrice = Math.round(basePrice / 25) * 25;

  const avgDailyEarning = 25; // rough estimate
  const estimatedDays = Math.ceil(suggestedPrice / avgDailyEarning);

  const tierDescriptions: Record<RewardTier["name"], string> = {
    small: "A modest reward for consistent effort — keep the momentum.",
    medium: "A meaningful milestone marker — earned through sustained discipline.",
    large: "A significant prize — requires real dedication and consistency.",
    epic: "An epic reward — only champions of the forge reach this tier.",
    legendary: "A legendary conquest — reserved for those who transcend limits.",
  };

  return {
    suggestedPrice,
    tier,
    reasoning: tierDescriptions[tier],
    estimatedDays,
  };
}

// ---------------------------------------------------------------------------
// Seed mock data (for demo)
// ---------------------------------------------------------------------------

export function seedMockData(userId: string) {
  ensureUser(userId);

  // Give the user some starting balance
  earnDrachma(userId, 15, "complete_all_daily_tasks");
  earnDrachma(userId, 10, "workout_with_proof");
  earnDrachma(userId, 5, "hit_protein_target");
  earnDrachma(userId, 25, "seven_day_streak");
  earnDrachma(userId, 10, "pr_on_lift");
  earnDrachma(userId, 3, "morning_confirm_fast");
  earnDrachma(userId, 8, "hit_all_macros");
  earnDrachma(userId, 20, "weekly_compliance_90");
  earnDrachma(userId, 50, "rank_up");
  earnDrachma(userId, 10, "perfect_honor_day");
  earnDrachma(userId, 3, "evening_debrief");
  earnDrachma(userId, 15, "complete_all_daily_tasks");
  earnDrachma(userId, 10, "workout_with_proof");
  earnDrachma(userId, 5, "hit_protein_target");
  burnDrachma(userId, 5, "late_morning_30min");
  earnDrachma(userId, 20, "achievement_unlock");
  earnDrachma(userId, 15, "pr_on_lift");
  earnDrachma(userId, 10, "workout_with_proof");
  burnDrachma(userId, 10, "task_skipped");

  // Create mock rewards
  createReward({
    userId,
    name: "Wireless Earbuds",
    description: "Premium wireless earbuds for training sessions",
    externalLink: "https://example.com/earbuds",
    category: "tech",
    tier: "medium",
    cost: 200,
    images: [],
    conditions: {},
    isPriority: false,
    status: "active",
  });

  createReward({
    userId,
    name: "New Training Shoes",
    description: "Performance training shoes for the gym",
    externalLink: "https://example.com/shoes",
    category: "gear",
    tier: "large",
    cost: 600,
    images: [],
    conditions: { minRank: 3 },
    isPriority: true,
    status: "active",
  });

  createReward({
    userId,
    name: "Steak Dinner",
    description: "A premium steak dinner to celebrate your gains",
    category: "food",
    tier: "small",
    cost: 100,
    images: [],
    conditions: {},
    isPriority: false,
    status: "active",
  });

  createReward({
    userId,
    name: "Weekend Trip",
    description: "A weekend getaway to recharge and celebrate progress",
    category: "travel",
    tier: "epic",
    cost: 2000,
    images: [],
    conditions: { minRank: 5, minStreak: 30 },
    isPriority: false,
    status: "active",
  });
}
