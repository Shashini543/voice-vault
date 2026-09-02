import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

const colorClasses = {
  indigo: { bg: "bg-indigo-500/10 light:bg-indigo-50", text: "text-indigo-400 light:text-indigo-600" },
  violet: { bg: "bg-violet-500/10 light:bg-violet-50", text: "text-violet-400 light:text-violet-600" },
  amber: { bg: "bg-amber-500/10 light:bg-amber-50", text: "text-amber-400 light:text-amber-600" },
  emerald: { bg: "bg-emerald-500/10 light:bg-emerald-50", text: "text-emerald-400 light:text-emerald-600" },
} as const;

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: keyof typeof colorClasses;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <Card>
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
        <Icon className={`h-5 w-5 ${colors.text}`} />
      </span>
      <p className="mt-4 text-2xl font-bold text-white light:text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-400 light:text-slate-500">{label}</p>
    </Card>
  );
}
