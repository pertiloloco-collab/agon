"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskItem, TaskItemProps } from "./task-item";
import { SignatureSlider } from "./signature-slider";

export interface ContractTask {
  id: string;
  title: string;
  category: TaskItemProps["category"];
  description?: string;
  completed: boolean;
  proofRequired: boolean;
  proofUrl?: string;
  deadline?: string;
}

export interface ContractCardProps {
  date: string;
  signed: boolean;
  signedAt?: string;
  honorScore: number;
  morningMessage: string;
  tasks: ContractTask[];
  onSign: () => void;
  onTaskComplete: (id: string) => void;
  onTaskUploadProof: (id: string, file: File) => void;
}

function AnimatedMessage({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <p className="text-sm leading-relaxed text-[#A3A3A3]">
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="inline-block w-[2px] h-4 bg-[#C9A84C] ml-0.5 align-text-bottom"
        />
      )}
    </p>
  );
}

export function ContractCard({
  date,
  signed,
  signedAt,
  honorScore,
  morningMessage,
  tasks,
  onSign,
  onTaskComplete,
  onTaskUploadProof,
}: ContractCardProps) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-[#C9A84C]/20 bg-[#111111]",
        "shadow-[0_0_40px_rgba(201,168,76,0.05)]"
      )}
    >
      {/* Decorative corner accents */}
      <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-[#C9A84C]/30 rounded-tl-xl" />
      <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-[#C9A84C]/30 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[#C9A84C]/30 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[#C9A84C]/30 rounded-br-xl" />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-lg tracking-wider text-[#C9A84C]">
              DAILY CONTRACT
            </h2>
            <p className="mt-1 font-mono text-xs text-[#525252]">{date}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-[#1F1F1F] bg-[#0A0A0A] px-2.5 py-1.5">
            <Shield className="h-3.5 w-3.5 text-[#C9A84C]" />
            <span className="font-mono text-xs text-[#A3A3A3]">{honorScore}</span>
          </div>
        </div>

        {/* Morning message */}
        <div className="mb-6 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">
            Morning Briefing
          </p>
          <AnimatedMessage text={morningMessage} />
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#525252] uppercase tracking-wider">
              Progress
            </span>
            <span className="font-mono text-[11px] text-[#A3A3A3]">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1F1F1F]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                progress === 100
                  ? "bg-[#22C55E]"
                  : "bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/60"
              )}
            />
          </div>
        </div>

        {/* Task list */}
        <div className="mb-6 space-y-2">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <TaskItem
                {...task}
                onComplete={onTaskComplete}
                onUploadProof={onTaskUploadProof}
              />
            </motion.div>
          ))}
        </div>

        {/* Signature area */}
        <div className="border-t border-[#1F1F1F] pt-4">
          <SignatureSlider onSign={onSign} signed={signed} signedAt={signedAt} />
        </div>
      </div>
    </motion.div>
  );
}
