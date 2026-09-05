"use client";

import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { downloadAudio } from "@/lib/api/audio";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useCallback } from "react";
import type { AudioDownload, AudioTrack } from "@/types";

export function AudioPlayer({ audio }: { audio: AudioTrack }) {
  const fetcher = useCallback(() => downloadAudio(audio.id), [audio.id]);
  const { data, status, error, retry } = useAsyncResource<AudioDownload>(fetcher, [audio.id]);

  async function handleDownload() {
    const { url } = await downloadAudio(audio.id);
    window.location.href = url;
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white light:text-slate-900">{audio.title}</h2>

      {status === "loading" && <LoadingSpinner label="Loading audio..." />}
      {status === "error" && <ErrorState description={error ?? "Failed to load audio."} onRetry={retry} />}

      {status === "ready" && data && (
        <>
          <audio className="mt-4 w-full" controls src={data.url}>
            Your browser does not support the audio element.
          </audio>
          <button
            type="button"
            onClick={handleDownload}
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 light:border-slate-300 bg-slate-800 light:bg-white px-4 text-sm font-semibold text-slate-100 light:text-slate-700 transition-colors hover:bg-slate-700 light:hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Download Audio
          </button>
        </>
      )}
    </Card>
  );
}
