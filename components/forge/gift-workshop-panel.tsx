"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  X,
  Upload,
  Link as LinkIcon,
  Dumbbell,
  Sparkles,
  UtensilsCrossed,
  Plane,
  Monitor,
  Star,
  Loader2,
} from "lucide-react";
import type {
  RewardCategory,
  RewardTier,
  PriceSuggestion,
  RewardConditions,
} from "@/lib/drachma/engine";

interface GiftWorkshopPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onForge: (reward: NewRewardData) => void;
  onSaveDraft: (reward: NewRewardData) => void;
}

export interface NewRewardData {
  name: string;
  description: string;
  externalLink: string;
  category: RewardCategory;
  tier: RewardTier["name"];
  cost: number;
  images: string[];
  conditions: RewardConditions;
  isPriority: boolean;
}

const CATEGORIES: { value: RewardCategory; label: string; Icon: React.ElementType }[] = [
  { value: "gear", label: "Gear", Icon: Dumbbell },
  { value: "experience", label: "Experience", Icon: Sparkles },
  { value: "food", label: "Food", Icon: UtensilsCrossed },
  { value: "travel", label: "Travel", Icon: Plane },
  { value: "tech", label: "Tech", Icon: Monitor },
  { value: "custom", label: "Custom", Icon: Star },
];

export function GiftWorkshopPanel({
  isOpen,
  onClose,
  onForge,
  onSaveDraft,
}: GiftWorkshopPanelProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [category, setCategory] = useState<RewardCategory>("custom");
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [conditions, setConditions] = useState<RewardConditions>({});
  const [isPriority, setIsPriority] = useState(false);
  const [suggestion, setSuggestion] = useState<PriceSuggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const fetchSuggestion = useCallback(async () => {
    if (!name.trim()) return;
    setLoadingSuggestion(true);
    try {
      const res = await fetch("/api/rewards/suggest-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      setSuggestion(data.suggestion);
    } catch {
      // Fallback suggestion
      setSuggestion({
        suggestedPrice: 100,
        tier: "small",
        reasoning: "Default pricing applied.",
        estimatedDays: 4,
      });
    } finally {
      setLoadingSuggestion(false);
    }
  }, [name, description]);

  const handleAddImageUrl = () => {
    if (urlInput.trim() && images.length < 5) {
      setImages([...images, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const buildRewardData = (): NewRewardData => ({
    name,
    description,
    externalLink,
    category,
    tier: suggestion?.tier || "small",
    cost: suggestion?.suggestedPrice || 100,
    images,
    conditions,
    isPriority,
  });

  const handleForge = () => {
    onForge(buildRewardData());
    resetForm();
  };

  const handleSaveDraft = () => {
    onSaveDraft(buildRewardData());
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setExternalLink("");
    setCategory("custom");
    setImages([]);
    setUrlInput("");
    setConditions({});
    setIsPriority(false);
    setSuggestion(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative mx-4 my-8 w-full max-w-2xl rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A]"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1F1F1F] p-5">
              <h2 className="font-heading text-lg font-bold text-[#C9A84C]">
                Gift Workshop
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#525252] transition-colors hover:bg-[#1F1F1F] hover:text-[#F5F5F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-5">
              {/* Section 1: Media */}
              <div className="space-y-3">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-[#525252]">
                  Media
                </h3>
                <div className="rounded-xl border-2 border-dashed border-[#1F1F1F] p-6 text-center transition-colors hover:border-[#333333]">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-[#525252]" />
                  <p className="text-xs text-[#A3A3A3]">
                    Drag & drop images here (max 5)
                  </p>
                  <p className="mt-1 text-[10px] text-[#525252]">
                    or paste a URL below
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 py-2 font-mono text-xs text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]/40 focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleAddImageUrl()}
                  />
                  <button
                    onClick={handleAddImageUrl}
                    disabled={!urlInput.trim() || images.length >= 5}
                    className="rounded-lg bg-[#1F1F1F] px-3 py-2 text-xs text-[#A3A3A3] transition-colors hover:bg-[#333333] disabled:opacity-40"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {images.map((url, i) => (
                      <div
                        key={i}
                        className="group flex items-center gap-1.5 rounded-lg bg-[#1F1F1F] px-2 py-1"
                      >
                        <span className="max-w-[120px] truncate font-mono text-[10px] text-[#A3A3A3]">
                          {url}
                        </span>
                        <button
                          onClick={() => handleRemoveImage(i)}
                          className="text-[#525252] hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Details */}
              <div className="space-y-3">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-[#525252]">
                  Details
                </h3>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Reward name..."
                  className="w-full rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 py-2.5 text-sm text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]/40 focus:outline-none"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 py-2.5 text-sm text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]/40 focus:outline-none"
                />
                <input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="External link (optional)..."
                  className="w-full rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 py-2.5 font-mono text-xs text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]/40 focus:outline-none"
                />
                {/* Category tiles */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                        category === cat.value
                          ? "border-[#C9A84C]/40 bg-[#C9A84C]/5 text-[#C9A84C]"
                          : "border-[#1F1F1F] bg-[#111111] text-[#525252] hover:border-[#333333] hover:text-[#A3A3A3]"
                      )}
                    >
                      <cat.Icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 3: AGON'S VERDICT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-[#525252]">
                    {"AGON's Verdict"}
                  </h3>
                  <button
                    onClick={fetchSuggestion}
                    disabled={!name.trim() || loadingSuggestion}
                    className="flex items-center gap-1.5 rounded-lg bg-[#C9A84C]/10 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/20 disabled:opacity-40"
                  >
                    {loadingSuggestion ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    Get Price
                  </button>
                </div>

                {suggestion ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C]/5 to-transparent p-4 gold-glow-sm"
                  >
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="font-heading text-xs uppercase tracking-widest text-[#C9A84C]/60">
                          Suggested Price
                        </span>
                        <div className="mt-1 font-mono text-2xl font-bold text-[#C9A84C]">
                          {suggestion.suggestedPrice.toLocaleString()}₯
                        </div>
                      </div>
                      <span className="rounded-md bg-[#C9A84C]/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#C9A84C]">
                        {suggestion.tier}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#A3A3A3]">
                      {suggestion.reasoning}
                    </p>
                    <div className="mt-2 font-mono text-[10px] text-[#525252]">
                      Estimated time: ~{suggestion.estimatedDays} days
                    </div>
                  </motion.div>
                ) : (
                  <div className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-6 text-center text-xs text-[#525252]">
                    Enter a reward name and click &quot;Get Price&quot; for AGON&apos;s pricing verdict
                  </div>
                )}
              </div>

              {/* Section 4: Conditions */}
              <div className="space-y-3">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-[#525252]">
                  Conditions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#525252]">
                      Min Rank
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={conditions.minRank || ""}
                      onChange={(e) =>
                        setConditions({
                          ...conditions,
                          minRank: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 py-2 font-mono text-xs text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#525252]">
                      Min Streak
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={conditions.minStreak || ""}
                      onChange={(e) =>
                        setConditions({
                          ...conditions,
                          minStreak: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 py-2 font-mono text-xs text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]/40 focus:outline-none"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPriority}
                    onChange={(e) => setIsPriority(e.target.checked)}
                    className="h-4 w-4 rounded border-[#1F1F1F] bg-[#111111] accent-[#C9A84C]"
                  />
                  <span className="text-xs text-[#A3A3A3]">
                    Mark as priority goal
                  </span>
                </label>
              </div>

              {/* Section 5: Live preview + actions */}
              <div className="space-y-3">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-[#525252]">
                  Preview
                </h3>
                <div className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1A1A1A]">
                      {(() => {
                        const Cat = CATEGORIES.find((c) => c.value === category)?.Icon || Star;
                        return (
                          <Cat
                            className={cn(
                              "h-5 w-5",
                              category === "custom" ? "text-[#525252]" : "text-[#C9A84C]"
                            )}
                          />
                        );
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-semibold text-[#F5F5F5]">
                          {name || "Reward Name"}
                        </span>
                        {isPriority && (
                          <Star className="h-3 w-3 fill-[#C9A84C] text-[#C9A84C]" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#525252] line-clamp-1">
                        {description || "No description"}
                      </p>
                      {suggestion && (
                        <div className="mt-1 font-mono text-sm font-bold text-[#C9A84C]">
                          {suggestion.suggestedPrice.toLocaleString()}₯
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleForge}
                  disabled={!name.trim() || !suggestion}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#B8943D] px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider text-[#050505] transition-all hover:from-[#D4B355] hover:to-[#C9A84C] disabled:opacity-40 disabled:hover:from-[#C9A84C]"
                >
                  Forge This Goal
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={!name.trim()}
                  className="rounded-xl border border-[#1F1F1F] bg-[#111111] px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider text-[#A3A3A3] transition-all hover:border-[#333333] hover:text-[#F5F5F5] disabled:opacity-40"
                >
                  Save Draft
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
