"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SignatureSliderProps {
  onSign: () => void;
  signed: boolean;
  signedAt?: string;
}

export function SignatureSlider({ onSign, signed, signedAt }: SignatureSliderProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasCommitted, setHasCommitted] = useState(signed);
  const x = useMotionValue(0);

  const trackWidth = 320;
  const handleWidth = 56;
  const threshold = trackWidth - handleWidth - 16;

  const backgroundOpacity = useTransform(x, [0, threshold], [0, 1]);
  const textOpacity = useTransform(x, [0, threshold * 0.3], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    const currentX = x.get();
    if (currentX >= threshold * 0.85) {
      setHasCommitted(true);
      onSign();
    }
  };

  if (signed || hasCommitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-2 py-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E]/20">
            <Check className="h-4 w-4 text-[#22C55E]" />
          </div>
          <span className="font-heading text-lg tracking-wider text-[#22C55E]">
            COMMITTED
          </span>
        </div>
        {signedAt && (
          <span className="font-mono text-[11px] text-[#525252]">
            Signed at {signedAt}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[#525252]">
        Commit to today&apos;s contract
      </p>

      <div
        ref={constraintsRef}
        className={cn(
          "relative h-14 w-full max-w-[320px] overflow-hidden rounded-full",
          "border border-[#C9A84C]/30 bg-[#0A0A0A]"
        )}
      >
        {/* Gold fill background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            opacity: backgroundOpacity,
            background: "linear-gradient(90deg, #C9A84C22, #C9A84C44)",
          }}
        />

        {/* Track text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: textOpacity }}
        >
          <span className="font-heading text-xs tracking-[0.25em] text-[#C9A84C]/50 select-none">
            SLIDE TO COMMIT
          </span>
        </motion.div>

        {/* Chevron hints */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-30">
          <ChevronRight className="h-4 w-4 text-[#C9A84C]" />
          <ChevronRight className="h-4 w-4 -ml-2 text-[#C9A84C]" />
        </div>

        {/* Drag handle */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: threshold }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className={cn(
            "absolute left-1 top-1 z-10 flex h-12 w-12 cursor-grab items-center justify-center",
            "rounded-full border border-[#C9A84C] bg-gradient-to-br from-[#C9A84C] to-[#A08530]",
            "shadow-lg shadow-[#C9A84C]/20 active:cursor-grabbing",
            isDragging && "scale-105"
          )}
          whileTap={{ scale: 1.05 }}
        >
          <ChevronRight className="h-5 w-5 text-[#050505]" strokeWidth={2.5} />
        </motion.div>
      </div>
    </div>
  );
}
