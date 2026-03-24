"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SetData {
  weight: number;
  reps: number;
  rpe: number;
}

export interface SetLoggerProps {
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  onChange: (data: SetData) => void;
  onRemove: () => void;
}

export function SetLogger({
  setNumber,
  weight,
  reps,
  rpe,
  onChange,
  onRemove,
}: SetLoggerProps) {
  const handleChange = (field: keyof SetData, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      weight: field === "weight" ? numValue : weight,
      reps: field === "reps" ? numValue : reps,
      rpe: field === "rpe" ? numValue : rpe,
    });
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-2">
      {/* Set number */}
      <span className="w-10 shrink-0 font-mono text-xs text-[#525252]">
        Set {setNumber}
      </span>

      {/* Weight input */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={weight || ""}
          onChange={(e) => handleChange("weight", e.target.value)}
          placeholder="0"
          className={cn(
            "h-10 w-16 rounded-md border border-[#1F1F1F] bg-[#111111] px-2 text-center",
            "font-mono text-sm text-[#F5F5F5] placeholder:text-[#525252]",
            "focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/30",
            "transition-colors"
          )}
          min={0}
          step={2.5}
        />
        <span className="font-mono text-[10px] text-[#525252]">kg</span>
      </div>

      {/* Separator */}
      <span className="font-mono text-xs text-[#525252]">&times;</span>

      {/* Reps input */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={reps || ""}
          onChange={(e) => handleChange("reps", e.target.value)}
          placeholder="0"
          className={cn(
            "h-10 w-14 rounded-md border border-[#1F1F1F] bg-[#111111] px-2 text-center",
            "font-mono text-sm text-[#F5F5F5] placeholder:text-[#525252]",
            "focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/30",
            "transition-colors"
          )}
          min={0}
        />
        <span className="font-mono text-[10px] text-[#525252]">reps</span>
      </div>

      {/* RPE badge */}
      <div className="flex items-center gap-1 ml-auto">
        <span className="font-mono text-[10px] text-[#525252]">RPE</span>
        <input
          type="number"
          value={rpe || ""}
          onChange={(e) => handleChange("rpe", e.target.value)}
          placeholder="-"
          className={cn(
            "h-10 w-12 rounded-md border border-[#1F1F1F] bg-[#111111] px-1 text-center",
            "font-mono text-sm placeholder:text-[#525252]",
            "focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/30",
            "transition-colors",
            rpe >= 9 ? "text-[#EF4444]" : rpe >= 7 ? "text-[#F59E0B]" : "text-[#22C55E]"
          )}
          min={1}
          max={10}
        />
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="shrink-0 rounded-md p-1.5 text-[#525252] hover:bg-[#1F1F1F] hover:text-[#EF4444] transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
