import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 light:text-slate-500 transition-colors hover:text-slate-200 light:hover:text-slate-700"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
