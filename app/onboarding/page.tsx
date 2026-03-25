"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepStats } from "@/components/onboarding/step-stats";
import { StepWhy } from "@/components/onboarding/step-why";
import { StepSchedule } from "@/components/onboarding/step-schedule";
import { StepAccountability } from "@/components/onboarding/step-accountability";
import { StepSanctions } from "@/components/onboarding/step-sanctions";
import { StepVoice } from "@/components/onboarding/step-voice";
import { StepOath } from "@/components/onboarding/step-oath";

export interface OnboardingData {
  height: number;
  currentWeight: number;
  targetWeight: number;
  age: number;
  bodyFatEstimate: number;
  whyText: string;
  wakeUpTime: string;
  timezone: string;
  startDate: string;
  accountabilityLevel: "firm" | "drill_sergeant" | "emotional_warfare";
  sanctions: {
    missedWorkout: string;
    missedTwoDays: string;
    brokenStreak: string;
    lowHonor: string;
    missedNutrition: string;
  };
}

const TOTAL_STEPS = 8;

const stepLabels = [
  "Welcome",
  "Your Stats",
  "Your Why",
  "Schedule",
  "Accountability",
  "Sanctions",
  "Voice",
  "The Oath",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    height: 175,
    currentWeight: 80,
    targetWeight: 75,
    age: 30,
    bodyFatEstimate: 20,
    whyText: "",
    wakeUpTime: "05:00",
    timezone: "Europe/Paris",
    startDate: "2026-03-24",
    accountabilityLevel: "emotional_warfare",
    sanctions: {
      missedWorkout: "Cold shower \u2014 video proof required",
      missedTwoDays: "Why letter read aloud",
      brokenStreak: "No entertainment for 48 hours",
      lowHonor: "AI disappointment letter",
      missedNutrition: "Mandatory meal prep Sunday \u2014 photo proof",
    },
  });

  const updateData = useCallback(
    (updates: Partial<OnboardingData>) => {
      setData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const updateSanctions = useCallback(
    (updates: Partial<OnboardingData["sanctions"]>) => {
      setData((prev) => ({
        ...prev,
        sanctions: { ...prev.sanctions, ...updates },
      }));
    },
    []
  );

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 2:
        return data.whyText.length >= 50;
      case 1:
        return (
          data.height > 0 &&
          data.currentWeight > 0 &&
          data.targetWeight > 0 &&
          data.age > 0
        );
      default:
        return true;
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Non-blocking — still redirect even if API call fails
    }
    // Always redirect after a short delay for the animation
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepWelcome onBegin={goNext} />;
      case 1:
        return <StepStats data={data} onChange={updateData} />;
      case 2:
        return <StepWhy data={data} onChange={updateData} />;
      case 3:
        return <StepSchedule data={data} onChange={updateData} />;
      case 4:
        return <StepAccountability data={data} onChange={updateData} />;
      case 5:
        return (
          <StepSanctions
            data={data}
            onChangeSanctions={updateSanctions}
          />
        );
      case 6:
        return <StepVoice data={data} onChange={updateData} />;
      case 7:
        return <StepOath data={data} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505]">
      {/* Progress bar */}
      {currentStep > 0 && (
        <div className="fixed top-0 right-0 left-0 z-50">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-4">
            <span className="font-mono text-xs text-[#525252]">
              {currentStep}/{TOTAL_STEPS - 1}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#1F1F1F]">
              <motion.div
                className="h-full rounded-full bg-[#C9A84C]"
                initial={{ width: 0 }}
                animate={{
                  width: `${(currentStep / (TOTAL_STEPS - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-[#525252]">
              {stepLabels[currentStep]}
            </span>
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
        <div className="fixed bottom-0 right-0 left-0 z-50 border-t border-[#1F1F1F] bg-[#050505]/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
            <button
              onClick={goBack}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-[#A3A3A3] transition-colors hover:text-[#F5F5F5]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={goNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-lg bg-[#C9A84C] px-6 py-2.5 text-sm font-semibold text-[#050505] transition-all hover:bg-[#C9A84C]/90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Back button only on oath step */}
      {currentStep === TOTAL_STEPS - 1 && (
        <div className="fixed bottom-0 left-0 z-50 p-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-[#525252] transition-colors hover:text-[#A3A3A3]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      )}
    </div>
  );
}
