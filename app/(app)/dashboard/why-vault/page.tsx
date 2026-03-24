"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Plus,
  FileText,
  Image as ImageIcon,
  Mail,
  Shuffle,
  X,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VaultEntry {
  id: string;
  type: "text" | "photo" | "letter" | "voice_note";
  title: string;
  content: string;
  mediaUrl: string | null;
  createdAt: string;
}

const mockEntries: VaultEntry[] = [
  {
    id: "1",
    type: "text",
    title: "Why I Started",
    content: "Because I looked at my son and realized I wouldn't be around to see him graduate if I kept living like this. He deserves a father who leads by example, not one who makes excuses.",
    mediaUrl: null,
    createdAt: "2026-01-15T08:00:00",
  },
  {
    id: "2",
    type: "letter",
    title: "Letter to Future Self",
    content: "You're reading this 365 days after you decided to change everything. Remember the man who started this — tired, soft, disappointed in himself. That man had the courage to begin. Honor him by finishing.",
    mediaUrl: null,
    createdAt: "2026-01-15T08:30:00",
  },
  {
    id: "3",
    type: "text",
    title: "The Promise",
    content: "I promised myself I would never again look in the mirror and feel ashamed. This isn't vanity — it's about becoming the strongest version of myself for everyone who depends on me.",
    mediaUrl: null,
    createdAt: "2026-02-01T19:00:00",
  },
];

const typeIcons: Record<string, typeof FileText> = {
  text: FileText,
  letter: Mail,
  photo: ImageIcon,
  voice_note: FileText,
};

const typeLabels: Record<string, string> = {
  text: "Note",
  letter: "Letter",
  photo: "Photo",
  voice_note: "Voice Note",
};

export default function WhyVaultPage() {
  const [entries, setEntries] = useState<VaultEntry[]>(mockEntries);
  const [showAddModal, setShowAddModal] = useState(false);
  const [randomEntry, setRandomEntry] = useState<VaultEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    type: "text" as VaultEntry["type"],
    title: "",
    content: "",
  });

  function showRandomWhy() {
    const entry = entries[Math.floor(Math.random() * entries.length)];
    setRandomEntry(entry);
    setTimeout(() => setRandomEntry(null), 8000);
  }

  function handleAddEntry() {
    if (!newEntry.title || !newEntry.content) return;
    const entry: VaultEntry = {
      id: Date.now().toString(),
      type: newEntry.type,
      title: newEntry.title,
      content: newEntry.content,
      mediaUrl: null,
      createdAt: new Date().toISOString(),
    };
    setEntries([entry, ...entries]);
    setNewEntry({ type: "text", title: "", content: "" });
    setShowAddModal(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[#C9A84C] mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8" />
            WHY VAULT
          </h1>
          <p className="text-sm text-[#525252]">
            Your sacred motivations. The AI draws from these to keep you moving.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={showRandomWhy}
            variant="outline"
            className="border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Random Why
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Random Why Popup */}
      <AnimatePresence>
        {randomEntry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="p-6 rounded-xl bg-[#111111] border border-[#C9A84C]/30 shadow-[0_0_30px_rgba(201,168,76,0.15)]"
          >
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30">
                YOUR WHY
              </Badge>
              <button onClick={() => setRandomEntry(null)} className="text-[#525252] hover:text-[#A3A3A3]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-display text-lg text-[#C9A84C] mb-2">{randomEntry.title}</h3>
            <p className="text-[#F5F5F5] leading-relaxed italic">&ldquo;{randomEntry.content}&rdquo;</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry, i) => {
          const Icon = typeIcons[entry.type] || FileText;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-5 rounded-xl bg-[#111111] border border-[#1F1F1F] hover:border-[#C9A84C]/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-[#C9A84C]" />
                <Badge variant="outline" className="text-xs border-[#1F1F1F] text-[#525252]">
                  {typeLabels[entry.type]}
                </Badge>
                <span className="text-xs text-[#525252] ml-auto flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-display text-base text-[#F5F5F5] mb-2">{entry.title}</h3>
              <p className="text-sm text-[#A3A3A3] leading-relaxed line-clamp-4">
                {entry.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-6 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-4"
            >
              <h2 className="font-display text-xl text-[#C9A84C]">ADD TO VAULT</h2>

              {/* Type selector */}
              <div className="flex gap-2">
                {(["text", "letter", "photo"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewEntry({ ...newEntry, type })}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      newEntry.type === type
                        ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30"
                        : "bg-[#0A0A0A] text-[#525252] border border-[#1F1F1F]"
                    }`}
                  >
                    {typeLabels[type]}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">Title</Label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="Give this entry a name..."
                  className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">Content</Label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Write from the heart..."
                  rows={6}
                  className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="border-[#1F1F1F] text-[#A3A3A3]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEntry}
                  disabled={!newEntry.title || !newEntry.content}
                  className="bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold"
                >
                  Save to Vault
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
