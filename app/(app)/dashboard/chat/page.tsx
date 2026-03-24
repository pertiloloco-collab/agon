"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { sidebarOpen } = useAppStore();

  return (
    <div
      className={cn(
        "flex flex-col bg-[#050505]",
        // Full viewport height minus mobile bottom nav (80px) or no offset on desktop
        "h-[calc(100vh-80px)] md:h-screen"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1F1F1F] bg-[#050505]/80 backdrop-blur-sm">
        <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center">
          <span className="font-display text-sm font-bold text-[#050505]">A</span>
        </div>
        <div>
          <h1 className="font-display text-sm font-semibold text-[#F5F5F5] tracking-wide uppercase">
            AGON Mentor
          </h1>
          <p className="text-[10px] text-[#525252] font-mono">Always watching. Always ready.</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          <span className="text-[10px] text-[#525252] font-mono">Online</span>
        </div>
      </div>

      {/* Chat body */}
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
