"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Timer, CheckCircle2, Moon, Heart, Droplets, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExerciseCard, LoggedSet } from "@/components/workout/exercise-card";
import { SetData } from "@/components/workout/set-logger";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  cue: string;
  previousBest?: { weight: number; reps: number };
}

const mockExercises: Exercise[] = [
  {
    name: "Barbell Bench Press",
    sets: 4,
    reps: "8-10",
    rest: "2-3 min",
    cue: "Retract shoulder blades, arch upper back, feet planted. Control the eccentric, explode on the concentric.",
    previousBest: { weight: 70, reps: 9 },
  },
  {
    name: "Barbell Bent Over Row",
    sets: 4,
    reps: "8-10",
    rest: "2-3 min",
    cue: "Pull to lower chest, squeeze shoulder blades together at the top. Keep torso at 45 degrees.",
    previousBest: { weight: 65, reps: 10 },
  },
  {
    name: "Overhead Press",
    sets: 3,
    reps: "8-10",
    rest: "2 min",
    cue: "Brace core, press straight overhead. Move head through at the top for full lockout.",
    previousBest: { weight: 45, reps: 8 },
  },
  {
    name: "Lat Pulldown",
    sets: 3,
    reps: "10-12",
    rest: "90 sec",
    cue: "Lean back slightly, pull to upper chest. Focus on driving elbows down and back.",
  },
  {
    name: "Incline Dumbbell Press",
    sets: 3,
    reps: "10-12",
    rest: "90 sec",
    cue: "30-degree incline, dumbbells at shoulder width. Control the negative, squeeze chest at the top.",
    previousBest: { weight: 26, reps: 11 },
  },
  {
    name: "Face Pulls",
    sets: 3,
    reps: "15-20",
    rest: "60 sec",
    cue: "Pull to face level with external rotation. Squeeze rear delts at peak contraction.",
  },
  {
    name: "Barbell Curl",
    sets: 3,
    reps: "10-12",
    rest: "60 sec",
    cue: "Keep elbows pinned to sides. Control the negative — no swinging.",
    previousBest: { weight: 30, reps: 12 },
  },
  {
    name: "Tricep Rope Pushdown",
    sets: 3,
    reps: "10-12",
    rest: "60 sec",
    cue: "Split the rope at the bottom, squeeze triceps hard. Elbows stay fixed.",
  },
];

const isRestDay = false;

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WorkoutPage() {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const [exerciseSets, setExerciseSets] = useState<Record<number, LoggedSet[]>>(() => {
    const initial: Record<number, LoggedSet[]> = {};
    mockExercises.forEach((ex, i) => {
      initial[i] = Array.from({ length: ex.sets }, () => ({
        weight: 0,
        reps: 0,
        rpe: 0,
      }));
    });
    return initial;
  });

  useEffect(() => {
    if (!isRunning || workoutComplete || isRestDay) return;
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, workoutComplete]);

  const handleLogSet = useCallback((exerciseIndex: number, setIndex: number, data: SetData) => {
    setExerciseSets((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exerciseIndex]];
      sets[setIndex] = data;
      updated[exerciseIndex] = sets;
      return updated;
    });
  }, []);

  const handleAddSet = useCallback((exerciseIndex: number) => {
    setExerciseSets((prev) => {
      const updated = { ...prev };
      updated[exerciseIndex] = [...updated[exerciseIndex], { weight: 0, reps: 0, rpe: 0 }];
      return updated;
    });
  }, []);

  const handleRemoveSet = useCallback((exerciseIndex: number, setIndex: number) => {
    setExerciseSets((prev) => {
      const updated = { ...prev };
      const sets = [...updated[exerciseIndex]];
      if (sets.length > 1) {
        sets.splice(setIndex, 1);
        updated[exerciseIndex] = sets;
      }
      return updated;
    });
  }, []);

  const handleCompleteWorkout = () => {
    setIsRunning(false);
    setWorkoutComplete(true);
  };

  const totalSets = Object.values(exerciseSets).reduce((acc, sets) => acc + sets.length, 0);
  const completedSets = Object.values(exerciseSets).reduce(
    (acc, sets) => acc + sets.filter((s) => s.weight > 0 && s.reps > 0).length,
    0
  );

  if (isRestDay) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl tracking-wider text-[#F5F5F5]">
            REST DAY
          </h1>
          <p className="mt-1 font-mono text-xs text-[#525252] uppercase tracking-widest">
            Phase 1 &mdash; Foundation &middot; Recovery
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-8"
        >
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20">
              <Moon className="h-8 w-8 text-[#C9A84C]" />
            </div>

            <div>
              <h2 className="font-heading text-lg tracking-wider text-[#F5F5F5] mb-2">
                ACTIVE RECOVERY
              </h2>
              <p className="text-sm text-[#A3A3A3] max-w-md leading-relaxed">
                Your body builds muscle during rest, not during training. Use today wisely.
              </p>
            </div>

            <div className="grid gap-4 w-full max-w-sm">
              <div className="flex items-center gap-3 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-4">
                <Droplets className="h-5 w-5 text-[#3B82F6]" />
                <div className="text-left">
                  <p className="text-sm text-[#F5F5F5]">Hydration</p>
                  <p className="text-xs text-[#525252]">Minimum 3L of water today</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-4">
                <Heart className="h-5 w-5 text-[#EF4444]" />
                <div className="text-left">
                  <p className="text-sm text-[#F5F5F5]">Light Movement</p>
                  <p className="text-xs text-[#525252]">20-30 min walk or stretching</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-4">
                <BedDouble className="h-5 w-5 text-[#8B5CF6]" />
                <div className="text-left">
                  <p className="text-sm text-[#F5F5F5]">Sleep Quality</p>
                  <p className="text-xs text-[#525252]">Target 7-9 hours tonight</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-32">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60 border border-[#C9A84C]/20 rounded px-2 py-0.5 bg-[#C9A84C]/5">
            Phase 1
          </span>
          <span className="font-mono text-[10px] text-[#525252]">&middot;</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252]">
            Foundation
          </span>
        </div>
        <h1 className="font-heading text-2xl tracking-wider text-[#F5F5F5]">
          UPPER A
        </h1>
      </div>

      {/* Duration timer + stats */}
      <div className="mb-6 flex items-center gap-4">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2.5",
            workoutComplete
              ? "border-[#22C55E]/30 bg-[#22C55E]/5"
              : "border-[#C9A84C]/20 bg-[#C9A84C]/5"
          )}
        >
          <Timer
            className={cn(
              "h-4 w-4",
              workoutComplete ? "text-[#22C55E]" : "text-[#C9A84C]"
            )}
          />
          <span className="font-mono text-lg tabular-nums text-[#F5F5F5]">
            {formatDuration(duration)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-[#525252]">
          <span className="text-[#A3A3A3]">{completedSets}</span>
          <span>/</span>
          <span>{totalSets} sets</span>
        </div>
      </div>

      {/* Exercise list */}
      <div className="space-y-4">
        {mockExercises.map((exercise, index) => (
          <ExerciseCard
            key={index}
            name={exercise.name}
            targetSets={exercise.sets}
            targetReps={exercise.reps}
            rest={exercise.rest}
            cue={exercise.cue}
            previousBest={exercise.previousBest}
            loggedSets={exerciseSets[index] || []}
            onLogSet={(setIndex, data) => handleLogSet(index, setIndex, data)}
            onAddSet={() => handleAddSet(index)}
            onRemoveSet={(setIndex) => handleRemoveSet(index, setIndex)}
          />
        ))}
      </div>

      {/* Complete workout */}
      {!workoutComplete ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#1F1F1F] bg-[#050505]/95 backdrop-blur-sm p-4"
        >
          <div className="mx-auto max-w-2xl">
            <button
              onClick={handleCompleteWorkout}
              disabled={completedSets === 0}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-4",
                "font-heading text-sm tracking-[0.2em] uppercase transition-all",
                completedSets > 0
                  ? "bg-[#C9A84C] text-[#050505] hover:bg-[#C9A84C]/90 active:scale-[0.98]"
                  : "bg-[#1F1F1F] text-[#525252] cursor-not-allowed"
              )}
            >
              <CheckCircle2 className="h-5 w-5" />
              Complete Workout
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/5 p-6 text-center"
        >
          <CheckCircle2 className="mx-auto h-10 w-10 text-[#22C55E] mb-3" />
          <h2 className="font-heading text-lg tracking-wider text-[#22C55E] mb-1">
            WORKOUT COMPLETE
          </h2>
          <p className="font-mono text-sm text-[#A3A3A3]">
            {completedSets} sets logged in {formatDuration(duration)}
          </p>
        </motion.div>
      )}
    </div>
  );
}
