import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label = "Loading...", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-slate-400 light:text-slate-500", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-indigo-400 light:text-indigo-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
