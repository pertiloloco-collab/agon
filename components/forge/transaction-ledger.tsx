"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, ShoppingBag, Filter } from "lucide-react";
import type { LedgerEntry } from "@/lib/drachma/engine";

interface TransactionLedgerProps {
  entries: LedgerEntry[];
  className?: string;
}

type FilterType = "all" | "earn" | "burn" | "purchase";

export function TransactionLedger({ entries, className }: TransactionLedgerProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredEntries = entries.filter((entry) => {
    if (filter === "all") return true;
    if (filter === "earn") return entry.amount > 0;
    if (filter === "burn") return entry.amount < 0 && !entry.description.startsWith("Forged:");
    if (filter === "purchase") return entry.description.startsWith("Forged:");
    return true;
  });

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Earned", value: "earn" },
    { label: "Burned", value: "burn" },
    { label: "Purchases", value: "purchase" },
  ];

  return (
    <div className={cn("rounded-xl border border-[#1F1F1F] bg-[#111111]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1F1F1F] px-4 py-3">
        <h3 className="font-heading text-sm font-semibold text-[#F5F5F5]">
          Transaction Ledger
        </h3>
        <div className="flex items-center gap-1">
          <Filter className="mr-1 h-3 w-3 text-[#525252]" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors",
                filter === f.value
                  ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                  : "text-[#525252] hover:text-[#A3A3A3]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      <div className="max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredEntries.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-[#525252]">
              No transactions found
            </div>
          ) : (
            filteredEntries.map((entry, index) => {
              const isEarning = entry.amount > 0;
              const isPurchase = entry.description.startsWith("Forged:");

              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-3 border-b border-[#1F1F1F]/50 px-4 py-2.5 last:border-0"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      isPurchase
                        ? "bg-[#9B59B6]/10"
                        : isEarning
                          ? "bg-emerald-500/10"
                          : "bg-red-500/10"
                    )}
                  >
                    {isPurchase ? (
                      <ShoppingBag className="h-3.5 w-3.5 text-[#9B59B6]" />
                    ) : isEarning ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </div>

                  {/* Description + date */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-xs font-medium text-[#F5F5F5]">
                      {entry.description}
                    </span>
                    <span className="font-mono text-[10px] text-[#525252]">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Amount */}
                  <span
                    className={cn(
                      "shrink-0 font-mono text-sm font-bold tabular-nums",
                      isPurchase
                        ? "text-[#9B59B6]"
                        : isEarning
                          ? "text-emerald-400"
                          : "text-red-400"
                    )}
                  >
                    {isEarning ? "+" : ""}
                    {entry.amount.toLocaleString()}₯
                  </span>

                  {/* Running balance */}
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#525252]">
                    {entry.runningBalance.toLocaleString()}₯
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
