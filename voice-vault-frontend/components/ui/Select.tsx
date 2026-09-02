import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-slate-800 light:border-slate-300 bg-slate-900 light:bg-white py-2 pl-3 pr-9 text-sm text-white light:text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 light:text-slate-500" />
    </div>
  );
});

Select.displayName = "Select";
