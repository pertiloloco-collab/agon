"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Camera,
  Mail,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EntryType = "text" | "photo" | "letter";

interface AddEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: {
    type: EntryType;
    title: string;
    content: string;
    photoFile?: File;
  }) => void;
}

const tabs: { type: EntryType; icon: React.ReactNode; label: string }[] = [
  { type: "text", icon: <FileText className="h-4 w-4" />, label: "Text" },
  { type: "photo", icon: <Camera className="h-4 w-4" />, label: "Photo" },
  { type: "letter", icon: <Mail className="h-4 w-4" />, label: "Letter" },
];

export function AddEntryModal({ open, onClose, onSave }: AddEntryModalProps) {
  const [activeType, setActiveType] = useState<EntryType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePhotoSelect = useCallback((file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handlePhotoSelect(file);
      }
    },
    [handlePhotoSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({
      type: activeType,
      title: title.trim(),
      content: content.trim(),
      photoFile: photoFile ?? undefined,
    });
    // Reset
    setTitle("");
    setContent("");
    setPhotoFile(null);
    setPhotoPreview(null);
    onClose();
  };

  const canSave = title.trim().length > 0 && content.trim().length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 top-auto z-50 mx-auto max-w-lg rounded-2xl border border-[#1F1F1F] bg-[#111111] p-5 shadow-2xl sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold tracking-wider text-[#F5F5F5]">
                ADD TO YOUR VAULT
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#525252] transition-colors hover:bg-[#1F1F1F] hover:text-[#A3A3A3]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Type tabs */}
            <div className="mb-5 flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.type}
                  onClick={() => setActiveType(tab.type)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-medium transition-all",
                    activeType === tab.type
                      ? "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-[#1F1F1F] bg-[#050505] text-[#525252] hover:border-[#C9A84C]/20 hover:text-[#A3A3A3]"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="mb-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give this entry a title..."
                className="border-[#1F1F1F] bg-[#050505] text-sm text-[#F5F5F5] placeholder:text-[#525252] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
              />
            </div>

            {/* Content */}
            <div className="mb-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  activeType === "letter"
                    ? "Write your letter... Pour your heart out."
                    : activeType === "photo"
                      ? "Describe why this photo matters..."
                      : "Write your thoughts... Be honest with yourself."
                }
                rows={6}
                className="min-h-[160px] resize-none border-[#1F1F1F] bg-[#050505] text-sm leading-relaxed text-[#F5F5F5] placeholder:text-[#525252] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
              />
            </div>

            {/* Photo upload zone */}
            {activeType === "photo" && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "mb-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors",
                  isDragging
                    ? "border-[#C9A84C] bg-[#C9A84C]/5"
                    : "border-[#1F1F1F] bg-[#050505]",
                  photoPreview && "border-solid"
                )}
              >
                {photoPreview ? (
                  <div className="relative w-full">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="max-h-40 w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#DC2626] text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-[#525252]" />
                    <p className="text-xs text-[#525252]">
                      Drag and drop an image, or{" "}
                      <label className="cursor-pointer text-[#C9A84C] underline">
                        browse
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoSelect(file);
                          }}
                        />
                      </label>
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Save button */}
            <motion.button
              whileHover={canSave ? { scale: 1.01 } : undefined}
              whileTap={canSave ? { scale: 0.98 } : undefined}
              onClick={handleSave}
              disabled={!canSave}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg py-3 font-heading text-sm font-semibold uppercase tracking-widest transition-all",
                canSave
                  ? "bg-[#C9A84C] text-[#050505] hover:bg-[#E8D48B]"
                  : "cursor-not-allowed bg-[#1F1F1F] text-[#525252]"
              )}
            >
              <Upload className="h-4 w-4" />
              Save to Vault
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
