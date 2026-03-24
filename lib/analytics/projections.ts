// ═══════════════════════════════════════════════════════════
// AGON — Analytics & Projections
// Linear regression for weight/strength projections
// ═══════════════════════════════════════════════════════════

interface DataPoint {
  day: number;
  weight: number;
}

interface WeightProjection {
  projectedWeightAtDay365: number;
  projectedDateToTarget: Date | null;
  weeklyRate: number;
  isOnTrack: boolean;
}

/**
 * Simple linear regression: returns { slope, intercept } for y = slope*x + intercept.
 * Uses ordinary least squares.
 */
function linearRegression(points: DataPoint[]): {
  slope: number;
  intercept: number;
} {
  const n = points.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  if (n === 1) return { slope: 0, intercept: points[0].weight };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const p of points) {
    sumX += p.day;
    sumY += p.weight;
    sumXY += p.day * p.weight;
    sumXX += p.day * p.day;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

/**
 * Project weight loss/gain trajectory based on historical data points.
 * Uses linear regression to estimate where the user will be at day 365
 * and when they'll hit their target weight.
 */
export function projectWeight(
  dataPoints: DataPoint[],
  targetWeight?: number,
  startDate?: Date
): WeightProjection {
  if (dataPoints.length < 2) {
    const currentWeight = dataPoints[0]?.weight ?? 0;
    return {
      projectedWeightAtDay365: currentWeight,
      projectedDateToTarget: null,
      weeklyRate: 0,
      isOnTrack: false,
    };
  }

  const { slope, intercept } = linearRegression(dataPoints);

  // Projected weight at day 365
  const projectedWeightAtDay365 = slope * 365 + intercept;

  // Weekly rate of change (slope is per-day, multiply by 7)
  const weeklyRate = slope * 7;

  // Projected date to reach target weight
  let projectedDateToTarget: Date | null = null;
  if (targetWeight !== undefined && slope !== 0) {
    const dayToTarget = (targetWeight - intercept) / slope;
    if (dayToTarget > 0 && dayToTarget <= 730) {
      const base = startDate ?? new Date();
      projectedDateToTarget = new Date(
        base.getTime() + dayToTarget * 24 * 60 * 60 * 1000
      );
    }
  }

  // On track if the projected weight at day 365 is at or beyond the target
  const isOnTrack =
    targetWeight !== undefined
      ? slope < 0
        ? projectedWeightAtDay365 <= targetWeight // losing weight
        : projectedWeightAtDay365 >= targetWeight // gaining weight
      : false;

  return {
    projectedWeightAtDay365: Math.round(projectedWeightAtDay365 * 10) / 10,
    projectedDateToTarget,
    weeklyRate: Math.round(weeklyRate * 100) / 100,
    isOnTrack,
  };
}

/**
 * Estimate 1-rep max using the Epley formula.
 * 1RM = weight x (1 + reps/30)
 */
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Calculate a composite strength score (Wilks-style simplification).
 * Total of the big three lifts divided by bodyweight.
 * Score interpretation:
 *   < 5: Beginner
 *   5-7: Intermediate
 *   7-9: Advanced
 *   9+: Elite
 */
export function calculateStrengthScore(
  bench1RM: number,
  squat1RM: number,
  deadlift1RM: number,
  bodyweight: number
): number {
  if (bodyweight <= 0) return 0;
  const total = bench1RM + squat1RM + deadlift1RM;
  return Math.round((total / bodyweight) * 100) / 100;
}

/**
 * Calculate total weekly volume for a given muscle group.
 * Volume = sets x reps x weight for all exercises targeting the muscle group.
 */
export function weeklyVolume(
  workoutLogs: {
    muscleGroup: string;
    sets: number;
    reps: number;
    weight: number;
    date: string | Date;
  }[],
  muscleGroup: string,
  weekStartDate?: Date
): number {
  const now = weekStartDate ?? new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return workoutLogs
    .filter((log) => {
      const logDate = new Date(log.date);
      return (
        log.muscleGroup.toLowerCase() === muscleGroup.toLowerCase() &&
        logDate >= weekStart &&
        logDate < weekEnd
      );
    })
    .reduce((total, log) => total + log.sets * log.reps * log.weight, 0);
}
