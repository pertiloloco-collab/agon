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
