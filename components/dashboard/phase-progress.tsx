"use client";

import { motion } from "framer-motion";

interface PhaseProgressProps {
  currentPhase?: number;
  weekInPhase?: number;
  totalWeeksInPhase?: number;
}

const phases = [
  { name: "Foundation", number: 1 },
  { name: "Hypertrophy", number: 2 },
  { name: "Advanced", number: 3 },
  { name: "Cut", number: 4 },
];

export function PhaseProgress({
  currentPhase = 1,
  weekInPhase = 1,
  totalWeeksInPhase = 12,
}: PhaseProgressProps) {
  const phaseProgress = weekInPhase / totalWeeksInPhase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-5"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold tracking-wider text-[#F5F5F5]">
          PHASE TIMELINE
        </h2>
        <span className="font-mono text-xs text-[#A3A3A3]">
          Week {weekInPhase}/{totalWeeksInPhase}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative px-2">
        {/* Background line */}
        <div className="absolute left-2 right-2 top-[14px] h-[2px] bg-[#1F1F1F]" />

        {/* Progress line up to current phase */}
        <motion.div
          className="absolute left-2 top-[14px] h-[2px]"
          style={{
            background: "linear-gradient(90deg, #C9A84C, #E8D48B)",
          }}
          initial={{ width: 0 }}
          animate={{
            width: `${((currentPhase - 1) / (phases.length - 1)) * 100 + (phaseProgress / (phases.length - 1)) * 100}%`,
          }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />

        {/* Phase markers */}
        <div className="relative flex justify-between">
          {phases.map((phase) => {
            const isActive = phase.number === currentPhase;
            const isCompleted = phase.number < currentPhase;
            const isFuture = phase.number > currentPhase;

            return (
              <div key={phase.number} className="flex flex-col items-center">
                {/* Dot */}
                <motion.div
                  className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: isFuture ? "#1F1F1F" : "#C9A84C",
                    backgroundColor: isCompleted
                      ? "#C9A84C"
                      : isActive
                        ? "#111111"
                        : "#0A0A0A",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + phase.number * 0.1 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#C9A84C]"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(201,168,76,0.4)",
                          "0 0 0 6px rgba(201,168,76,0)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    />
                  )}
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{
                      color: isCompleted
                        ? "#050505"
                        : isActive
                          ? "#C9A84C"
                          : "#525252",
                    }}
                  >
                    {phase.number}
                  </span>
                </motion.div>
                {/* Label */}
                <span
                  className={`mt-2 text-[10px] font-medium ${
                    isActive
                      ? "text-[#C9A84C]"
                      : isCompleted
                        ? "text-[#A3A3A3]"
                        : "text-[#525252]"
                  }`}
                >
                  {phase.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase progress bar */}
      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-[#525252]">
            {phases[currentPhase - 1]?.name} progress
          </span>
          <span className="font-mono text-[10px] text-[#C9A84C]">
            {Math.round(phaseProgress * 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1F1F1F]">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #C9A84C, #E8D48B)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${phaseProgress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
