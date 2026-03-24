export interface NutritionPhase {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  strategy: string;
}

export const NUTRITION_PHASES: Record<number, NutritionPhase> = {
  1: { calories: 2400, protein: 160, fat: 70, carbs: 260, strategy: "Recomposition — maintenance calories" },
  2: { calories: 2550, protein: 165, fat: 75, carbs: 300, strategy: "Lean surplus +200-300 kcal" },
  3: { calories: 2650, protein: 165, fat: 75, carbs: 320, strategy: "Lean surplus +200-300 kcal with higher carbs for volume" },
  4: { calories: 2000, protein: 175, fat: 60, carbs: 200, strategy: "Moderate deficit -500 kcal, protein UP to preserve muscle" },
};

export const DAILY_NONNEGOTIABLES = [
  { title: "Drink 3L water", category: "habit" as const },
  { title: "5g Creatine", category: "habit" as const },
  { title: "Stomach vacuum — 3×30 sec", category: "habit" as const },
  { title: "8+ hours sleep target", category: "habit" as const },
  { title: "Hit protein target", category: "nutrition" as const },
  { title: "Stay within calorie target", category: "nutrition" as const },
];
