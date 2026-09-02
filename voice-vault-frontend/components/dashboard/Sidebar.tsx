"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headphones, LayoutDashboard, FileText, Upload, Headphones as AudioIcon, Settings, X, LogOut } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.notes, label: "My Notes", icon: FileText },
  { href: ROUTES.audio, label: "Audio Library", icon: AudioIcon },
  { href: ROUTES.upload, label: "Upload", icon: Upload },
  { href: ROUTES.settings, label: "Settings", icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <div className="flex h-full flex-col border-r border-slate-800 light:border-slate-200 bg-slate-950 light:bg-white">
      <div className="flex h-16 flex-shrink-0 items-center gap-2 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Headphones className="h-5 w-5 text-white" />
        </span>
        <span className="text-lg font-bold text-white light:text-slate-900">Voice Vault</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 light:bg-indigo-50 light:text-indigo-700"
                  : "text-slate-400 light:text-slate-600 hover:bg-slate-800/60 light:hover:bg-slate-100 hover:text-slate-100 light:hover:text-slate-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 border-t border-slate-800 light:border-slate-200 p-4">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          {user ? getInitials(user.name) : "?"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white light:text-slate-900">{user?.name ?? "Guest"}</p>
          <p className="truncate text-xs text-slate-500 light:text-slate-500">{user?.email ?? "Not signed in"}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex-shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 light:hover:bg-slate-100 hover:text-slate-200 light:hover:text-slate-900"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function MobileSidebarClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 light:text-slate-500 hover:bg-slate-800 light:hover:bg-slate-100"
      aria-label="Close menu"
    >
      <X className="h-5 w-5" />
    </button>
  );
}
