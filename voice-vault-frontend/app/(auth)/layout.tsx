import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Headphones } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-slate-950 light:bg-slate-50 px-4 py-16">
      <Link href={ROUTES.home} className="mb-8 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Headphones className="h-5 w-5 text-white" />
        </span>
        <span className="text-lg font-bold text-white light:text-slate-900">Voice Vault</span>
      </Link>
      <div className="w-full max-w-md rounded-xl border border-slate-800 light:border-slate-200 bg-slate-900 light:bg-white p-8">
        {children}
      </div>
      <Link
        href={ROUTES.home}
        className="mt-6 flex items-center gap-1.5 text-sm font-medium text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
    </main>
  );
}
