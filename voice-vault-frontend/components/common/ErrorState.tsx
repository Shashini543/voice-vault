import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", description, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 light:border-red-200 bg-red-500/5 light:bg-red-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 light:bg-red-100">
        <AlertTriangle className="h-6 w-6 text-red-400 light:text-red-600" />
      </div>
      <h3 className="text-base font-semibold text-white light:text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400 light:text-slate-500">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-slate-700 light:border-slate-300 bg-slate-800 light:bg-white px-5 text-sm font-semibold text-slate-100 light:text-slate-900 transition-colors hover:bg-slate-700 light:hover:bg-slate-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}
