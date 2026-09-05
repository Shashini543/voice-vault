"use client";

import Link from "next/link";
import { FileText, Headphones, Hourglass, Music, Upload, Library } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { RecentNoteRow } from "@/components/dashboard/RecentNoteRow";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { getNotes } from "@/lib/api/notes";
import { getAudioList } from "@/lib/api/audio";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/lib/constants";
import { NOTE_STATUS } from "@/types";
import { formatListeningTime, getTimeBasedGreeting } from "@/lib/utils";
import type { AudioTrack, Note } from "@/types";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const notesResource = useAsyncResource<Note[]>(getNotes, []);
  const audioResource = useAsyncResource<AudioTrack[]>(getAudioList, []);

  const notes = notesResource.data ?? [];
  const audioTracks = audioResource.data ?? [];
  const isLoading = notesResource.status === "loading" || audioResource.status === "loading";
  const hasError = notesResource.status === "error" || audioResource.status === "error";

  const totalListeningSeconds = audioTracks.reduce((sum, track) => sum + (track.durationSeconds ?? 0), 0);
  const processingCount = notes.filter((note) => note.status === NOTE_STATUS.PROCESSING).length;

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">
            <span suppressHydrationWarning>{getTimeBasedGreeting()}</span>, {firstName}{" "}
            <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400 light:text-slate-500">Turn your notes into something you can listen to.</p>
        </div>
        <Link
          href={ROUTES.upload}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          + Upload Notes
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total Notes" value={notes.length} color="indigo" />
        <StatCard icon={Headphones} label="Audio Episodes" value={audioTracks.length} color="violet" />
        <StatCard icon={Hourglass} label="Processing" value={processingCount} color="amber" />
        <StatCard
          icon={Music}
          label="Listening Time"
          value={formatListeningTime(totalListeningSeconds)}
          color="emerald"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickActionCard
          href={ROUTES.upload}
          icon={Upload}
          title="Upload Notes"
          description="Add new study material"
          highlighted
        />
        <QuickActionCard
          href={ROUTES.audio}
          icon={Headphones}
          title="Audio Library"
          description="Listen to your episodes"
        />
        <QuickActionCard href={ROUTES.notes} icon={Library} title="My Notes" description="View all uploaded notes" />
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 light:border-slate-200 bg-slate-900 light:bg-white">
        <div className="flex items-center justify-between border-b border-slate-800 light:border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-white light:text-slate-900">Recent Notes</h2>
          <Link href={ROUTES.notes} className="text-sm font-medium text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700">
            View all →
          </Link>
        </div>

        <div className="px-6">
          {isLoading && <LoadingSpinner label="Loading your notes..." />}

          {!isLoading && hasError && (
            <div className="py-2">
              <ErrorState description="Couldn't load your recent activity." />
            </div>
          )}

          {!isLoading && !hasError && recentNotes.length === 0 && (
            <div className="py-2">
              <EmptyState
                icon={FileText}
                title="No notes yet"
                description="Upload your first document to see it here."
                action={
                  <Link
                    href={ROUTES.upload}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Upload Notes
                  </Link>
                }
              />
            </div>
          )}

          {!isLoading && !hasError && recentNotes.length > 0 && (
            <div className="divide-y divide-slate-800 light:divide-slate-200">
              {recentNotes.map((note) => (
                <RecentNoteRow key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
