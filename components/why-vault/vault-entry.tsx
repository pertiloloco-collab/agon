"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Camera,
  Mail,
  Mic,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type EntryType = "text" | "photo" | "letter" | "voice_note";

interface VaultEntryProps {
  id: string;
  type: EntryType;
  title: string;
  content: string;
  photoUrl?: string;
  createdAt: string;
}

const typeConfig: Record<
  EntryType,
  { icon: React.ReactNode; label: string; color: string }
> = {
  text: {
    icon: <FileText className="h-3 w-3" />,
    label: "Text",
    color: "#C9A84C",
  },
  photo: {
    icon: <Camera className="h-3 w-3" />,
    label: "Photo",
    color: "#3B82F6",
  },
  letter: {
    icon: <Mail className="h-3 w-3" />,
    label: "Letter",
    color: "#A855F7",
  },
  voice_note: {
    icon: <Mic className="h-3 w-3" />,
    label: "Voice",
    color: "#EF4444",
  },
};

export function VaultEntry({
  id,
  type,
  title,
  content,
  photoUrl,
  createdAt,
}: VaultEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111111] transition-colors",
        "hover:border-[#C9A84C]/40"
      )}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between">
          {/* Type badge */}
          <span
            className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{
              borderColor: `${config.color}33`,
              backgroundColor: `${config.color}1A`,
              color: config.color,
            }}
          >
            {config.icon}
            {config.label}
          </span>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-[#525252]" />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-heading text-base font-semibold tracking-wider text-[#F5F5F5]">
          {title}
        </h3>

        {/* Content preview */}
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#A3A3A3]">
                {content}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="collapsed"
              className="line-clamp-3 text-sm leading-relaxed text-[#A3A3A3]"
            >
              {content}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Photo thumbnail */}
        {type === "photo" && photoUrl && (
          <div className="mt-3 overflow-hidden rounded-lg border border-[#1F1F1F]">
            <img
              src={photoUrl}
              alt={title}
              className={cn(
                "w-full object-cover transition-all",
                expanded ? "max-h-80" : "max-h-32"
              )}
            />
          </div>
        )}

        {/* Date */}
        <div className="mt-3 flex items-center gap-1.5 text-[#525252]">
          <Calendar className="h-3 w-3" />
          <span className="font-mono text-[11px]">{createdAt}</span>
        </div>
      </div>
    </motion.div>
  );
}
