import { cn } from "@/lib/utils";

export type NoteFilter = "all" | "ready" | "processing";

const filters: { value: NoteFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ready", label: "Ready" },
  { value: "processing", label: "Processing" },
];

interface FilterTabsProps {
  value: NoteFilter;
  onChange: (value: NoteFilter) => void;
}

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-slate-800 light:border-slate-200 bg-slate-900 light:bg-slate-100 p-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === filter.value
              ? "bg-slate-800 light:bg-white text-white light:text-slate-900 light:shadow-sm"
              : "text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
