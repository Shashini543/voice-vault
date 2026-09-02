import Link from "next/link";
import { NoteStatusBadge } from "@/components/notes/NoteStatusBadge";
import { ROUTES } from "@/lib/constants";
import { NOTE_STATUS } from "@/types";
import type { Note } from "@/types";

function fileTypeLabel(fileName: string): string {
  const extension = fileName.split(".").pop();
  return extension ? extension.toUpperCase() : "FILE";
}

export function RecentNoteRow({ note }: { note: Note }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 light:bg-indigo-50 text-[10px] font-bold text-indigo-400 light:text-indigo-600">
          {fileTypeLabel(note.sourceFileName)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-white light:text-slate-900">{note.title}</p>
          <p className="mt-0.5 text-xs text-slate-500 light:text-slate-500">
            {new Date(note.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-3">
        <NoteStatusBadge status={note.status} />
        {note.status === NOTE_STATUS.READY ? (
          <Link
            href={ROUTES.noteDetail(note.id)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Listen
          </Link>
        ) : (
          <Link
            href={ROUTES.noteDetail(note.id)}
            className="text-xs text-slate-500 hover:text-slate-300 light:hover:text-slate-700"
          >
            View
          </Link>
        )}
      </div>
    </div>
  );
}
