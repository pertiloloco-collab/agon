// ═══════════════════════════════════════════════════════════
// AGON — Smart Notification Triggers
// Context-aware notifications that adapt to user behavior
// ═══════════════════════════════════════════════════════════

export type NotificationTrigger =
  | "morning_wake"
  | "unsigned_contract"
  | "midday_no_tasks"
  | "deadline_approaching"
  | "weak_day_warning"
  | "streak_milestone"
  | "reward_proximity"
  | "sleep_reminder";

export type Urgency = "low" | "medium" | "high" | "critical";

export interface ActiveNotification {
  trigger: NotificationTrigger;
  message: string;
  urgency: Urgency;
}

export interface UserContext {
  currentHour: number;
  wakeUpTime: string; // "HH:MM"
  hasSignedContract: boolean;
  tasksCompletedToday: number;
  totalTasksToday: number;
  currentStreak: number;
  honorScore: number;
  deadlines: { name: string; daysUntil: number }[];
  weakDays: number[]; // day-of-week numbers (0=Sun) with historically low compliance
  todayDayOfWeek: number;
  sleepTargetHour: number;
  drachmaBalance: number;
  nextRewardCost: number;
  workoutCompletedToday: boolean;
}

/**
 * Multiple message templates per trigger for variety.
 * A random template is selected each time.
 */
export const NOTIFICATION_TEMPLATES: Record<NotificationTrigger, string[]> = {
  morning_wake: [
    "Day starts now. No snooze, no excuse.",
    "Eyes open. Feet on the floor. War begins.",
    "The alarm is a contract. Get up.",
    "Rise. Your future self is watching.",
  ],
  unsigned_contract: [
    "Your contract is unsigned. Without commitment, there is no transformation.",
    "Sign the contract. Words without signatures are just noise.",
    "The contract awaits. Until you sign, nothing is real.",
  ],
  midday_no_tasks: [
    "It's noon and nothing is checked off. The day is slipping.",
    "Half the day is gone. Zero tasks done. Fix this.",
    "Midday report: 0 completed. This is not the plan.",
  ],
  deadline_approaching: [
    "Deadline in sight. No room for procrastination.",
    "Clock is ticking. Finish what you started.",
    "Deadline approaching. Execute or explain.",
  ],
  weak_day_warning: [
    "Historical data says today is your weak day. Prove the data wrong.",
    "You tend to slip on this day. Not this time.",
    "Your weakest day. Fight harder.",
  ],
  streak_milestone: [
    "Streak milestone hit. The compound effect is real.",
    "Another milestone. Consistency is building something permanent.",
    "Milestone reached. Don't stop — momentum is everything.",
  ],
  reward_proximity: [
    "You're close to earning a reward. Keep pushing.",
    "A few more drachma and you unlock a reward. Finish strong.",
    "Reward within reach. Don't quit now.",
  ],
  sleep_reminder: [
    "Wind down. Recovery is part of the process.",
    "Sleep is a weapon. Use it. Screens off.",
    "Bedtime. Tomorrow's workout starts with tonight's rest.",
    "Lights out soon. Champions sleep on schedule.",
  ],
};

/**
 * Evaluate user context and return all active notifications,
 * sorted by urgency (critical first).
 */
export function getActiveNotifications(
  userContext: UserContext
): ActiveNotification[] {
  const notifications: ActiveNotification[] = [];
  const hour = userContext.currentHour;

  // Morning wake trigger — within 30 min of wake time
  const [wakeH] = userContext.wakeUpTime.split(":").map(Number);
  if (hour === wakeH || hour === wakeH + 1) {
    notifications.push({
      trigger: "morning_wake",
      message: pickTemplate("morning_wake"),
      urgency: "high",
    });
  }

  // Unsigned contract — critical until signed
  if (!userContext.hasSignedContract) {
    notifications.push({
      trigger: "unsigned_contract",
      message: pickTemplate("unsigned_contract"),
      urgency: "critical",
    });
  }

  // Midday no tasks — if it's past noon and nothing done
  if (
    hour >= 12 &&
    hour <= 16 &&
    userContext.tasksCompletedToday === 0 &&
    userContext.totalTasksToday > 0
  ) {
    notifications.push({
      trigger: "midday_no_tasks",
      message: pickTemplate("midday_no_tasks"),
      urgency: "high",
    });
  }

  // Deadline approaching — any deadline within 2 days
  for (const deadline of userContext.deadlines) {
    if (deadline.daysUntil <= 2 && deadline.daysUntil >= 0) {
      notifications.push({
        trigger: "deadline_approaching",
        message: `${deadline.name}: ${deadline.daysUntil === 0 ? "TODAY" : `${deadline.daysUntil} day${deadline.daysUntil > 1 ? "s" : ""} left`}. ${pickTemplate("deadline_approaching")}`,
        urgency: deadline.daysUntil === 0 ? "critical" : "high",
      });
    }
  }

  // Weak day warning — early in the day on historically weak days
  if (
    userContext.weakDays.includes(userContext.todayDayOfWeek) &&
    hour >= wakeH &&
    hour <= wakeH + 3
  ) {
    notifications.push({
      trigger: "weak_day_warning",
      message: pickTemplate("weak_day_warning"),
      urgency: "medium",
    });
  }

  // Streak milestones: 7, 14, 21, 30, 50, 75, 100, 150, 200, 300, 365
  const milestones = [7, 14, 21, 30, 50, 75, 100, 150, 200, 300, 365];
  if (milestones.includes(userContext.currentStreak)) {
    notifications.push({
      trigger: "streak_milestone",
      message: `${userContext.currentStreak}-day streak! ${pickTemplate("streak_milestone")}`,
      urgency: "low",
    });
  }

  // Reward proximity — within 80% of next reward cost
  if (
    userContext.nextRewardCost > 0 &&
    userContext.drachmaBalance >= userContext.nextRewardCost * 0.8
  ) {
    notifications.push({
      trigger: "reward_proximity",
      message: pickTemplate("reward_proximity"),
      urgency: "low",
    });
  }

  // Sleep reminder — within 1 hour of sleep target
  if (
    hour >= userContext.sleepTargetHour - 1 &&
    hour <= userContext.sleepTargetHour
  ) {
    notifications.push({
      trigger: "sleep_reminder",
      message: pickTemplate("sleep_reminder"),
      urgency: "medium",
    });
  }

  // Sort by urgency priority
  const urgencyOrder: Record<Urgency, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  notifications.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  return notifications;
}

/**
 * Determine if a notification should escalate after repeated dismissals.
 * After 2 dismissals, escalate urgency and change tone.
 */
export function shouldEscalate(
  trigger: NotificationTrigger,
  dismissCount: number
): boolean {
  // Critical triggers escalate after 1 dismissal
  const criticalTriggers: NotificationTrigger[] = [
    "unsigned_contract",
    "deadline_approaching",
  ];
  if (criticalTriggers.includes(trigger)) {
    return dismissCount >= 1;
  }
  // All others escalate after 2 dismissals
  return dismissCount >= 2;
}

/**
 * Pick a random template for a given trigger.
 */
function pickTemplate(trigger: NotificationTrigger): string {
  const templates = NOTIFICATION_TEMPLATES[trigger];
  return templates[Math.floor(Math.random() * templates.length)];
}
