"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ScrollText,
  Dumbbell,
  MessageSquare,
  Menu,
} from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Moon,
  Skull,
  Heart,
  BarChart3,
  Settings,
  Flame,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

const mainNav = [
  { href: "/dashboard", label: "War Room", icon: LayoutDashboard },
  { href: "/dashboard/contract", label: "Contract", icon: ScrollText },
  { href: "/dashboard/workout", label: "Workout", icon: Dumbbell },
  { href: "/dashboard/chat", label: "Mentor", icon: MessageSquare },
];

const moreNav = [
  { href: "/dashboard/debrief", label: "Evening Debrief", icon: Moon },
  { href: "/dashboard/sanctions", label: "Sanctions", icon: Skull },
  { href: "/dashboard/why-vault", label: "Why Vault", icon: Heart },
  { href: "/dashboard/stats", label: "Body Stats", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { currentStreak, dayNumber } = useAppStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#1F1F1F] pb-safe">
      <nav className="flex items-center justify-around px-2 py-2">
        {mainNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg min-w-[56px] transition-colors",
                isActive ? "text-[#C9A84C]" : "text-[#525252]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* More menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg min-w-[56px] text-[#525252]"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="bg-[#0A0A0A] border-t border-[#1F1F1F] rounded-t-2xl"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            {/* Streak banner */}
            {currentStreak > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 mb-2 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20">
                <Flame className="w-5 h-5 text-[#C9A84C]" />
                <span className="text-sm text-[#C9A84C] font-mono font-bold">
                  {currentStreak} day streak
                </span>
                <span className="text-xs text-[#525252] ml-auto">
                  Day {dayNumber}/365
                </span>
              </div>
            )}

            <div className="space-y-1">
              {moreNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                        : "text-[#A3A3A3] active:bg-[#1A1A1A]"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
