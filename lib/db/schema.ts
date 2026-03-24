import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  time,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ──────────────────────────────────────────────────────────────────────

export const accountabilityLevelEnum = pgEnum("accountability_level", [
  "firm",
  "drill_sergeant",
  "emotional_warfare",
]);

export const taskCategoryEnum = pgEnum("task_category", [
  "workout",
  "nutrition",
  "habit",
  "mindset",
  "custom",
]);

export const proofTypeEnum = pgEnum("proof_type", [
  "photo",
  "text",
  "check_in",
  "none",
]);

export const sanctionTriggerEnum = pgEnum("sanction_trigger", [
  "missed_workout",
  "missed_meal",
  "broken_streak",
  "low_honor",
  "missed_two_days",
  "bad_habit_excess",
]);

export const habitTypeEnum = pgEnum("habit_type", ["good", "bad"]);

export const habitCategoryEnum = pgEnum("habit_category", [
  "fitness",
  "nutrition",
  "mindset",
  "productivity",
  "recovery",
  "social",
  "custom",
]);

export const habitFrequencyEnum = pgEnum("habit_frequency", [
  "daily",
  "weekly",
  "per_occurrence",
]);

export const habitSourceEnum = pgEnum("habit_source", ["user", "agon"]);

export const habitLogContextEnum = pgEnum("habit_log_context", [
  "manual",
  "confession",
  "auto",
]);

export const mealSourceEnum = pgEnum("meal_source", [
  "manual",
  "photo_ai",
  "quick_select",
]);

export const drachmaTypeEnum = pgEnum("drachma_type", [
  "earn",
  "burn",
  "purchase",
  "bonus",
  "penalty",
]);

export const rewardCategoryEnum = pgEnum("reward_category", [
  "gear",
  "food",
  "experience",
  "tech",
  "self_care",
  "other",
]);

export const rewardTierEnum = pgEnum("reward_tier", [
  "small",
  "medium",
  "large",
  "epic",
  "legendary",
]);

export const rewardStatusEnum = pgEnum("reward_status", [
  "draft",
  "active",
  "forged",
  "archived",
]);

export const rewardMediaTypeEnum = pgEnum("reward_media_type", [
  "image",
  "video",
  "url_extracted",
]);

export const behaviorPatternTypeEnum = pgEnum("behavior_pattern_type", [
  "skip_day",
  "late_workout",
  "missed_nutrition",
  "strong_compliance",
  "motivation_dip",
  "pr_streak",
  "weekend_weakness",
  "evening_snacking",
  "bad_habit_spike",
]);

export const whyTypeEnum = pgEnum("why_type", [
  "text",
  "voice_note",
  "photo",
  "letter",
]);

export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant"]);

export const chatContextEnum = pgEnum("chat_context", [
  "morning",
  "evening",
  "check_in",
  "general",
]);

// ── Tables ─────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  avatarUrl: varchar("avatar_url", { length: 512 }),
  startDate: date("start_date"),
  targetDate: date("target_date"),
  startingWeight: decimal("starting_weight", { precision: 5, scale: 2 }),
  currentWeight: decimal("current_weight", { precision: 5, scale: 2 }),
  height: decimal("height", { precision: 5, scale: 2 }),
  targetWeight: decimal("target_weight", { precision: 5, scale: 2 }),
  targetBodyFat: decimal("target_body_fat", { precision: 4, scale: 1 }),
  timezone: varchar("timezone", { length: 100 }).default("Europe/Paris"),
  wakeUpTime: time("wake_up_time").default("05:00"),
  accountabilityLevel: accountabilityLevelEnum("accountability_level").default(
    "emotional_warfare"
  ),
  voiceId: varchar("voice_id", { length: 255 }),
  drachmaBalance: integer("drachma_balance").default(0),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyContracts = pgTable("daily_contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  signed: boolean("signed").default(false),
  signedAt: timestamp("signed_at"),
  honorScore: integer("honor_score"),
  aiMorningMessage: text("ai_morning_message"),
  aiEveningDebrief: text("ai_evening_debrief"),
  rating: integer("rating"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => dailyContracts.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  category: taskCategoryEnum("category"),
  description: text("description"),
  deadline: timestamp("deadline"),
  proofRequired: boolean("proof_required").default(true),
  proofType: proofTypeEnum("proof_type").default("none"),
  proofUrl: varchar("proof_url", { length: 512 }),
  proofText: text("proof_text"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  skipped: boolean("skipped").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sanctions = pgTable("sanctions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  triggerType: sanctionTriggerEnum("trigger_type"),
  sanctionDescription: text("sanction_description"),
  triggered: boolean("triggered").default(false),
  triggeredAt: timestamp("triggered_at"),
  fulfilled: boolean("fulfilled").default(false),
  fulfilledProofUrl: varchar("fulfilled_proof_url", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bodyStats = pgTable("body_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date("date"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  bodyFatEstimate: decimal("body_fat_estimate", { precision: 4, scale: 1 }),
  waistCm: decimal("waist_cm", { precision: 5, scale: 1 }),
  shouldersCm: decimal("shoulders_cm", { precision: 5, scale: 1 }),
  chestCm: decimal("chest_cm", { precision: 5, scale: 1 }),
  armsCm: decimal("arms_cm", { precision: 5, scale: 1 }),
  legsCm: decimal("legs_cm", { precision: 5, scale: 1 }),
  progressPhotoFront: varchar("progress_photo_front", { length: 512 }),
  progressPhotoSide: varchar("progress_photo_side", { length: 512 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const streaks = pgTable("streaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastCompletedDate: date("last_completed_date"),
  totalDaysCompleted: integer("total_days_completed").default(0),
  totalDaysMissed: integer("total_days_missed").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const whyVault = pgTable("why_vault", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: whyTypeEnum("type"),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  mediaUrl: varchar("media_url", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: chatRoleEnum("role"),
  content: text("content"),
  context: chatContextEnum("context").default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workoutLogs = pgTable("workout_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date("date"),
  phase: integer("phase"),
  week: integer("week"),
  dayType: varchar("day_type", { length: 100 }),
  exercises: jsonb("exercises").$type<
    {
      name: string;
      sets: { reps: number; weight: number; rpe: number }[];
    }[]
  >(),
  durationMinutes: integer("duration_minutes"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  type: habitTypeEnum("type").notNull(),
  category: habitCategoryEnum("category"),
  drachmaReward: integer("drachma_reward").default(0),
  frequency: habitFrequencyEnum("frequency").default("daily"),
  targetCount: integer("target_count").default(1),
  unit: varchar("unit", { length: 50 }),
  source: habitSourceEnum("source").default("user"),
  phaseSpecific: integer("phase_specific"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habitLogs = pgTable("habit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  habitId: uuid("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).default("1"),
  context: habitLogContextEnum("context").default("manual"),
  notes: text("notes"),
  drachmaApplied: integer("drachma_applied").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealLogs = pgTable("meal_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  mealNumber: integer("meal_number"),
  description: text("description"),
  photoUrl: varchar("photo_url", { length: 512 }),
  calories: decimal("calories", { precision: 7, scale: 1 }),
  protein: decimal("protein", { precision: 6, scale: 1 }),
  fat: decimal("fat", { precision: 6, scale: 1 }),
  carbs: decimal("carbs", { precision: 6, scale: 1 }),
  source: mealSourceEnum("source").default("manual"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const drachmaLedger = pgTable("drachma_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  type: drachmaTypeEnum("type").notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  referenceId: varchar("reference_id", { length: 255 }),
  balanceAfter: integer("balance_after").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: rewardCategoryEnum("category"),
  drachmaCost: integer("drachma_cost").notNull(),
  tier: rewardTierEnum("tier"),
  isPriority: boolean("is_priority").default(false),
  status: rewardStatusEnum("status").default("active"),
  externalUrl: varchar("external_url", { length: 1024 }),
  extractedTitle: varchar("extracted_title", { length: 255 }),
  extractedPrice: varchar("extracted_price", { length: 100 }),
  minRank: integer("min_rank"),
  minStreak: integer("min_streak"),
  minAchievement: varchar("min_achievement", { length: 255 }),
  phaseRestriction: jsonb("phase_restriction").$type<number[]>(),
  aiPriceReasoning: text("ai_price_reasoning"),
  aiMotivationalNote: text("ai_motivational_note"),
  forgedAt: timestamp("forged_at"),
  aiForgeComment: text("ai_forge_comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rewardMedia = pgTable("reward_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  rewardId: uuid("reward_id")
    .notNull()
    .references(() => rewards.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: rewardMediaTypeEnum("type").notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 1024 }),
  originalFilename: varchar("original_filename", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  sizeBytes: integer("size_bytes"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const behaviorPatterns = pgTable("behavior_patterns", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  patternType: behaviorPatternTypeEnum("pattern_type").notNull(),
  frequency: integer("frequency").default(0),
  lastOccurred: timestamp("last_occurred"),
  dayOfWeekDistribution: jsonb("day_of_week_distribution"),
  contextNotes: text("context_notes"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const weeklyReports = pgTable("weekly_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  weekNumber: integer("week_number").notNull(),
  reportContent: text("report_content"),
  complianceScore: integer("compliance_score"),
  patternsIdentified: jsonb("patterns_identified"),
  predictions: jsonb("predictions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementId: varchar("achievement_id", { length: 255 }).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const userRanks = pgTable("user_ranks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  currentRank: integer("current_rank").default(1),
  cumulativeHonor: integer("cumulative_honor").default(0),
  rankHistory: jsonb("rank_history"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Relations ──────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many, one }) => ({
  dailyContracts: many(dailyContracts),
  tasks: many(tasks),
  sanctions: many(sanctions),
  bodyStats: many(bodyStats),
  streak: one(streaks),
  whyVault: many(whyVault),
  chatMessages: many(chatMessages),
  workoutLogs: many(workoutLogs),
  habits: many(habits),
  habitLogs: many(habitLogs),
  mealLogs: many(mealLogs),
  drachmaLedger: many(drachmaLedger),
  rewards: many(rewards),
  behaviorPatterns: many(behaviorPatterns),
  weeklyReports: many(weeklyReports),
  achievements: many(achievements),
  rank: one(userRanks),
}));

export const dailyContractsRelations = relations(
  dailyContracts,
  ({ one, many }) => ({
    user: one(users, {
      fields: [dailyContracts.userId],
      references: [users.id],
    }),
    tasks: many(tasks),
  })
);

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  contract: one(dailyContracts, {
    fields: [tasks.contractId],
    references: [dailyContracts.id],
  }),
}));

export const sanctionsRelations = relations(sanctions, ({ one }) => ({
  user: one(users, {
    fields: [sanctions.userId],
    references: [users.id],
  }),
}));

export const bodyStatsRelations = relations(bodyStats, ({ one }) => ({
  user: one(users, {
    fields: [bodyStats.userId],
    references: [users.id],
  }),
}));

export const streaksRelations = relations(streaks, ({ one }) => ({
  user: one(users, {
    fields: [streaks.userId],
    references: [users.id],
  }),
}));

export const whyVaultRelations = relations(whyVault, ({ one }) => ({
  user: one(users, {
    fields: [whyVault.userId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const workoutLogsRelations = relations(workoutLogs, ({ one }) => ({
  user: one(users, {
    fields: [workoutLogs.userId],
    references: [users.id],
  }),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, { fields: [habits.userId], references: [users.id] }),
  logs: many(habitLogs),
}));

export const habitLogsRelations = relations(habitLogs, ({ one }) => ({
  user: one(users, { fields: [habitLogs.userId], references: [users.id] }),
  habit: one(habits, { fields: [habitLogs.habitId], references: [habits.id] }),
}));

export const mealLogsRelations = relations(mealLogs, ({ one }) => ({
  user: one(users, { fields: [mealLogs.userId], references: [users.id] }),
}));

export const drachmaLedgerRelations = relations(drachmaLedger, ({ one }) => ({
  user: one(users, { fields: [drachmaLedger.userId], references: [users.id] }),
}));

export const rewardsRelations = relations(rewards, ({ one, many }) => ({
  user: one(users, { fields: [rewards.userId], references: [users.id] }),
  media: many(rewardMedia),
}));

export const rewardMediaRelations = relations(rewardMedia, ({ one }) => ({
  reward: one(rewards, { fields: [rewardMedia.rewardId], references: [rewards.id] }),
  user: one(users, { fields: [rewardMedia.userId], references: [users.id] }),
}));

export const behaviorPatternsRelations = relations(behaviorPatterns, ({ one }) => ({
  user: one(users, { fields: [behaviorPatterns.userId], references: [users.id] }),
}));

export const weeklyReportsRelations = relations(weeklyReports, ({ one }) => ({
  user: one(users, { fields: [weeklyReports.userId], references: [users.id] }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, { fields: [achievements.userId], references: [users.id] }),
}));

export const userRanksRelations = relations(userRanks, ({ one }) => ({
  user: one(users, { fields: [userRanks.userId], references: [users.id] }),
}));
