"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const valueRef = useRef("");

  // Auto-resize textarea
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * 5;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    const value = textareaRef.current?.value.trim();
    if (!value || disabled) return;
    onSend(value);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
    valueRef.current = "";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    valueRef.current = textareaRef.current?.value ?? "";
    adjustHeight();
  };

  return (
    <div className="flex items-end gap-3 p-4 bg-[#050505] border-t border-[#1F1F1F]">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Talk to your mentor..."
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          className={cn(
            "w-full resize-none bg-[#111111] text-[#F5F5F5] text-sm",
            "border border-[#1F1F1F] rounded-xl px-4 py-3",
            "placeholder:text-[#525252]",
            "focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "scrollbar-thin scrollbar-thumb-[#1F1F1F]"
          )}
          style={{ maxHeight: `${24 * 5}px` }}
        />
      </div>

      <button
        onClick={handleSend}
        disabled={disabled}
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
          "bg-[#C9A84C] text-[#050505] transition-all duration-200",
          "hover:bg-[#D4B85C] active:scale-95",
          "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#C9A84C] disabled:active:scale-100"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
