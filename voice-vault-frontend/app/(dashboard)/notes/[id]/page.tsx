"use client";

import { use, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { NoteStatusBadge } from "@/components/notes/NoteStatusBadge";
import { Card } from "@/components/ui/Card";
import { getNote } from "@/lib/api/notes";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import type { Note } from "@/types";

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fetcher = useCallback(() => getNote(id), [id]);
  const { data: note, status, error, retry } = useAsyncResource<Note>(fetcher, [id]);

  if (status === "loading") return <LoadingSpinner label="Loading note..." />;
  if (status === "error") return <ErrorState description={error ?? "Failed to load note."} onRetry={retry} />;
  if (!note) return null;

  return (
    <div>
      <PageHeader title={note.title} description={note.sourceFileName} action={<NoteStatusBadge status={note.status} />} />
      <Card>
        {note.script ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300 light:text-slate-700">{note.script}</p>
        ) : (
          <p className="text-sm text-slate-400 light:text-slate-500">The study script isn&apos;t ready yet.</p>
        )}
      </Card>
    </div>
  );
}
