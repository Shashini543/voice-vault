import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputVariant = "light" | "dashboard";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}

const variantClasses: Record<InputVariant, string> = {
  light:
    "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50",
  dashboard:
    "border-slate-700 light:border-slate-300 bg-slate-800 light:bg-white text-white light:text-slate-900 placeholder:text-slate-500 light:placeholder:text-slate-400 disabled:bg-slate-900 light:disabled:bg-slate-50",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "light", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-lg border px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
