"use client";

import { NavSidebar } from "@/components/nav-sidebar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-[#050505]">
      <NavSidebar />
      <main
        className={cn(
          "min-h-screen pb-20 md:pb-0 transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
