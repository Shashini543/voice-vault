import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "indigo" | "slate" | "green" | "red" | "amber";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  indigo: "bg-indigo-500/10 text-indigo-400 light:bg-indigo-50 light:text-indigo-700",
  slate: "bg-slate-500/10 text-slate-400 light:bg-slate-100 light:text-slate-600",
  green: "bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700",
  red: "bg-red-500/10 text-red-400 light:bg-red-50 light:text-red-700",
  amber: "bg-amber-500/10 text-amber-400 light:bg-amber-50 light:text-amber-700",
};

export function Badge({ className, tone = "indigo", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
