import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { NoteStatusBadge } from "./NoteStatusBadge";
import { ROUTES } from "@/lib/constants";
import { NOTE_STATUS } from "@/types";
import { formatDuration } from "@/lib/utils";
import type { Note } from "@/types";

function fileTypeLabel(fileName: string): string {
  const extension = fileName.split(".").pop();
  return extension ? extension.toUpperCase() : "FILE";
}

export function NoteCard({ note }: { note: Note }) {
  const isReady = note.status === NOTE_STATUS.READY;

  return (
    <Link href={ROUTES.noteDetail(note.id)}>
      <Card className="flex h-full flex-col transition-colors hover:bg-slate-800 light:hover:bg-slate-50">
        <div className="flex items-start justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 light:bg-indigo-50 text-[10px] font-bold text-indigo-400 light:text-indigo-600">
            {fileTypeLabel(note.sourceFileName)}
          </span>
          <NoteStatusBadge status={note.status} />
        </div>

        <p className="mt-4 font-semibold text-white light:text-slate-900">{note.title}</p>
        <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
          {new Date(note.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}{" "}
          · {note.category}
        </p>

        <div className="mt-4 flex flex-1 items-end justify-between border-t border-slate-800 light:border-slate-200 pt-4">
          {isReady ? (
            <>
              <span className="text-sm text-slate-400 light:text-slate-500">
                {note.durationSeconds != null ? formatDuration(note.durationSeconds) : "—"}
              </span>
              <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">
                ▸ Listen
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-medium text-amber-400 light:text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 light:bg-amber-600" />
              {note.status === NOTE_STATUS.PROCESSING ? "Processing..." : note.status === NOTE_STATUS.FAILED ? "Failed" : "Uploading..."}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
