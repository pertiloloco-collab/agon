import { NextResponse } from "next/server";

// Mock data for today's meals
const mockMeals = [
  {
    id: "meal-001",
    userId: "mock-user-id-001",
    mealNumber: 1,
    description: "Eggs + Toast",
    calories: 350,
    protein: 22,
    fat: 18,
    carbs: 28,
    source: "quick_select" as const,
    loggedAt: new Date(new Date().setHours(7, 30, 0)).toISOString(),
    photoUrl: null,
  },
  {
    id: "meal-002",
    userId: "mock-user-id-001",
    mealNumber: 2,
    description: "Protein Shake",
    calories: 180,
    protein: 30,
    fat: 3,
    carbs: 8,
    source: "quick_select" as const,
    loggedAt: new Date(new Date().setHours(10, 0, 0)).toISOString(),
    photoUrl: null,
  },
  {
    id: "meal-003",
    userId: "mock-user-id-001",
    mealNumber: 3,
    description: "Chicken + Rice + Broccoli",
    calories: 520,
    protein: 45,
    fat: 8,
    carbs: 65,
    source: "manual" as const,
    loggedAt: new Date(new Date().setHours(13, 0, 0)).toISOString(),
    photoUrl: null,
  },
];

export async function GET() {
  try {
    const totalCalories = mockMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = mockMeals.reduce((sum, m) => sum + m.protein, 0);
    const totalFat = mockMeals.reduce((sum, m) => sum + m.fat, 0);
    const totalCarbs = mockMeals.reduce((sum, m) => sum + m.carbs, 0);

    return NextResponse.json(
      {
        meals: mockMeals,
        totals: {
          calories: totalCalories,
          protein: totalProtein,
          fat: totalFat,
          carbs: totalCarbs,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Meals GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newMeal = {
      id: crypto.randomUUID(),
      userId: "mock-user-id-001",
      mealNumber: body.mealNumber || mockMeals.length + 1,
      description: body.description || "Unnamed meal",
      calories: body.calories || 0,
      protein: body.protein || 0,
      fat: body.fat || 0,
      carbs: body.carbs || 0,
      source: body.source || "manual",
      loggedAt: new Date().toISOString(),
      photoUrl: body.photoUrl || null,
    };

    return NextResponse.json(
      { success: true, meal: newMeal },
      { status: 201 }
    );
  } catch (error) {
    console.error("Meals POST error:", error);
    return NextResponse.json(
      { error: "Failed to save meal" },
      { status: 500 }
    );
  }
}
