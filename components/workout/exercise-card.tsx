"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Clock, Plus, Dumbbell, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { SetLogger, SetData } from "./set-logger";
import { RestTimer } from "./rest-timer";

export interface LoggedSet {
  weight: number;
  reps: number;
  rpe: number;
}

export interface ExerciseCardProps {
  name: string;
  targetSets: number;
  targetReps: string;
  rest: string;
  cue: string;
  previousBest?: { weight: number; reps: number };
  loggedSets: LoggedSet[];
  onLogSet: (setIndex: number, data: SetData) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
}

function parseRestToSeconds(rest: string): number {
  const match = rest.match(/(\d+)/);
  if (!match) return 120;
  const mins = parseInt(match[1], 10);
  return mins * 60;
}

export function ExerciseCard({
  name,
  targetSets,
  targetReps,
  rest,
  cue,
  previousBest,
  loggedSets,
  onLogSet,
  onAddSet,
  onRemoveSet,
}: ExerciseCardProps) {
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const bestCurrentSet = loggedSets.reduce(
    (best, set) => {
      if (set.weight > best.weight || (set.weight === best.weight && set.reps > best.reps)) {
        return set;
      }
      return best;
    },
    { weight: 0, reps: 0 }
  );

  const improved =
    previousBest &&
    bestCurrentSet.weight > 0 &&
    (bestCurrentSet.weight > previousBest.weight ||
      (bestCurrentSet.weight === previousBest.weight && bestCurrentSet.reps > previousBest.reps));

  const regressed =
    previousBest &&
    bestCurrentSet.weight > 0 &&
    (bestCurrentSet.weight < previousBest.weight ||
      (bestCurrentSet.weight === previousBest.weight && bestCurrentSet.reps < previousBest.reps));

  const completedSets = loggedSets.filter((s) => s.weight > 0 && s.reps > 0).length;

  const handleSetChange = (index: number, data: SetData) => {
    const prevSet = loggedSets[index];
    onLogSet(index, data);

    // Auto-start rest timer when a set is freshly logged (reps goes from 0 to >0)
    if (prevSet.reps === 0 && data.reps > 0 && data.weight > 0) {
      setShowRestTimer(true);
    }
  };

  return (
    <>
      {showRestTimer && (
        <RestTimer
          duration={parseRestToSeconds(rest)}
          onComplete={() => setShowRestTimer(false)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111111]"
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-start justify-between p-4 text-left"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Dumbbell className="h-4 w-4 text-[#C9A84C]" />
              <h3 className="font-heading text-sm tracking-wider text-[#F5F5F5] uppercase">
                {name}
              </h3>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs text-[#C9A84C]">
                {targetSets} &times; {targetReps}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-[#525252]">
                <Clock className="h-3 w-3" />
                {rest} rest
              </span>
              {previousBest && (
                <span className="font-mono text-[11px] text-[#525252]">
                  Last: {previousBest.weight}kg &times; {previousBest.reps}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            {/* Progress indicator */}
            {improved && (
              <span className="flex items-center gap-0.5 text-[#22C55E]">
                <ArrowUp className="h-3.5 w-3.5" />
                <span className="font-mono text-[10px]">PR</span>
              </span>
            )}
            {regressed && (
              <span className="flex items-center gap-0.5 text-[#EF4444]">
                <ArrowDown className="h-3.5 w-3.5" />
              </span>
            )}

            {/* Set counter */}
            <span
              className={cn(
                "font-mono text-xs px-2 py-0.5 rounded-md border",
                completedSets >= targetSets
                  ? "border-[#22C55E]/30 text-[#22C55E] bg-[#22C55E]/10"
                  : "border-[#1F1F1F] text-[#525252]"
              )}
            >
              {completedSets}/{targetSets}
            </span>
          </div>
        </button>

        {/* Cue */}
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-4 pb-2">
              <div className="flex items-start gap-2 rounded-md bg-[#0A0A0A] p-3 border border-[#1F1F1F]">
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#C9A84C]/50" />
                <p className="text-xs text-[#525252] leading-relaxed">{cue}</p>
              </div>
            </div>

            {/* Logged sets */}
            <div className="space-y-1.5 px-4 pb-3">
              {loggedSets.map((set, index) => (
                <SetLogger
                  key={index}
                  setNumber={index + 1}
                  weight={set.weight}
                  reps={set.reps}
                  rpe={set.rpe}
                  onChange={(data) => handleSetChange(index, data)}
                  onRemove={() => onRemoveSet(index)}
                />
              ))}
            </div>

            {/* Add set button */}
            <div className="px-4 pb-4">
              <button
                onClick={onAddSet}
                className={cn(
                  "flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#1F1F1F] py-2.5",
                  "font-mono text-xs text-[#525252] hover:border-[#C9A84C]/30 hover:text-[#C9A84C]",
                  "transition-colors"
                )}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Set
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
