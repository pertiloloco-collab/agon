"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ScrollText,
  MessageSquare,
  Dumbbell,
  Moon,
  Skull,
  Heart,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Gem,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "War Room", icon: LayoutDashboard },
  { href: "/dashboard/contract", label: "Daily Contract", icon: ScrollText },
  { href: "/dashboard/workout", label: "Workout", icon: Dumbbell },
  { href: "/dashboard/chat", label: "Mentor", icon: MessageSquare },
  { href: "/dashboard/habits", label: "Habits", icon: Zap },
  { href: "/dashboard/forge", label: "Forge", icon: Gem },
  { href: "/dashboard/debrief", label: "Debrief", icon: Moon },
  { href: "/dashboard/sanctions", label: "Sanctions", icon: Skull },
  { href: "/dashboard/why-vault", label: "Why Vault", icon: Heart },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function NavSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, currentStreak, dayNumber } = useAppStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-[#0A0A0A] border-r border-[#1F1F1F] transition-all duration-300 fixed left-0 top-0 z-40",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-[#1F1F1F]">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B7432] flex items-center justify-center flex-shrink-0">
          <span className="font-display text-lg font-bold text-[#050505]">A</span>
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="font-display text-lg font-bold text-[#C9A84C] tracking-wider">
              AGON
            </h1>
            <p className="text-[10px] text-[#525252] uppercase tracking-widest">
              Day {dayNumber} of 365
            </p>
          </div>
        )}
      </div>

      {/* Streak indicator */}
      {currentStreak > 0 && (
        <div className={cn(
          "mx-3 mt-4 px-3 py-2 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20",
          !sidebarOpen && "mx-2 px-2"
        )}>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm text-[#C9A84C] font-mono font-bold">
                {currentStreak} day streak
              </span>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30"
                  : "text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]",
                !sidebarOpen && "justify-center px-2"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-[#C9A84C]" : "text-[#525252] group-hover:text-[#A3A3A3]"
                )}
              />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="flex items-center justify-center py-4 border-t border-[#1F1F1F] text-[#525252] hover:text-[#A3A3A3] transition-colors"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
}
