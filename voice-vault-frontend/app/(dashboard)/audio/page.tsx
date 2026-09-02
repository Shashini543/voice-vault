"use client";

import { useMemo, useState } from "react";
import { Music } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { SearchInput } from "@/components/common/SearchInput";
import { AudioCard } from "@/components/audio/AudioCard";
import { Select } from "@/components/ui/Select";
import { getAudioList } from "@/lib/api/audio";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import type { AudioTrack } from "@/types";

export default function AudioPage() {
  const { data: tracks, status, error, retry } = useAsyncResource<AudioTrack[]>(getAudioList, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const allTracks = useMemo(() => tracks ?? [], [tracks]);
  const categories = useMemo(
    () => Array.from(new Set(allTracks.map((track) => track.category))).sort(),
    [allTracks]
  );

  const visibleTracks = useMemo(() => {
    let result = allTracks;

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((track) => track.title.toLowerCase().includes(query));
    }

    if (category !== "all") {
      result = result.filter((track) => track.category === category);
    }

    return result;
  }, [allTracks, search, category]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white light:text-slate-900">Audio Library</h1>
        <p className="mt-1 text-sm text-slate-400 light:text-slate-500">{allTracks.length} episodes ready to listen</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          placeholder="Search episodes..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select value={category} onChange={(event) => setCategory(event.target.value)} className="sm:w-48">
          <option value="all">All</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      {status === "loading" && <LoadingSpinner label="Loading your audio..." />}

      {status === "error" && <ErrorState description={error ?? "Failed to load audio."} onRetry={retry} />}

      {status === "ready" && allTracks.length === 0 && (
        <EmptyState
          icon={Music}
          title="No audio yet"
          description="Upload notes to generate your first podcast-style audio."
        />
      )}

      {status === "ready" && allTracks.length > 0 && visibleTracks.length === 0 && (
        <EmptyState icon={Music} title="No matching episodes" description="Try a different search or category." />
      )}

      {status === "ready" && visibleTracks.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleTracks.map((track) => (
            <AudioCard key={track.id} audio={track} />
          ))}
        </div>
      )}
    </div>
  );
}
