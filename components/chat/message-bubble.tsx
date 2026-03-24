"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderMarkdown(text: string): string {
  let html = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> in <ul>
    .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul class='list-disc pl-4 space-y-1'>$1</ul>")
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Line breaks for double newlines
    .replace(/\n\n/g, "</p><p>")
    // Single newlines
    .replace(/\n/g, "<br />");

  return `<p>${html}</p>`;
}

export function MessageBubble({ role, content, createdAt }: MessageBubbleProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const isAssistant = role === "assistant";

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-3 max-w-[85%] transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        isAssistant ? "self-start" : "self-end flex-row-reverse"
      )}
    >
      {/* Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center mt-1">
          <span className="font-display text-sm font-bold text-[#050505]">A</span>
        </div>
      )}

      {/* Bubble */}
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isAssistant
              ? "bg-[#111111] text-[#F5F5F5] border border-[#1F1F1F] rounded-tl-sm"
              : "bg-[#1A1A1A] text-[#F5F5F5] rounded-tr-sm"
          )}
        >
          {isAssistant ? (
            <div
              className="prose prose-invert prose-sm max-w-none [&_strong]:text-[#C9A84C] [&_ul]:my-2 [&_p]:my-1"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          ) : (
            <p className="whitespace-pre-wrap">{content}</p>
          )}
        </div>

        {createdAt && (
          <span
            className={cn(
              "text-[10px] text-[#525252] font-mono",
              isAssistant ? "ml-1" : "mr-1 text-right"
            )}
          >
            {formatTimestamp(createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}
