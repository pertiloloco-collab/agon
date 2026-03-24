"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EveningDebriefModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function EveningDebriefModal({
  open,
  onClose,
  children,
}: EveningDebriefModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal: slides up from bottom */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col",
              "rounded-t-2xl border-t border-[#1F1F1F] bg-[#111111] shadow-2xl",
              "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2",
              "sm:max-h-[85vh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2",
              "sm:rounded-2xl sm:border"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1F1F1F] px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10">
                  <Moon className="h-4 w-4 text-[#C9A84C]" />
                </div>
                <h2 className="font-heading text-base font-semibold uppercase tracking-wider text-[#F5F5F5]">
                  Evening Debrief
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#525252] transition-colors hover:bg-[#1F1F1F] hover:text-[#A3A3A3]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
