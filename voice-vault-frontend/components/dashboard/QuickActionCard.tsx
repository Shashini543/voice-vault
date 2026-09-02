import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  highlighted?: boolean;
}

export function QuickActionCard({ href, icon: Icon, title, description, highlighted }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-xl border p-5 transition-colors",
        highlighted
          ? "border-indigo-500 bg-indigo-600 hover:bg-indigo-500"
          : "border-slate-800 light:border-slate-200 bg-slate-900 light:bg-white hover:bg-slate-800 light:hover:bg-slate-50"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
          highlighted ? "bg-white/15 text-white" : "bg-indigo-500/10 light:bg-indigo-50 text-indigo-400 light:text-indigo-600"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className={cn("font-semibold", highlighted ? "text-white" : "text-white light:text-slate-900")}>{title}</p>
        <p className={cn("text-sm", highlighted ? "text-indigo-100" : "text-slate-400 light:text-slate-500")}>{description}</p>
      </div>
    </Link>
  );
}
