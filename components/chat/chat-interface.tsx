"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const handleSend = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setStreamingContent("");

    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();

            if (data === "[DONE]") {
              // Finalize assistant message
              const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: accumulated,
                createdAt: new Date(),
              };
              setMessages((prev) => [...prev, assistantMessage]);
              setStreamingContent("");
              setIsLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setStreamingContent(accumulated);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseErr) {
              // Skip malformed JSON lines
            }
          }
        }
      }

      // If stream ended without [DONE], still finalize
      if (accumulated) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: accumulated,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingContent("");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Chat error:", err);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Connection lost. The battle continues -- try again.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 flex flex-col scrollbar-thin scrollbar-thumb-[#1F1F1F] scrollbar-track-transparent"
      >
        {/* Welcome message when empty */}
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center mx-auto">
                <span className="font-display text-2xl font-bold text-[#050505]">A</span>
              </div>
              <h2 className="font-display text-xl text-[#F5F5F5]">AGON</h2>
              <p className="text-sm text-[#525252] leading-relaxed">
                Your Spartan mentor. Ask about training, nutrition, mindset
                -- or tell me what you are struggling with. No judgment.
                Only truth.
              </p>
            </div>
          </div>
        )}

        {/* Rendered messages */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            createdAt={msg.createdAt}
          />
        ))}

        {/* Streaming assistant message */}
        {streamingContent && (
          <MessageBubble
            role="assistant"
            content={streamingContent}
          />
        )}

        {/* Thinking indicator */}
        {isLoading && !streamingContent && (
          <div className="flex gap-3 self-start max-w-[85%]">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center mt-1">
              <span className="font-display text-sm font-bold text-[#050505]">A</span>
            </div>
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#525252] font-mono">Thinking</span>
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#C9A84C] animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-1 rounded-full bg-[#C9A84C] animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-1 rounded-full bg-[#C9A84C] animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
