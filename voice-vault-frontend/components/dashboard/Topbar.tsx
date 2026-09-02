"use client";

import { Menu } from "lucide-react";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center border-b border-slate-800 light:border-slate-200 bg-slate-950 light:bg-white px-4">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-lg p-2 text-slate-400 light:text-slate-500 hover:bg-slate-800 light:hover:bg-slate-100"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
}
