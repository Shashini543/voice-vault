"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { NoteStatusBadge } from "./NoteStatusBadge";
import { deleteNote } from "@/lib/api/notes";
import { useToastStore } from "@/store/toastStore";
import { useEstimatedProgress } from "@/hooks/useEstimatedProgress";
import { ROUTES } from "@/lib/constants";
import { NOTE_STATUS } from "@/types";
import { formatDuration, getErrorMessage } from "@/lib/utils";
import type { Note } from "@/types";

function fileTypeLabel(fileName: string): string {
  const extension = fileName.split(".").pop();
  return extension ? extension.toUpperCase() : "FILE";
}

export function NoteCard({ note, onDeleted }: { note: Note; onDeleted?: (id: string) => void }) {
  const isReady = note.status === NOTE_STATUS.READY;
  const isProcessing = note.status === NOTE_STATUS.PROCESSING;
  const showToast = useToastStore((state) => state.show);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const progress = useEstimatedProgress(note.createdAt, isProcessing);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteNote(note.id);
      showToast("Document deleted");
      onDeleted?.(note.id);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }

  return (
    <>
      <Link href={ROUTES.noteDetail(note.id)}>
        <Card className="flex h-full flex-col transition-colors hover:bg-slate-800 light:hover:bg-slate-50">
          <div className="flex items-start justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 light:bg-indigo-50 text-[10px] font-bold text-indigo-400 light:text-indigo-600">
              {fileTypeLabel(note.sourceFileName)}
            </span>
            <div className="flex items-center gap-2">
              <NoteStatusBadge status={note.status} />
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsDeleteOpen(true);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400 light:hover:text-red-600"
                aria-label="Delete note"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <p className="mt-4 font-semibold text-white light:text-slate-900">{note.title}</p>
          <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
            {new Date(note.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
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

          {isProcessing && (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800 light:bg-slate-200">
                <div
                  className="h-full rounded-full bg-amber-400 light:bg-amber-500 transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-right text-xs text-slate-500 light:text-slate-400">{Math.round(progress)}%</p>
            </div>
          )}
        </Card>
      </Link>

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete this document?"
        description="Are you sure you want to permanently delete this document? This action cannot be undone."
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  );
}
