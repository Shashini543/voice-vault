"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/common/BackLink";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { getAudio, getAudioList } from "@/lib/api/audio";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { getStoredAutoPlay } from "@/lib/preferences";
import { ROUTES } from "@/lib/constants";
import type { AudioTrack } from "@/types";

export default function AudioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const fetcher = useCallback(() => getAudio(id), [id]);
  const { data: audio, status, error, retry } = useAsyncResource<AudioTrack>(fetcher, [id]);
  const [nextTrackId, setNextTrackId] = useState<string | null>(null);

  useEffect(() => {
    getAudioList()
      .then((tracks) => {
        const readyTracks = tracks.filter((track) => track.status === "READY");
        const currentIndex = readyTracks.findIndex((track) => track.id === id);
        const next = currentIndex >= 0 ? readyTracks[currentIndex + 1] : undefined;
        setNextTrackId(next?.id ?? null);
      })
      .catch(() => setNextTrackId(null));
  }, [id]);

  function handleEnded() {
    if (nextTrackId && getStoredAutoPlay()) {
      router.push(ROUTES.audioDetail(nextTrackId));
    }
  }

  if (status === "loading") {
    return (
      <div>
        <BackLink href={ROUTES.audio} label="Back to Audio Library" />
        <LoadingSpinner label="Loading audio..." />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div>
        <BackLink href={ROUTES.audio} label="Back to Audio Library" />
        <ErrorState description={error ?? "Failed to load audio."} onRetry={retry} />
      </div>
    );
  }
  if (!audio) return null;

  return (
    <div>
      <BackLink href={ROUTES.audio} label="Back to Audio Library" />
      <AudioPlayer audio={audio} showViewNotesLink onEnded={nextTrackId ? handleEnded : undefined} />
    </div>
  );
}
