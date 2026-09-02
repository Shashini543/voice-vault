import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 light:border-slate-300 bg-slate-900/50 light:bg-slate-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 light:bg-indigo-50">
        <Icon className="h-6 w-6 text-indigo-400 light:text-indigo-600" />
      </div>
      <h3 className="text-base font-semibold text-white light:text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400 light:text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
