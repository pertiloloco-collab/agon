"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MorningProtocolProps {
  message: string;
  dayNumber: number;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function MorningProtocol({
  message,
  dayNumber,
  onConfirm,
  onDismiss,
}: MorningProtocolProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [mathProblem, setMathProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);

  useEffect(() => {
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 20) + 5;
    setMathProblem({ a, b, answer: a + b });
  }, []);

  useEffect(() => {
    if (!message) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= message.length) {
        setDisplayedText(message.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setShowChallenge(true), 500);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [message]);

  function handleConfirm() {
    if (parseInt(userAnswer) === mathProblem.answer) {
      onConfirm();
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,168,76,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)]" />

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="absolute top-6 right-6 text-[#525252] hover:text-[#A3A3A3] z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10 max-w-lg mx-auto text-center space-y-8">
          {/* Day badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20"
          >
            <Sun className="w-4 h-4 text-[#C9A84C]" />
            <span className="font-mono text-sm text-[#C9A84C] font-bold">
              DAY {dayNumber} — MORNING PROTOCOL
            </span>
          </motion.div>

          {/* Message */}
          <div className="min-h-[200px] flex items-center justify-center">
            <p className="text-xl md:text-2xl text-[#F5F5F5] leading-relaxed font-body">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-[2px] h-6 bg-[#C9A84C] ml-1 animate-pulse" />
              )}
            </p>
          </div>

          {/* Wake-up challenge */}
          <AnimatePresence>
            {showChallenge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-sm text-[#525252]">
                  Prove you&apos;re awake. Solve this:
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-3xl text-[#C9A84C] font-bold">
                    {mathProblem.a} + {mathProblem.b} =
                  </span>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                    className="w-20 h-14 text-center font-mono text-2xl font-bold bg-[#111111] border-2 border-[#C9A84C]/30 rounded-lg text-[#F5F5F5] focus:border-[#C9A84C] focus:outline-none"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleConfirm}
                  disabled={!userAnswer}
                  className="w-full max-w-xs bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold text-lg py-6 shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] transition-all"
                >
                  I&apos;M UP — LET&apos;S GO
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
