"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Dumbbell, BedDouble } from "lucide-react";
import { AudioPlayer } from "@/components/voice/audio-player";

interface EmergencyProtocolProps {
  /** Whether the protocol overlay is visible */
  isOpen: boolean;
  /** Close the protocol */
  onClose: () => void;
  /** Why Vault entries to draw from */
  whyEntries?: string[];
  /** Current consecutive zero days (auto-trigger if >= 3) */
  zeroDayStreak?: number;
}

const MICRO_TASKS = [
  "Do 10 pushups right now.",
  "Hold a plank for 30 seconds.",
  "Do 20 bodyweight squats.",
  "Walk for 5 minutes. Just 5.",
  "Do 15 jumping jacks.",
  "Drink a full glass of water. Then 10 pushups.",
  "5 burpees. That is all.",
  "Stand up and stretch for 2 minutes.",
  "Do 10 lunges per leg.",
  "Hold a wall sit for 45 seconds.",
];

const DEFAULT_WHY_ENTRIES = [
  "Because you made a promise to yourself — and that person is counting on you.",
  "Because the version of you that started this journey believed you could finish it.",
  "Because discipline is what remains when motivation fades.",
  "Because one year from now, you will wish you had kept going today.",
  "Because you are stronger than any excuse your mind can manufacture.",
];

export function EmergencyProtocol({
  isOpen,
  onClose,
  whyEntries,
  zeroDayStreak = 0,
}: EmergencyProtocolProps) {
  const [phase, setPhase] = useState<"reveal" | "choice" | "task" | "rest">(
    "reveal"
  );
  const [selectedWhy, setSelectedWhy] = useState("");
  const [microTask, setMicroTask] = useState("");
  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer | undefined>();
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);

  const entries =
    whyEntries && whyEntries.length > 0 ? whyEntries : DEFAULT_WHY_ENTRIES;

  // Pick random entries on open — done in useEffect to avoid hydration mismatch
  useEffect(() => {
    if (isOpen) {
      setSelectedWhy(entries[Math.floor(Math.random() * entries.length)]);
      setMicroTask(
        MICRO_TASKS[Math.floor(Math.random() * MICRO_TASKS.length)]
      );
      setPhase("reveal");
      setAudioBuffer(undefined);
    }
  }, [isOpen, entries]);

  // Fetch voice if available
  useEffect(() => {
    if (!isOpen || phase !== "reveal" || !selectedWhy) return;

    const controller = new AbortController();
    fetch("/api/voice/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedWhy }),
      signal: controller.signal,
    })
      .then((r) => {
        if (r.ok) return r.arrayBuffer();
        return null;
      })
      .then((buf) => {
        if (buf) setAudioBuffer(buf);
      })
      .catch(() => {
        /* voice unavailable — silent fallback */
      });

    return () => controller.abort();
  }, [isOpen, phase, selectedWhy]);

  const handleBadDay = () => {
    setPhase("task");
  };

  const handleNeedRest = () => {
    setPhase("rest");
  };

  // Long-press trigger support
  const startHold = useCallback(() => {
    holdStartRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const pct = Math.min(elapsed / 3000, 1);
      setHoldProgress(pct);
    }, 50);
  }, []);

  const endHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="emergency-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop with red tinge */}
        <div className="absolute inset-0 bg-black/95" />

        {/* Red border glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 120px rgba(139, 0, 0, 0.4)",
          }}
          animate={{
            boxShadow: [
              "inset 0 0 120px rgba(139, 0, 0, 0.3)",
              "inset 0 0 160px rgba(139, 0, 0, 0.5)",
              "inset 0 0 120px rgba(139, 0, 0, 0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-[#8B0000]/40 bg-[#0A0A0A] p-6 md:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#525252] hover:text-[#A3A3A3] transition-colors"
            aria-label="Close emergency protocol"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertTriangle className="h-8 w-8 text-[#8B0000]" />
            </motion.div>
            <div>
              <h2 className="font-heading text-xl font-bold tracking-wider text-[#DC2626]">
                EMERGENCY PROTOCOL
              </h2>
              <p className="text-xs text-[#8B0000] font-mono uppercase tracking-widest">
                The Nuclear Option
              </p>
            </div>
          </div>

          {zeroDayStreak >= 3 && (
            <div className="mb-4 rounded-lg border border-[#8B0000]/30 bg-[#8B0000]/10 px-4 py-2">
              <p className="text-sm text-[#DC2626] font-mono">
                {zeroDayStreak} consecutive zero days detected.
              </p>
            </div>
          )}

          {/* Phase: Reveal */}
          {phase === "reveal" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Why Vault entry */}
              <div className="mb-6 rounded-xl border border-[#1F1F1F] bg-[#111111] p-5">
                <p className="text-xs text-[#525252] uppercase tracking-widest mb-3 font-mono">
                  From Your Why Vault
                </p>
                <motion.p
                  className="text-lg leading-relaxed text-[#F5F5F5] font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.2 }}
                >
                  &ldquo;{selectedWhy}&rdquo;
                </motion.p>
              </div>

              {/* Audio player if voice available */}
              {audioBuffer && (
                <div className="mb-6">
                  <AudioPlayer audioBuffer={audioBuffer} />
                </div>
              )}

              {/* Choice buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="mb-4 text-center text-sm text-[#A3A3A3]">
                  What do you need right now?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleBadDay}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-5 text-[#C9A84C] transition-all hover:bg-[#C9A84C]/20 hover:border-[#C9A84C]/50"
                  >
                    <Dumbbell className="h-6 w-6" />
                    <span className="text-sm font-bold">Just a Bad Day</span>
                    <span className="text-[10px] text-[#A3A3A3]">
                      Give me one task
                    </span>
                  </button>
                  <button
                    onClick={handleNeedRest}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[#525252]/30 bg-[#1A1A1A] px-4 py-5 text-[#A3A3A3] transition-all hover:bg-[#222222] hover:border-[#525252]/50"
                  >
                    <BedDouble className="h-6 w-6" />
                    <span className="text-sm font-bold">I Need Rest</span>
                    <span className="text-[10px] text-[#525252]">
                      No penalties
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Phase: Micro Task */}
          {phase === "task" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="mb-2 text-xs text-[#C9A84C] uppercase tracking-widest font-mono">
                Your One Micro-Task
              </p>
              <p className="mb-8 text-2xl font-bold text-[#F5F5F5] font-heading">
                {microTask}
              </p>
              <p className="mb-6 text-sm text-[#A3A3A3]">
                Just this. Nothing else. Do it now and the day is saved.
              </p>
              <button
                onClick={onClose}
                className="rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-8 py-3 text-sm font-bold text-[#C9A84C] transition-all hover:bg-[#C9A84C]/20"
              >
                I Did It
              </button>
            </motion.div>
          )}

          {/* Phase: Rest */}
          {phase === "rest" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="mb-2 text-xs text-[#A3A3A3] uppercase tracking-widest font-mono">
                Sanctioned Rest Day
              </p>
              <p className="mb-4 text-xl font-bold text-[#F5F5F5] font-heading">
                Rest is not defeat.
              </p>
              <p className="mb-8 text-sm text-[#A3A3A3] max-w-sm mx-auto">
                No penalties applied. No honor lost. Recovery is part of the
                process. Come back stronger tomorrow.
              </p>
              <button
                onClick={onClose}
                className="rounded-xl border border-[#1F1F1F] bg-[#111111] px-8 py-3 text-sm font-medium text-[#A3A3A3] transition-all hover:bg-[#1A1A1A]"
              >
                Understood
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Long-press trigger button for Emergency Protocol.
 * Hold for 3 seconds to activate.
 */
export function EmergencyTriggerButton({
  onActivate,
}: {
  onActivate: () => void;
}) {
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);
  const activatedRef = useRef(false);

  const startHold = useCallback(() => {
    activatedRef.current = false;
    holdStartRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const pct = Math.min(elapsed / 3000, 1);
      setHoldProgress(pct);
      if (pct >= 1 && !activatedRef.current) {
        activatedRef.current = true;
        onActivate();
        endHold();
      }
    }, 50);
  }, [onActivate]);

  const endHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      className="relative overflow-hidden rounded-xl border border-[#8B0000]/30 bg-[#8B0000]/10 px-5 py-3 text-sm font-bold text-[#DC2626] transition-all hover:border-[#8B0000]/50"
    >
      <motion.div
        className="absolute inset-0 bg-[#8B0000]/20"
        style={{ originX: 0 }}
        animate={{ scaleX: holdProgress }}
      />
      <span className="relative flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        {holdProgress > 0 ? "Hold..." : "Emergency Protocol"}
      </span>
    </button>
  );
}
