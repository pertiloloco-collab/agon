"use client";

import { motion } from "framer-motion";

interface RatioData {
  current: number;
  target: number;
}

interface GreekRatiosProps {
  shoulderToWaist?: RatioData;
  chestWaistDiff?: RatioData;
  armNeck?: RatioData;
}

const defaults: Required<GreekRatiosProps> = {
  shoulderToWaist: { current: 0, target: 1.618 },
  chestWaistDiff: { current: 0, target: 11 },
  armNeck: { current: 0, target: 1.0 },
};

interface RingProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  format?: (v: number) => string;
  delay?: number;
}

function RatioRing({ label, current, target, unit = "", format, delay = 0 }: RingProps) {
  const progress = Math.min(current / target, 1);
  const atTarget = current >= target;
  const radius = 44;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const strokeColor = atTarget ? "#C9A84C" : "#EF4444";
  const displayValue = format ? format(current) : current.toFixed(2);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          width={(radius + strokeWidth) * 2}
          height={(radius + strokeWidth) * 2}
          className="-rotate-90"
        >
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="#1F1F1F"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-lg font-bold"
            style={{ color: strokeColor }}
          >
            {displayValue}
          </span>
          {unit && (
            <span className="text-[10px] text-[#525252]">{unit}</span>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-[#F5F5F5]">{label}</p>
        <p className="text-[10px] text-[#525252]">
          Target: {format ? format(target) : target.toFixed(2)}{unit}
        </p>
      </div>
    </div>
  );
}

export function GreekRatios(props: GreekRatiosProps) {
  const shoulderToWaist = props.shoulderToWaist ?? defaults.shoulderToWaist;
  const chestWaistDiff = props.chestWaistDiff ?? defaults.chestWaistDiff;
  const armNeck = props.armNeck ?? defaults.armNeck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-5"
    >
      <h2 className="mb-5 font-heading text-sm font-semibold tracking-wider text-[#F5F5F5]">
        GREEK PROPORTIONS
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <RatioRing
          label="Shoulder:Waist"
          current={shoulderToWaist.current}
          target={shoulderToWaist.target}
          delay={0.4}
        />
        <RatioRing
          label="Chest-Waist"
          current={chestWaistDiff.current}
          target={chestWaistDiff.target}
          unit={'"'}
          format={(v) => v.toFixed(1)}
          delay={0.5}
        />
        <RatioRing
          label="Arm:Neck"
          current={armNeck.current}
          target={armNeck.target}
          delay={0.6}
        />
      </div>
    </motion.div>
  );
}
