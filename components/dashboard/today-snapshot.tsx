"use client";

import { motion } from "framer-motion";
import { Check, Circle, Clock, Dumbbell, UtensilsCrossed, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  category: "workout" | "nutrition" | "habit" | "mindset" | "custom";
  completed: boolean;
}

interface TodaySnapshotProps {
  tasks?: Task[];
  nextDeadline?: Date;
}

const categoryConfig: Record<
  Task["category"],
  { color: string; bg: string; border: string }
> = {
  workout: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  nutrition: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  habit: {
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  mindset: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  custom: {
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30",
  },
};

const defaultTasks: Task[] = [
  { id: "1", title: "Upper A — Bench, Row, OHP, Pulldown", category: "workout", completed: false },
  { id: "2", title: "Hit protein target (160g)", category: "nutrition", completed: false },
  { id: "3", title: "Drink 3L water", category: "habit", completed: false },
  { id: "4", title: "Take creatine (5g)", category: "habit", completed: false },
  { id: "5", title: "Sign your first contract", category: "mindset", completed: false },
];

function getDefaultDeadline(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  return d;
}

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TodaySnapshot({ tasks, nextDeadline }: TodaySnapshotProps) {
  const items = tasks ?? defaultTasks;
  const deadline = nextDeadline ?? getDefaultDeadline();
  const completedCount = items.filter((t) => t.completed).length;

  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      setTimeLeft(formatTimeLeft(deadline.getTime() - Date.now()));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col rounded-xl border border-[#1F1F1F] bg-[#111111] p-5"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold tracking-wider text-[#F5F5F5]">
          TODAY&apos;S CONTRACT
        </h2>
        <span className="font-mono text-xs text-[#A3A3A3]">
          {completedCount}/{items.length} complete
        </span>
      </div>

      {/* Task list */}
      <div className="flex-1 space-y-2">
        {items.map((task, i) => {
          const cat = categoryConfig[task.category];
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-2.5"
            >
              {task.completed ? (
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/20">
                  <Check className="h-3 w-3 text-[#C9A84C]" />
                </div>
              ) : (
                <Circle className="h-5 w-5 flex-shrink-0 text-[#525252]" />
              )}
              <span
                className={`flex-1 text-sm ${
                  task.completed
                    ? "text-[#525252] line-through"
                    : "text-[#F5F5F5]"
                }`}
              >
                {task.title}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${cat.color} ${cat.bg} border ${cat.border}`}
              >
                {task.category}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Countdown */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-2">
        <Clock className="h-4 w-4 text-[#C9A84C]" />
        <span className="text-xs text-[#A3A3A3]">Day ends in</span>
        <span className="font-mono text-sm font-bold text-[#C9A84C]">{timeLeft ?? "--:--:--"}</span>
      </div>

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Link
          href="/workout"
          className="flex flex-col items-center gap-1 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-2 py-3 text-[#A3A3A3] transition-colors hover:border-[#C9A84C]/30 hover:text-[#C9A84C]"
        >
          <Dumbbell className="h-4 w-4" />
          <span className="text-[10px] font-medium">Log Workout</span>
        </Link>
        <Link
          href="/dashboard/stats"
          className="flex flex-col items-center gap-1 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-2 py-3 text-[#A3A3A3] transition-colors hover:border-[#C9A84C]/30 hover:text-[#C9A84C]"
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span className="text-[10px] font-medium">Log Meal</span>
        </Link>
        <Link
          href="/contract"
          className="flex flex-col items-center gap-1 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-2 py-3 text-[#A3A3A3] transition-colors hover:border-[#C9A84C]/30 hover:text-[#C9A84C]"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-[10px] font-medium">Check In</span>
        </Link>
      </div>
    </motion.div>
  );
}
