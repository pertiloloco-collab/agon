"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ContractCard, ContractTask } from "@/components/contract/contract-card";

const mockMorningMessage =
  "Day 12. You showed up yesterday when most would have quit. Today's contract is heavier — that's not punishment, it's proof the system trusts you with more. Complete every task. Leave nothing undone. The version of you that signed up for this is watching.";

const initialTasks: ContractTask[] = [
  {
    id: "task-1",
    title: "Complete Upper A workout (Phase 1 — Foundation)",
    category: "workout",
    description: "Full workout logged with all sets, reps, and RPE tracked.",
    completed: false,
    proofRequired: true,
    deadline: "Before 6:00 PM",
  },
  {
    id: "task-2",
    title: "Hit protein target: 180g minimum",
    category: "nutrition",
    description: "Log all meals. Screenshot MyFitnessPal or food log as proof.",
    completed: false,
    proofRequired: true,
  },
  {
    id: "task-3",
    title: "10 minutes of focused breathwork or meditation",
    category: "mindset",
    description: "Use any method — box breathing, Wim Hof, or guided session.",
    completed: false,
    proofRequired: false,
    deadline: "Morning",
  },
  {
    id: "task-4",
    title: "No processed sugar today",
    category: "habit",
    completed: false,
    proofRequired: false,
  },
  {
    id: "task-5",
    title: "Write one sentence in the Why Vault",
    category: "mindset",
    description: "Reflect on why you started. Keep the fire alive.",
    completed: false,
    proofRequired: false,
    deadline: "Before bed",
  },
];

export default function ContractPage() {
  const [signed, setSigned] = useState(false);
  const [signedAt, setSignedAt] = useState<string | undefined>();
  const [tasks, setTasks] = useState<ContractTask[]>(initialTasks);

  const handleSign = () => {
    setSigned(true);
    setSignedAt(format(new Date(), "h:mm a"));
  };

  const handleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleTaskUploadProof = (id: string, _file: File) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, proofUrl: URL.createObjectURL(_file) } : t
      )
    );
  };

  const [today, setToday] = useState<string>("");

  useEffect(() => {
    setToday(format(new Date(), "EEEE, MMMM do, yyyy"));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl tracking-wider text-[#F5F5F5]">
          DAILY CONTRACT
        </h1>
        <p className="mt-1 font-mono text-xs text-[#525252] uppercase tracking-widest">
          {today || "\u00A0"}
        </p>
      </div>

      <ContractCard
        date={today}
        signed={signed}
        signedAt={signedAt}
        honorScore={87}
        morningMessage={mockMorningMessage}
        tasks={tasks}
        onSign={handleSign}
        onTaskComplete={handleTaskComplete}
        onTaskUploadProof={handleTaskUploadProof}
      />
    </div>
  );
}
