"use client";

import { use, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Play, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { NoteStatusBadge } from "@/components/notes/NoteStatusBadge";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Markdown } from "@/components/ui/Markdown";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { getNote, deleteNote } from "@/lib/api/notes";
import { getAudio, downloadAudio } from "@/lib/api/audio";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useToastStore } from "@/store/toastStore";
import { ROUTES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import { NOTE_STATUS } from "@/types";
import type { AudioTrack, Note } from "@/types";

type TabValue = "study-notes" | "script" | "audio";

const TAB_ITEMS = [
  { value: "study-notes", label: "AI Study Notes" },
  { value: "script", label: "AI Script" },
  { value: "audio", label: "Audio" },
];

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const showToast = useToastStore((state) => state.show);

  const fetcher = useCallback(() => getNote(id), [id]);
  const { data: note, status, error, retry } = useAsyncResource<Note>(fetcher, [id]);

  const [activeTab, setActiveTab] = useState<TabValue>("study-notes");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const audioId = note?.audioId ?? null;
  const audioFetcher = useCallback(
    () => (audioId ? getAudio(audioId) : Promise.resolve(null)),
    [audioId]
  );
  const audioResource = useAsyncResource<AudioTrack | null>(audioFetcher, [audioId]);

  if (status === "loading") return <LoadingSpinner label="Loading note..." />;
  if (status === "error") return <ErrorState description={error ?? "Failed to load note."} onRetry={retry} />;
  if (!note) return null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteNote(note!.id);
      showToast("Document deleted");
      router.push(ROUTES.notes);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }

  async function handleDownload() {
    try {
      const { url } = await downloadAudio(note!.audioId as string);
      window.location.href = url;
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  }

  return (
    <div>
      <div className="mb-6 rounded-xl border border-slate-800 light:border-slate-200 bg-slate-900 light:bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 light:bg-indigo-50 text-[10px] font-bold text-indigo-400 light:text-indigo-600">
              {fileTypeLabel(note.sourceFileName)}
            </span>
            <div>
              <h1 className="text-xl font-bold text-white light:text-slate-900">{note.title}</h1>
              <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
                {new Date(note.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {note.category}
                {note.durationSeconds != null && ` · ${Math.round(note.durationSeconds / 60)} min audio`}
              </p>
            </div>
          </div>
          <NoteStatusBadge status={note.status} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-800 light:border-slate-200 pt-5">
          {note.audioId && (
            <button
              type="button"
              onClick={() => setActiveTab("audio")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              <Play className="h-4 w-4" />
              Play Audio
            </button>
          )}
          {audioResource.data?.status === "READY" && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 light:border-slate-300 bg-slate-800 light:bg-white px-4 text-sm font-semibold text-slate-100 light:text-slate-700 transition-colors hover:bg-slate-700 light:hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Download Audio
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 text-sm font-semibold text-red-400 light:text-red-600 transition-colors hover:bg-red-500/10 sm:ml-auto"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <Tabs items={TAB_ITEMS} value={activeTab} onChange={(value) => setActiveTab(value as TabValue)} />

      <div className="mt-6">
        {activeTab === "study-notes" && (
          <div>
            <h2 className="text-lg font-bold text-white light:text-slate-900">AI Study Notes</h2>
            <p className="mt-1 mb-4 text-sm text-slate-400 light:text-slate-500">
              Your notes transformed into clear, student-friendly study material by AI.
            </p>
            <Card>
              <StatusGate note={note} content={note.studyNotes} />
            </Card>
          </div>
        )}

        {activeTab === "script" && (
          <div>
            <h2 className="text-lg font-bold text-white light:text-slate-900">AI Podcast Script</h2>
            <p className="mt-1 mb-4 text-sm text-slate-400 light:text-slate-500">
              Your AI study notes converted into a natural conversational script, ready to be turned into audio.
            </p>
            {note.script && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-sm text-indigo-300 light:text-indigo-700">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0" />
                Audio is generated from this conversational script.
              </div>
            )}
            <Card>
              <StatusGate note={note} content={note.script} />
            </Card>
          </div>
        )}

        {activeTab === "audio" && (
          <div>
            {note.audioId ? (
              audioResource.status === "loading" ? (
                <LoadingSpinner label="Loading audio..." />
              ) : audioResource.status === "error" ? (
                <ErrorState description={audioResource.error ?? "Failed to load audio."} onRetry={audioResource.retry} />
              ) : audioResource.data?.status === "PROCESSING" ? (
                <LoadingSpinner label="Generating audio from your study script..." />
              ) : audioResource.data?.status === "FAILED" ? (
                <ErrorState
                  title="Audio generation failed"
                  description={audioResource.data.errorMessage || "Something went wrong while generating audio."}
                  onRetry={audioResource.retry}
                />
              ) : audioResource.data?.status === "READY" ? (
                <AudioPlayer audio={audioResource.data} />
              ) : null
            ) : (
              <EmptyState
                icon={FileText}
                title="No audio available"
                description="This note doesn't have generated audio."
              />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete this document?"
        description="Are you sure you want to permanently delete this document? This action cannot be undone."
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}

function fileTypeLabel(fileName: string): string {
  const extension = fileName.split(".").pop();
  return extension ? extension.toUpperCase() : "FILE";
}

function StatusGate({ note, content }: { note: Note; content: string | null }) {
  if (content) return <Markdown content={content} />;

  if (note.status === NOTE_STATUS.FAILED) {
    return (
      <ErrorState
        title="Processing failed"
        description={note.processingError || "Something went wrong while processing this document."}
      />
    );
  }

  return (
    <EmptyState
      icon={FileText}
      title="Still processing"
      description="Your AI content will appear here as soon as it's ready — this usually only takes a minute."
    />
  );
}
