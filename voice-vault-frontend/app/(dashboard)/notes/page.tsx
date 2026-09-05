"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { SearchInput } from "@/components/common/SearchInput";
import { NoteCard } from "@/components/notes/NoteCard";
import { FilterTabs, type NoteFilter } from "@/components/notes/FilterTabs";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { getNotes } from "@/lib/api/notes";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { ROUTES } from "@/lib/constants";
import { NOTE_STATUS } from "@/types";
import type { Note } from "@/types";

type SortOrder = "date" | "name";

export default function NotesPage() {
  const { data: notes, status, error, retry, mutate } = useAsyncResource<Note[]>(getNotes, []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<NoteFilter>("all");
  const [sort, setSort] = useState<SortOrder>("date");

  const allNotes = useMemo(() => notes ?? [], [notes]);
  const readyCount = allNotes.filter((note) => note.status === NOTE_STATUS.READY).length;
  const hasProcessing = allNotes.some((note) => note.status === NOTE_STATUS.PROCESSING);

  useEffect(() => {
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      getNotes()
        .then((fresh) => mutate(fresh))
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [hasProcessing, mutate]);

  const visibleNotes = useMemo(() => {
    let result = allNotes;

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((note) => note.title.toLowerCase().includes(query));
    }

    if (filter === "ready") {
      result = result.filter((note) => note.status === NOTE_STATUS.READY);
    } else if (filter === "processing") {
      result = result.filter((note) => note.status === NOTE_STATUS.PROCESSING);
    }

    return [...result].sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allNotes, search, filter, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">My Notes</h1>
          <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
            {allNotes.length} notes · {readyCount} with audio ready
          </p>
        </div>
        <Link href={ROUTES.upload}>
          <Button>+ Upload Notes</Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          placeholder="Search notes..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <FilterTabs value={filter} onChange={setFilter} />
        <Select value={sort} onChange={(event) => setSort(event.target.value as SortOrder)} className="sm:w-44">
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </Select>
      </div>

      {status === "loading" && <LoadingSpinner label="Loading your notes..." />}

      {status === "error" && <ErrorState description={error ?? "Failed to load notes."} onRetry={retry} />}

      {status === "ready" && allNotes.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Upload your first document to generate a study script and audio."
          action={
            <Link href={ROUTES.upload}>
              <Button>Upload Notes</Button>
            </Link>
          }
        />
      )}

      {status === "ready" && allNotes.length > 0 && visibleNotes.length === 0 && (
        <EmptyState icon={FileText} title="No matching notes" description="Try a different search or filter." />
      )}

      {status === "ready" && visibleNotes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDeleted={(id) => mutate((prev) => (prev ?? []).filter((n) => n.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
