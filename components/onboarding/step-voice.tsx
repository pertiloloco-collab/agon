"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Volume2,
  Shield,
  Heart,
  Sword,
  VolumeX,
  Play,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "@/app/onboarding/page";

type VoiceId = "commander" | "mentor" | "spartan" | "none";

interface StepVoiceProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

interface VoiceOption {
  id: VoiceId;
  name: string;
  description: string;
  icon: React.ReactNode;
  sampleText: string;
}

const voiceOptions: VoiceOption[] = [
  {
    id: "commander",
    name: "Commander",
    description: "Deep, authoritative. Like a battle-hardened general who expects results.",
    icon: <Shield className="h-6 w-6" />,
    sampleText: "You signed the contract. Now honor it. No excuses.",
  },
  {
    id: "mentor",
    name: "Mentor",
    description: "Warm but firm. Like a coach who believes in you but won't let you slack.",
    icon: <Heart className="h-6 w-6" />,
    sampleText: "I know it's hard today. But you've been through worse. Let's go.",
  },
  {
    id: "spartan",
    name: "Spartan",
    description: "Intense, warrior energy. Raw. Unrelenting. Laconic.",
    icon: <Sword className="h-6 w-6" />,
    sampleText: "Pain is weakness leaving the body. Move.",
  },
];

export function StepVoice({ data, onChange }: StepVoiceProps) {
  const [playingId, setPlayingId] = useState<VoiceId | null>(null);
  const [loadingId, setLoadingId] = useState<VoiceId | null>(null);

  const selectedVoice = (data as OnboardingData & { voiceId?: VoiceId }).voiceId ?? "commander";

  const handlePlaySample = useCallback(
    async (option: VoiceOption) => {
      if (playingId === option.id || loadingId === option.id) return;

      setLoadingId(option.id);
      try {
        const response = await fetch("/api/voice/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: option.sampleText,
            voiceId: option.id,
          }),
        });

        if (!response.ok) {
          setLoadingId(null);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        setLoadingId(null);
        setPlayingId(option.id);

        audio.onended = () => {
          setPlayingId(null);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setPlayingId(null);
          URL.revokeObjectURL(url);
        };

        audio.play().catch(() => {
          setPlayingId(null);
          URL.revokeObjectURL(url);
        });
      } catch {
        setLoadingId(null);
      }
    },
    [playingId, loadingId]
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#111111]">
            <Volume2 className="h-8 w-8 text-[#C9A84C]" />
          </div>
        </div>
        <h2 className="mb-3 font-heading text-3xl font-bold text-[#F5F5F5]">
          CHOOSE AGON&apos;S VOICE
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[#A3A3A3]">
          How should AGON sound when speaking to you?
        </p>
      </motion.div>

      <div className="space-y-3">
        {voiceOptions.map((option, i) => {
          const isSelected = selectedVoice === option.id;
          const isPlaying = playingId === option.id;
          const isLoading = loadingId === option.id;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * (i + 1) }}
            >
              <button
                onClick={() => onChange({ voiceId: option.id } as Partial<OnboardingData>)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all",
                  isSelected
                    ? "border-[#C9A84C]/50 bg-[#C9A84C]/5"
                    : "border-[#1F1F1F] bg-[#111111] hover:border-[#C9A84C]/20"
                )}
                style={
                  isSelected
                    ? {
                        boxShadow:
                          "0 0 20px rgba(201, 168, 76, 0.1), inset 0 0 20px rgba(201, 168, 76, 0.03)",
                      }
                    : undefined
                }
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                      isSelected
                        ? "border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]"
                        : "border-[#1F1F1F] bg-[#050505] text-[#525252]"
                    )}
                  >
                    {option.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "font-heading text-sm font-semibold uppercase tracking-wider",
                        isSelected ? "text-[#C9A84C]" : "text-[#F5F5F5]"
                      )}
                    >
                      {option.name}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#A3A3A3]">
                      {option.description}
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] italic text-[#525252]">
                      &ldquo;{option.sampleText}&rdquo;
                    </p>
                  </div>

                  {/* Play button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySample(option);
                    }}
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all",
                      isPlaying
                        ? "border-[#C9A84C] bg-[#C9A84C]/20 text-[#C9A84C]"
                        : "border-[#1F1F1F] bg-[#050505] text-[#525252] hover:border-[#C9A84C]/30 hover:text-[#C9A84C]"
                    )}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : isPlaying ? (
                      <Volume2 className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </button>
            </motion.div>
          );
        })}

        {/* Skip option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => onChange({ voiceId: "none" } as Partial<OnboardingData>)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-medium transition-all",
              selectedVoice === "none"
                ? "border-[#C9A84C]/50 bg-[#C9A84C]/5 text-[#C9A84C]"
                : "border-[#1F1F1F] bg-[#111111] text-[#525252] hover:border-[#C9A84C]/20 hover:text-[#A3A3A3]"
            )}
          >
            <VolumeX className="h-4 w-4" />
            Skip &mdash; text only
          </button>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-xs text-[#525252]"
      >
        Voice is optional. You can change it later in settings.
      </motion.p>
    </div>
  );
}
