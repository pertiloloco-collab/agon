import { PHASE_PLAN, type Phase, type TrainingDay } from "./phase-plan";

export interface TrainingDayInfo {
  dayNumber: number; // Day X of 365
  phase: number; // 1-4
  phaseName: string;
  weekInProgram: number; // 1-52
  weekInPhase: number; // 1-12, 1-14, etc
  dayOfWeek: number; // 0-6 (Sun-Sat)
  isRestDay: boolean;
  trainingDay: TrainingDay | null; // null if rest day
}

export function getTrainingDayInfo(startDate: Date, currentDate?: Date): TrainingDayInfo {
  const now = currentDate || new Date();
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const current = new Date(now);
  current.setHours(0, 0, 0, 0);

  const diffMs = current.getTime() - start.getTime();
  const dayNumber = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  const weekInProgram = Math.ceil(dayNumber / 7);
  const dayOfWeek = current.getDay(); // 0=Sun

  // Determine phase
  let phase: Phase | undefined;
  for (const p of PHASE_PLAN) {
    if (weekInProgram >= p.weeks[0] && weekInProgram <= p.weeks[1]) {
      phase = p;
      break;
    }
  }

  // Default to last phase if beyond 52 weeks
  if (!phase) {
    phase = PHASE_PLAN[PHASE_PLAN.length - 1];
  }

  const weekInPhase = weekInProgram - phase.weeks[0] + 1;

  // Find today's training day
  const trainingDay = phase.schedule.find(day => day.dayOfWeek.includes(dayOfWeek)) || null;
  const isRestDay = trainingDay === null;

  return {
    dayNumber: Math.max(1, Math.min(365, dayNumber)),
    phase: phase.id,
    phaseName: phase.name,
    weekInProgram,
    weekInPhase,
    dayOfWeek,
    isRestDay,
    trainingDay,
  };
}

export function getDaysRemaining(startDate: Date): number {
  const info = getTrainingDayInfo(startDate);
  return Math.max(0, 365 - info.dayNumber);
}

export function getPhaseProgress(startDate: Date): { current: number; total: number; percentage: number } {
  const info = getTrainingDayInfo(startDate);
  const phase = PHASE_PLAN.find(p => p.id === info.phase)!;
  const totalWeeksInPhase = phase.weeks[1] - phase.weeks[0] + 1;
  return {
    current: info.weekInPhase,
    total: totalWeeksInPhase,
    percentage: Math.round((info.weekInPhase / totalWeeksInPhase) * 100),
  };
}

export function calculateHonorScore(completedTasks: number, totalTasks: number, proofsSubmitted: number, streakDays: number): number {
  if (totalTasks === 0) return 0;
  const completionScore = (completedTasks / totalTasks) * 60;
  const proofBonus = Math.min(proofsSubmitted * 5, 20);
  const streakBonus = Math.min(streakDays * 2, 20);
  return Math.round(Math.min(100, completionScore + proofBonus + streakBonus));
}
