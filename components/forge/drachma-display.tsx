"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface DrachmaDisplayProps {
  balance: number;
  showRate?: boolean;
  weeklyAverage?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
  const [displayValue, setDisplayValue] = useState("0");
  const prevValue = useRef(0);

  useEffect(() => {
    spring.set(prevValue.current);
    // small delay to ensure initial render before animating
    const raf = requestAnimationFrame(() => {
      spring.set(value);
      prevValue.current = value;
    });
    return () => cancelAnimationFrame(raf);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setDisplayValue(v));
    return unsubscribe;
  }, [display]);

  return <>{displayValue}</>;
}

export function DrachmaDisplay({
  balance,
  showRate = false,
  weeklyAverage = 0,
  size = "md",
  className,
}: DrachmaDisplayProps) {
  const isNegative = balance < 0;

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const symbolClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex flex-col items-end gap-0.5", className)}>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-heading font-semibold",
            symbolClasses[size],
            isNegative ? "text-red-500" : "text-[#C9A84C]"
          )}
        >
          ₯
        </span>
        <motion.span
          className={cn(
            "font-mono font-bold tabular-nums tracking-tight",
            sizeClasses[size],
            isNegative ? "text-red-500" : "text-[#C9A84C]"
          )}
          key={balance}
        >
          <AnimatedNumber value={balance} />
        </motion.span>
      </div>

      {showRate && weeklyAverage > 0 && (
        <div className="flex items-center gap-1 text-[#525252]">
          <TrendingUp className="h-3 w-3 text-[#C9A84C]/60" />
          <span className="font-mono text-xs">
            +{weeklyAverage.toFixed(0)}₯/week
          </span>
        </div>
      )}
    </div>
  );
}
