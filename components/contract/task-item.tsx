"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProofUpload } from "./proof-upload";

export interface TaskItemProps {
  id: string;
  title: string;
  category: "workout" | "nutrition" | "habit" | "mindset" | "custom";
  description?: string;
  completed: boolean;
  proofRequired: boolean;
  proofUrl?: string;
  deadline?: string;
  onComplete: (id: string) => void;
  onUploadProof: (id: string, file: File) => void;
}

const categoryColors: Record<TaskItemProps["category"], string> = {
  workout: "bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30",
  nutrition: "bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30",
  habit: "bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30",
  mindset: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
  custom: "bg-[#6B7280]/20 text-[#6B7280] border-[#6B7280]/30",
};

const categoryLabels: Record<TaskItemProps["category"], string> = {
  workout: "WORKOUT",
  nutrition: "NUTRITION",
  habit: "HABIT",
  mindset: "MINDSET",
  custom: "CUSTOM",
};

export function TaskItem({
  id,
  title,
  category,
  description,
  completed,
  proofRequired,
  proofUrl,
  deadline,
  onComplete,
  onUploadProof,
}: TaskItemProps) {
  const [showProofUpload, setShowProofUpload] = useState(false);

  const handleUpload = (file: File) => {
    onUploadProof(id, file);
    setShowProofUpload(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group relative flex items-start gap-3 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-4 transition-colors",
        completed && "opacity-60"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onComplete(id)}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
          completed
            ? "border-[#C9A84C] bg-[#C9A84C]"
            : "border-[#525252] hover:border-[#C9A84C]/60"
        )}
      >
        {completed && <Check className="h-3 w-3 text-[#050505]" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider",
              categoryColors[category]
            )}
          >
            {categoryLabels[category]}
          </span>
          {deadline && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#525252] font-mono">
              <Clock className="h-3 w-3" />
              {deadline}
            </span>
          )}
          {proofRequired && !proofUrl && (
            <span className="text-[10px] text-[#F59E0B]/70 font-mono uppercase">
              Proof needed
            </span>
          )}
        </div>

        <p
          className={cn(
            "text-sm text-[#F5F5F5] leading-snug",
            completed && "line-through text-[#525252]"
          )}
        >
          {title}
        </p>

        {description && (
          <p className="mt-1 text-xs text-[#525252] leading-relaxed">
            {description}
          </p>
        )}

        {/* Proof upload area */}
        {showProofUpload && (
          <div className="mt-3">
            <ProofUpload
              onUpload={handleUpload}
              currentProofUrl={proofUrl}
            />
          </div>
        )}

        {proofUrl && !showProofUpload && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#22C55E]">
            <Check className="h-3 w-3" />
            <span>Proof uploaded</span>
          </div>
        )}
      </div>

      {/* Proof upload button */}
      {proofRequired && (
        <button
          onClick={() => setShowProofUpload(!showProofUpload)}
          className={cn(
            "shrink-0 rounded-md border border-[#1F1F1F] p-2 transition-colors",
            proofUrl
              ? "text-[#22C55E] hover:bg-[#22C55E]/10"
              : "text-[#525252] hover:text-[#C9A84C] hover:border-[#C9A84C]/30"
          )}
        >
          {showProofUpload ? (
            <X className="h-4 w-4" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Mobile swipe hint */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none md:hidden">
        <span className="text-[10px] text-[#525252]">&larr;</span>
      </div>
    </motion.div>
  );
}
