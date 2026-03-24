// AGON - Greek God Transformation: 52-Week Phase Plan
// Complete training data for all 4 phases

export interface ExerciseSet {
  reps: string;
  rest: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  cue: string;
}

export interface TrainingDay {
  name: string;
  dayOfWeek: number[];
  exercises: Exercise[];
}

export interface Phase {
  id: number;
  name: string;
  weeks: [number, number];
  split: string;
  daysPerWeek: number;
  schedule: TrainingDay[];
  description: string;
}

// ---------------------------------------------------------------------------
// PHASE 1 — Foundation (Weeks 1-12)
// ---------------------------------------------------------------------------

const phase1UpperA: TrainingDay = {
  name: "Upper A",
  dayOfWeek: [1], // Monday
  exercises: [
    { name: "Barbell Bench Press", sets: 4, reps: "8-10", rest: "2-3 min", cue: "Retract shoulder blades, arch upper back, feet planted" },
    { name: "Barbell Bent Over Row", sets: 4, reps: "8-10", rest: "2-3 min", cue: "Pull to lower chest, squeeze shoulder blades" },
    { name: "Overhead Press (standing)", sets: 3, reps: "8-12", rest: "2 min", cue: "Brace core, press straight up alongside ears" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "90 sec", cue: "Pull elbows to sides, lean back slightly" },
    { name: "Dumbbell Lateral Raise", sets: 3, reps: "12-15", rest: "60 sec", cue: "Slight elbow bend, raise to shoulder height, pinky up" },
    { name: "EZ Bar Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Elbows pinned to sides, control negative" },
    { name: "Tricep Rope Pushdown", sets: 3, reps: "10-12", rest: "60 sec", cue: "Spread rope at bottom, squeeze triceps" },
  ],
};

const phase1LowerA: TrainingDay = {
  name: "Lower A",
  dayOfWeek: [2], // Tuesday
  exercises: [
    { name: "Barbell Back Squat", sets: 4, reps: "8-10", rest: "3 min", cue: "Break at hips and knees together, chest up, hit parallel" },
    { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "2 min", cue: "Hinge at hips, slight knee bend, feel hamstring stretch" },
    { name: "Leg Press", sets: 3, reps: "10-12", rest: "2 min", cue: "Feet shoulder-width, don't lock knees at top" },
    { name: "Walking Lunges", sets: 3, reps: "10 each", rest: "90 sec", cue: "Long stride, back knee nearly touches floor" },
    { name: "Leg Curl (machine)", sets: 3, reps: "10-12", rest: "60 sec", cue: "Control eccentric, full ROM" },
    { name: "Standing Calf Raise", sets: 4, reps: "12-15", rest: "60 sec", cue: "Full stretch bottom, hold squeeze top 2 sec" },
    { name: "Hanging Knee Raise", sets: 3, reps: "12-15", rest: "60 sec", cue: "No swinging, curl pelvis up" },
  ],
};

const phase1UpperB: TrainingDay = {
  name: "Upper B",
  dayOfWeek: [4], // Thursday
  exercises: [
    { name: "Incline Dumbbell Press", sets: 4, reps: "8-10", rest: "2-3 min", cue: "30\u00B0 incline, touch outer chest, drive up" },
    { name: "Cable Row (seated)", sets: 4, reps: "10-12", rest: "2 min", cue: "Pull to belly button, squeeze back" },
    { name: "Dumbbell Shoulder Press", sets: 3, reps: "8-12", rest: "2 min", cue: "Start at ear level, press to lockout" },
    { name: "Chest Supported Row", sets: 3, reps: "10-12", rest: "90 sec", cue: "Chest on pad, pull elbows back" },
    { name: "Cable Face Pull", sets: 3, reps: "15-20", rest: "60 sec", cue: "Pull to forehead, externally rotate at end" },
    { name: "Incline Dumbbell Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Let arms hang, elbows behind body" },
    { name: "Overhead Tricep Extension (cable)", sets: 3, reps: "10-12", rest: "60 sec", cue: "Elbows by ears, extend fully" },
  ],
};

const phase1LowerB: TrainingDay = {
  name: "Lower B",
  dayOfWeek: [5], // Friday
  exercises: [
    { name: "Barbell Deadlift", sets: 4, reps: "6-8", rest: "3 min", cue: "Brace hard, push floor away, lockout with glutes" },
    { name: "Front Squat or Goblet Squat", sets: 3, reps: "8-10", rest: "2 min", cue: "Elbows high, upright torso, deep as mobility allows" },
    { name: "Leg Extension", sets: 3, reps: "12-15", rest: "60 sec", cue: "Squeeze quads at top, slow negative 2-3 sec" },
    { name: "Glute Ham Raise or Nordic Curl", sets: 3, reps: "8-10", rest: "90 sec", cue: "Control descent, use hands for assistance if needed" },
    { name: "Hip Thrust (barbell)", sets: 3, reps: "10-12", rest: "90 sec", cue: "Drive through heels, full hip extension, squeeze glutes" },
    { name: "Seated Calf Raise", sets: 4, reps: "12-15", rest: "60 sec", cue: "Slow and controlled, full range, 2 sec pause top" },
    { name: "Cable Woodchop", sets: 3, reps: "12 each side", rest: "60 sec", cue: "Rotate from core, arms stay extended" },
  ],
};

// ---------------------------------------------------------------------------
// PHASE 2 — Hypertrophy Push (Weeks 13-26)
// ---------------------------------------------------------------------------

const phase2Push1: TrainingDay = {
  name: "Push 1",
  dayOfWeek: [1], // Monday
  exercises: [
    { name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: "3 min", cue: "Leg drive, control eccentric, explosive concentric" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "2 min", cue: "30\u00B0 angle, full stretch at bottom" },
    { name: "Cable Crossover (low to high)", sets: 3, reps: "12-15", rest: "60 sec", cue: "Squeeze chest at top, control the stretch" },
    { name: "Overhead Press (barbell)", sets: 3, reps: "8-10", rest: "2 min", cue: "Strict form, no leg drive" },
    { name: "Dumbbell Lateral Raise", sets: 4, reps: "12-15", rest: "60 sec", cue: "Lean slightly forward, controlled tempo" },
    { name: "Tricep Dip (weighted if possible)", sets: 3, reps: "8-12", rest: "90 sec", cue: "Lean forward for chest, upright for triceps" },
    { name: "Overhead Tricep Extension (rope)", sets: 3, reps: "12-15", rest: "60 sec", cue: "Full stretch, squeeze at extension" },
  ],
};

const phase2Pull1: TrainingDay = {
  name: "Pull 1",
  dayOfWeek: [2], // Tuesday
  exercises: [
    { name: "Barbell Deadlift", sets: 4, reps: "5-6", rest: "3 min", cue: "Belt up, brace, push floor away" },
    { name: "Weighted Pull-Up", sets: 4, reps: "6-8", rest: "2-3 min", cue: "Full hang, pull to upper chest, controlled lower" },
    { name: "Barbell Row", sets: 3, reps: "8-10", rest: "2 min", cue: "45\u00B0 torso angle, pull to belly button" },
    { name: "Cable Face Pull", sets: 3, reps: "15-20", rest: "60 sec", cue: "High pull, external rotation at end" },
    { name: "Dumbbell Shrug", sets: 3, reps: "12-15", rest: "60 sec", cue: "Straight up, hold at top 2 sec" },
    { name: "Barbell Curl", sets: 3, reps: "8-10", rest: "60 sec", cue: "Strict form, no swinging" },
    { name: "Hammer Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Neutral grip, controlled negative" },
  ],
};

const phase2Legs1: TrainingDay = {
  name: "Legs 1",
  dayOfWeek: [3], // Wednesday
  exercises: [
    { name: "Barbell Back Squat", sets: 4, reps: "6-8", rest: "3 min", cue: "Below parallel, brace hard, drive through heels" },
    { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "2 min", cue: "Max hamstring stretch, hinge pattern" },
    { name: "Leg Press", sets: 3, reps: "10-12", rest: "2 min", cue: "Full depth, don't lock out" },
    { name: "Walking Lunges", sets: 3, reps: "12 each", rest: "90 sec", cue: "Long stride, controlled descent" },
    { name: "Leg Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Squeeze hamstrings at contraction" },
    { name: "Standing Calf Raise", sets: 4, reps: "12-15", rest: "60 sec", cue: "Full ROM, 2 sec pause at top" },
    { name: "Hanging Leg Raise", sets: 3, reps: "12-15", rest: "60 sec", cue: "Control momentum, curl pelvis" },
  ],
};

const phase2Push2: TrainingDay = {
  name: "Push 2",
  dayOfWeek: [4], // Thursday
  exercises: [
    { name: "Incline Barbell Bench", sets: 4, reps: "8-10", rest: "2-3 min", cue: "30\u00B0 angle, touch upper chest" },
    { name: "Dumbbell Flat Press", sets: 3, reps: "10-12", rest: "90 sec", cue: "Deep stretch at bottom, squeeze at top" },
    { name: "Pec Deck / Machine Fly", sets: 3, reps: "12-15", rest: "60 sec", cue: "Slow eccentric, squeeze at peak" },
    { name: "Arnold Press", sets: 3, reps: "10-12", rest: "90 sec", cue: "Rotate palms as you press, full ROM" },
    { name: "Cable Lateral Raise", sets: 3, reps: "12-15", rest: "60 sec", cue: "Behind the body start, raise to shoulder" },
    { name: "Close Grip Bench Press", sets: 3, reps: "8-10", rest: "2 min", cue: "Elbows tucked, hands shoulder-width" },
    { name: "Tricep Pushdown (V-bar)", sets: 3, reps: "12-15", rest: "60 sec", cue: "Lock elbows, squeeze at bottom" },
  ],
};

const phase2Pull2: TrainingDay = {
  name: "Pull 2",
  dayOfWeek: [5], // Friday
  exercises: [
    { name: "Chest Supported T-Bar Row", sets: 4, reps: "8-10", rest: "2 min", cue: "Pull to chest, squeeze shoulder blades" },
    { name: "Lat Pulldown (wide)", sets: 3, reps: "10-12", rest: "90 sec", cue: "Pull to collarbone, lean back slightly" },
    { name: "Single Arm Dumbbell Row", sets: 3, reps: "10-12 each", rest: "90 sec", cue: "Row to hip, full stretch at bottom" },
    { name: "Rear Delt Fly (machine)", sets: 3, reps: "12-15", rest: "60 sec", cue: "Squeeze rear delts, don't use momentum" },
    { name: "Cable Face Pull", sets: 3, reps: "15-20", rest: "60 sec", cue: "Pull high, external rotation" },
    { name: "Incline Dumbbell Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Arms behind body, full stretch" },
    { name: "Preacher Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Slow negative, don't fully extend" },
  ],
};

const phase2Legs2: TrainingDay = {
  name: "Legs 2",
  dayOfWeek: [6], // Saturday
  exercises: [
    { name: "Front Squat", sets: 4, reps: "8-10", rest: "2-3 min", cue: "Elbows high, upright torso, full depth" },
    { name: "Barbell Hip Thrust", sets: 3, reps: "10-12", rest: "90 sec", cue: "Full hip extension, squeeze glutes 2 sec" },
    { name: "Bulgarian Split Squat", sets: 3, reps: "10-12 each", rest: "90 sec", cue: "Rear foot elevated, deep stretch" },
    { name: "Leg Extension", sets: 3, reps: "12-15", rest: "60 sec", cue: "Squeeze quads at top, slow eccentric" },
    { name: "Nordic Curl / Glute Ham Raise", sets: 3, reps: "6-8", rest: "90 sec", cue: "Control eccentric, assist if needed" },
    { name: "Seated Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", cue: "Full stretch, 2 sec pause at top" },
    { name: "Ab Wheel Rollout", sets: 3, reps: "10-12", rest: "60 sec", cue: "Full extension, brace core throughout" },
  ],
};

// ---------------------------------------------------------------------------
// PHASE 3 — Advanced Hypertrophy (Weeks 27-40)
// ---------------------------------------------------------------------------

const phase3Push1: TrainingDay = {
  name: "Push 1",
  dayOfWeek: [1], // Monday
  exercises: [
    { name: "Barbell Bench Press", sets: 4, reps: "5-6", rest: "3 min", cue: "Pause 1 sec at chest, explosive drive" },
    { name: "Incline Dumbbell Press", sets: 4, reps: "8-10", rest: "2 min", cue: "Control eccentric 3 sec" },
    { name: "Cable Fly (mid)", sets: 3, reps: "12-15", rest: "60 sec", cue: "Peak contraction, slow stretch" },
    { name: "Overhead Press (barbell)", sets: 4, reps: "6-8", rest: "2-3 min", cue: "Strict, no push press" },
    { name: "Dumbbell Lateral Raise", sets: 4, reps: "15-20", rest: "45 sec", cue: "Dropset on last set" },
    { name: "Weighted Dip", sets: 3, reps: "8-10", rest: "2 min", cue: "Add weight progressively" },
    { name: "Skull Crusher", sets: 3, reps: "10-12", rest: "60 sec", cue: "Lower to forehead, extend fully" },
  ],
};

const phase3Pull1: TrainingDay = {
  name: "Pull 1",
  dayOfWeek: [2], // Tuesday
  exercises: [
    { name: "Weighted Pull-Up", sets: 4, reps: "5-6", rest: "3 min", cue: "Add weight weekly" },
    { name: "Barbell Row (Pendlay)", sets: 4, reps: "6-8", rest: "2 min", cue: "Dead stop each rep, explosive pull" },
    { name: "Cable Pullover", sets: 3, reps: "12-15", rest: "60 sec", cue: "Feel lats stretch, squeeze at bottom" },
    { name: "Reverse Pec Deck", sets: 3, reps: "12-15", rest: "60 sec", cue: "Rear delt focus, controlled" },
    { name: "Barbell Shrug", sets: 4, reps: "10-12", rest: "60 sec", cue: "Heavy, hold at top" },
    { name: "Barbell Curl", sets: 4, reps: "8-10", rest: "60 sec", cue: "Strict form, progress weight" },
    { name: "Spider Curl", sets: 3, reps: "12-15", rest: "60 sec", cue: "Incline bench, face down, full contraction" },
  ],
};

const phase3Legs1: TrainingDay = {
  name: "Legs 1",
  dayOfWeek: [3], // Wednesday
  exercises: [
    { name: "Barbell Back Squat", sets: 4, reps: "5-6", rest: "3 min", cue: "ATG if mobile, brace and drive" },
    { name: "Romanian Deadlift", sets: 4, reps: "8-10", rest: "2 min", cue: "Heavier than Phase 2, max stretch" },
    { name: "Hack Squat", sets: 3, reps: "10-12", rest: "2 min", cue: "Deep, control eccentric" },
    { name: "Single Leg Press", sets: 3, reps: "10-12 each", rest: "90 sec", cue: "Full ROM, don't lock out" },
    { name: "Lying Leg Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Squeeze at peak, 3 sec negative" },
    { name: "Standing Calf Raise", sets: 5, reps: "10-12", rest: "60 sec", cue: "Heavy, full ROM" },
    { name: "Hanging Leg Raise", sets: 3, reps: "15", rest: "60 sec", cue: "Toes to bar if possible" },
  ],
};

const phase3Push2: TrainingDay = {
  name: "Push 2",
  dayOfWeek: [4], // Thursday
  exercises: [
    { name: "Incline Barbell Press", sets: 4, reps: "8-10", rest: "2-3 min", cue: "Controlled eccentric, pause at chest" },
    { name: "Dumbbell Floor Press", sets: 3, reps: "10-12", rest: "90 sec", cue: "Pause at floor, drive up" },
    { name: "Cable Crossover (high to low)", sets: 3, reps: "12-15", rest: "60 sec", cue: "Squeeze lower chest" },
    { name: "Seated Dumbbell OHP", sets: 3, reps: "10-12", rest: "90 sec", cue: "Full ROM, no momentum" },
    { name: "Lu Raise", sets: 3, reps: "10-12", rest: "60 sec", cue: "Front to lateral in one motion" },
    { name: "Overhead Rope Extension", sets: 3, reps: "12-15", rest: "60 sec", cue: "Deep stretch, full extension" },
    { name: "Diamond Push-Up", sets: 3, reps: "AMRAP", rest: "60 sec", cue: "To failure each set" },
  ],
};

const phase3Pull2: TrainingDay = {
  name: "Pull 2",
  dayOfWeek: [5], // Friday
  exercises: [
    { name: "T-Bar Row", sets: 4, reps: "8-10", rest: "2 min", cue: "Pull to chest, squeeze back" },
    { name: "Close Grip Lat Pulldown", sets: 3, reps: "10-12", rest: "90 sec", cue: "Full stretch at top, squeeze at bottom" },
    { name: "Meadows Row", sets: 3, reps: "10-12 each", rest: "90 sec", cue: "Land-mine setup, explosive pull" },
    { name: "Face Pull", sets: 4, reps: "15-20", rest: "45 sec", cue: "External rotation emphasis" },
    { name: "Incline Dumbbell Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Full stretch, supinate at top" },
    { name: "Concentration Curl", sets: 3, reps: "12-15", rest: "60 sec", cue: "Peak contraction, squeeze" },
    { name: "Reverse Curl", sets: 3, reps: "12-15", rest: "60 sec", cue: "Forearm and brachialis focus" },
  ],
};

const phase3Legs2: TrainingDay = {
  name: "Legs 2",
  dayOfWeek: [6], // Saturday
  exercises: [
    { name: "Front Squat", sets: 4, reps: "6-8", rest: "3 min", cue: "Heavy, elbows high" },
    { name: "Barbell Hip Thrust", sets: 4, reps: "10-12", rest: "90 sec", cue: "Progress weight, full extension" },
    { name: "Walking Lunge (weighted)", sets: 3, reps: "12 each", rest: "90 sec", cue: "Heavy dumbbells, deep stretch" },
    { name: "Leg Extension", sets: 4, reps: "12-15", rest: "45 sec", cue: "Dropset on last set" },
    { name: "Glute Ham Raise", sets: 3, reps: "8-10", rest: "90 sec", cue: "Control entire ROM" },
    { name: "Seated Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", cue: "Pause and squeeze" },
    { name: "Cable Crunch", sets: 3, reps: "15-20", rest: "60 sec", cue: "Curl rib cage to pelvis" },
  ],
};

// ---------------------------------------------------------------------------
// PHASE 4 — The Cut (Weeks 41-52)
// ---------------------------------------------------------------------------

const phase4Push1: TrainingDay = {
  name: "Push 1",
  dayOfWeek: [1], // Monday
  exercises: [
    { name: "Barbell Bench Press", sets: 4, reps: "5-6", rest: "3 min", cue: "Maintain weight from Phase 3" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "2 min", cue: "Moderate weight, perfect form" },
    { name: "Cable Fly", sets: 3, reps: "15-20", rest: "45 sec", cue: "Pump work, constant tension" },
    { name: "Overhead Press", sets: 3, reps: "8-10", rest: "2 min", cue: "Strict form, no leg drive" },
    { name: "Lateral Raise", sets: 4, reps: "15-20", rest: "45 sec", cue: "Light, high reps, burn it out" },
    { name: "Tricep Pushdown", sets: 3, reps: "15-20", rest: "45 sec", cue: "Pump and squeeze" },
    { name: "Overhead Extension", sets: 3, reps: "12-15", rest: "60 sec", cue: "Full ROM" },
  ],
};

const phase4Pull1: TrainingDay = {
  name: "Pull 1",
  dayOfWeek: [2], // Tuesday
  exercises: [
    { name: "Weighted Pull-Up", sets: 4, reps: "5-6", rest: "3 min", cue: "Maintain strength" },
    { name: "Barbell Row", sets: 3, reps: "8-10", rest: "2 min", cue: "Strict form, no body English" },
    { name: "Cable Pullover", sets: 3, reps: "12-15", rest: "60 sec", cue: "Mind-muscle connection" },
    { name: "Face Pull", sets: 3, reps: "20", rest: "45 sec", cue: "Light, rear delt burn" },
    { name: "Barbell Curl", sets: 3, reps: "8-10", rest: "60 sec", cue: "Maintain curl strength" },
    { name: "Hammer Curl", sets: 3, reps: "12-15", rest: "60 sec", cue: "Controlled reps" },
  ],
};

const phase4Legs: TrainingDay = {
  name: "Legs",
  dayOfWeek: [3], // Wednesday
  exercises: [
    { name: "Barbell Back Squat", sets: 4, reps: "6-8", rest: "3 min", cue: "Maintain squat strength" },
    { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "2 min", cue: "Focus on stretch" },
    { name: "Leg Press", sets: 3, reps: "12-15", rest: "90 sec", cue: "Higher reps, full ROM" },
    { name: "Leg Curl", sets: 3, reps: "12-15", rest: "60 sec", cue: "Squeeze hamstrings" },
    { name: "Leg Extension", sets: 3, reps: "15-20", rest: "45 sec", cue: "Burn out quads" },
    { name: "Standing Calf Raise", sets: 4, reps: "15-20", rest: "60 sec", cue: "High reps during cut" },
    { name: "Plank", sets: 3, reps: "60 sec", rest: "60 sec", cue: "Brace everything" },
  ],
};

const phase4Push2: TrainingDay = {
  name: "Push 2",
  dayOfWeek: [5], // Friday
  exercises: [
    { name: "Incline Barbell Press", sets: 3, reps: "8-10", rest: "2-3 min", cue: "Focus on upper chest" },
    { name: "Dumbbell Flat Press", sets: 3, reps: "10-12", rest: "90 sec", cue: "Deep stretch, squeeze" },
    { name: "Pec Deck", sets: 3, reps: "15-20", rest: "45 sec", cue: "Pump work" },
    { name: "Arnold Press", sets: 3, reps: "10-12", rest: "90 sec", cue: "Full rotation" },
    { name: "Cable Lateral Raise", sets: 3, reps: "15-20", rest: "45 sec", cue: "Constant tension" },
    { name: "Close Grip Bench", sets: 3, reps: "8-10", rest: "2 min", cue: "Tricep focus" },
    { name: "Rope Pushdown", sets: 3, reps: "15-20", rest: "45 sec", cue: "Squeeze and burn" },
  ],
};

const phase4Pull2: TrainingDay = {
  name: "Pull 2",
  dayOfWeek: [6], // Saturday
  exercises: [
    { name: "Chest Supported Row", sets: 4, reps: "8-10", rest: "2 min", cue: "Strict form" },
    { name: "Lat Pulldown (neutral grip)", sets: 3, reps: "10-12", rest: "90 sec", cue: "Full stretch and squeeze" },
    { name: "Single Arm Cable Row", sets: 3, reps: "12 each", rest: "60 sec", cue: "Mind-muscle connection" },
    { name: "Rear Delt Fly", sets: 3, reps: "15-20", rest: "45 sec", cue: "Light, squeeze" },
    { name: "Incline Curl", sets: 3, reps: "10-12", rest: "60 sec", cue: "Full ROM" },
    { name: "Preacher Curl", sets: 3, reps: "12-15", rest: "60 sec", cue: "Peak contraction" },
  ],
};

// ---------------------------------------------------------------------------
// Assembled Phase Plan
// ---------------------------------------------------------------------------

export const PHASE_PLAN: Phase[] = [
  {
    id: 1,
    name: "Foundation",
    weeks: [1, 12],
    split: "Upper/Lower",
    daysPerWeek: 4,
    schedule: [phase1UpperA, phase1LowerA, phase1UpperB, phase1LowerB],
    description:
      "Build a base of strength and muscle with an Upper/Lower split. Focus on mastering compound lifts with moderate volume and progressive overload. This phase establishes movement patterns, connective tissue resilience, and work capacity for the phases ahead.",
  },
  {
    id: 2,
    name: "Hypertrophy Push",
    weeks: [13, 26],
    split: "Push/Pull/Legs",
    daysPerWeek: 6,
    schedule: [phase2Push1, phase2Pull1, phase2Legs1, phase2Push2, phase2Pull2, phase2Legs2],
    description:
      "Ramp up volume and frequency with a 6-day Push/Pull/Legs split. Each muscle group is trained twice per week with a mix of heavy compound lifts and targeted isolation work. This phase drives maximum hypertrophy through increased training stimulus.",
  },
  {
    id: 3,
    name: "Advanced Hypertrophy",
    weeks: [27, 40],
    split: "Push/Pull/Legs",
    daysPerWeek: 6,
    schedule: [phase3Push1, phase3Pull1, phase3Legs1, phase3Push2, phase3Pull2, phase3Legs2],
    description:
      "Push intensity and progressive overload to new levels with heavier weights, advanced techniques like dropsets and pause reps, and specialization emphasis on shoulders and arms for the Greek God aesthetic. This phase builds the signature V-taper and capped delts.",
  },
  {
    id: 4,
    name: "The Cut",
    weeks: [41, 52],
    split: "Push/Pull/Legs",
    daysPerWeek: 5,
    schedule: [phase4Push1, phase4Pull1, phase4Legs, phase4Push2, phase4Pull2],
    description:
      "Maintain hard-earned muscle and strength while stripping body fat. Training volume is slightly reduced to 5 days per week, with heavy compounds preserved and accessories shifted to higher reps for pump and metabolic stress. The goal is to reveal the physique built in Phases 1-3.",
  },
];

// ---------------------------------------------------------------------------
// Helper: get rest days for a given phase
// ---------------------------------------------------------------------------

export function getRestDays(phaseId: number): number[] {
  const phase = PHASE_PLAN.find((p) => p.id === phaseId);
  if (!phase) return [];

  const trainingDays = new Set<number>();
  for (const day of phase.schedule) {
    for (const dow of day.dayOfWeek) {
      trainingDays.add(dow);
    }
  }

  const allDays = [0, 1, 2, 3, 4, 5, 6]; // Sun through Sat
  return allDays.filter((d) => !trainingDays.has(d));
}
