import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 light:text-slate-500" />
      <input
        type="text"
        className={cn(
          "h-11 w-full rounded-lg border border-slate-800 light:border-slate-300 bg-slate-900 light:bg-white pl-10 pr-3 text-sm text-white light:text-slate-900 placeholder:text-slate-500 light:placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
          className
        )}
        {...props}
      />
    </div>
  );
}
