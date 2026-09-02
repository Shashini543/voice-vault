import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-white light:text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-400 light:text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
