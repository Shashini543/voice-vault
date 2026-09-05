"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/utils";

export function Toast() {
  const message = useToastStore((state) => state.message);
  const tone = useToastStore((state) => state.tone);
  const hide = useToastStore((state) => state.hide);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hide, 3500);
    return () => clearTimeout(timer);
  }, [message, hide]);

  if (!message) return null;

  const isSuccess = tone === "success";

  return (
    <div className="fixed bottom-6 left-1/2 z-[70] w-full max-w-sm -translate-x-1/2 px-4">
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg",
          isSuccess
            ? "border-emerald-500/20 bg-slate-900 light:bg-white text-emerald-400 light:text-emerald-700"
            : "border-red-500/20 bg-slate-900 light:bg-white text-red-400 light:text-red-700"
        )}
      >
        {isSuccess ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <XCircle className="h-4 w-4 flex-shrink-0" />}
        {message}
      </div>
    </div>
  );
}
