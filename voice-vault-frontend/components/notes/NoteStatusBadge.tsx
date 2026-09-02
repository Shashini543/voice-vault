import { NOTE_STATUS, type NoteStatus } from "@/types";

const statusConfig: Record<NoteStatus, { label: string; className: string }> = {
  [NOTE_STATUS.UPLOADING]: {
    label: "Uploading",
    className: "bg-slate-500/10 light:bg-slate-100 text-slate-400 light:text-slate-600 ring-slate-500/20 light:ring-slate-300",
  },
  [NOTE_STATUS.PROCESSING]: {
    label: "Processing",
    className: "bg-amber-500/10 light:bg-amber-50 text-amber-400 light:text-amber-700 ring-amber-500/20 light:ring-amber-200",
  },
  [NOTE_STATUS.READY]: {
    label: "Ready",
    className: "bg-emerald-500/10 light:bg-emerald-50 text-emerald-400 light:text-emerald-700 ring-emerald-500/20 light:ring-emerald-200",
  },
  [NOTE_STATUS.FAILED]: {
    label: "Failed",
    className: "bg-red-500/10 light:bg-red-50 text-red-400 light:text-red-700 ring-red-500/20 light:ring-red-200",
  },
};

export function NoteStatusBadge({ status }: { status: NoteStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}
