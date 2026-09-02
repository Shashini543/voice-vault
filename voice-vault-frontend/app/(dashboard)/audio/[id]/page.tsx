"use client";

import { use, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { getAudio } from "@/lib/api/audio";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import type { AudioTrack } from "@/types";

export default function AudioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fetcher = useCallback(() => getAudio(id), [id]);
  const { data: audio, status, error, retry } = useAsyncResource<AudioTrack>(fetcher, [id]);

  if (status === "loading") return <LoadingSpinner label="Loading audio..." />;
  if (status === "error") return <ErrorState description={error ?? "Failed to load audio."} onRetry={retry} />;
  if (!audio) return null;

  return (
    <div>
      <PageHeader title={audio.title} />
      <AudioPlayer audio={audio} />
    </div>
  );
}
