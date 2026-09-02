"use client";

import type { ReactNode } from "react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

export function ThemeRoot({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className={cn("flex min-h-full flex-1 flex-col bg-slate-950 light:bg-white", theme === "light" && "light")}>
      {children}
    </div>
  );
}
