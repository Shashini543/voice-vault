import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-800 light:border-slate-200 bg-slate-900 light:bg-slate-100 p-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === item.value
              ? "bg-slate-800 light:bg-white text-white light:text-slate-900 light:shadow-sm"
              : "text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
