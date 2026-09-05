"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, Pause, Play, RotateCcw, RotateCw, Volume2 } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { downloadAudio } from "@/lib/api/audio";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { cn, formatDuration, seededBars } from "@/lib/utils";
import { getStoredPlaybackSpeed, setStoredPlaybackSpeed } from "@/lib/preferences";
import { ROUTES } from "@/lib/constants";
import type { AudioDownload, AudioTrack } from "@/types";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SKIP_SECONDS = 10;
const WAVEFORM_BAR_COUNT = 32;

export function AudioPlayer({
  audio,
  showViewNotesLink = false,
  onEnded,
}: {
  audio: AudioTrack;
  showViewNotesLink?: boolean;
  onEnded?: () => void;
}) {
  const fetcher = useCallback(() => downloadAudio(audio.id), [audio.id]);
  const { data, status, error, retry } = useAsyncResource<AudioDownload>(fetcher, [audio.id]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(() => getStoredPlaybackSpeed());
  const [volume, setVolume] = useState(1);

  const bars = seededBars(audio.id, WAVEFORM_BAR_COUNT);
  const progress = duration > 0 ? currentTime / duration : 0;

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.pause();
    else el.play();
  }

  function skip(seconds: number) {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.min(Math.max(el.currentTime + seconds, 0), el.duration);
  }

  function seekToFraction(fraction: number) {
    const el = audioRef.current;
    if (!el || !duration) return;
    el.currentTime = Math.min(Math.max(fraction, 0), 1) * duration;
  }

  function handleSeekClick(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    seekToFraction((event.clientX - rect.left) / rect.width);
  }

  function handleSpeedChange(value: number) {
    setSpeed(value);
    setStoredPlaybackSpeed(value);
    if (audioRef.current) audioRef.current.playbackRate = value;
  }

  function handleVolumeChange(value: number) {
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  }

  async function handleDownload() {
    const { url } = await downloadAudio(audio.id);
    window.location.href = url;
  }

  if (status === "loading") return <LoadingSpinner label="Loading audio..." />;
  if (status === "error") return <ErrorState description={error ?? "Failed to load audio."} onRetry={retry} />;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-800 light:border-slate-200 bg-gradient-to-b from-indigo-950/40 to-slate-900 light:from-indigo-50 light:to-white">
        <div className="flex flex-col items-center px-6 pb-6 pt-8">
          <button
            type="button"
            onClick={handleSeekClick}
            className="mb-6 flex h-24 w-full max-w-md items-end justify-center gap-1"
            aria-label="Seek"
          >
            {bars.map((height, index) => (
              <span
                key={index}
                className={cn(
                  "w-1.5 rounded-full transition-colors",
                  index / bars.length <= progress ? "bg-indigo-400" : "bg-indigo-500/20"
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </button>

          <h2 className="text-lg font-bold text-white light:text-slate-900">{audio.title}</h2>
          <p className="mt-1 text-sm text-slate-400 light:text-slate-500">Generated from {audio.sourceFileName}</p>
          <span className="mt-3 inline-flex items-center rounded-full bg-indigo-500/10 light:bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-400 light:text-indigo-600">
            {audio.category}
          </span>
        </div>

        <div className="border-t border-slate-800 light:border-slate-200 px-6 py-5">
          <button
            type="button"
            onClick={handleSeekClick}
            className="block h-1.5 w-full rounded-full bg-slate-700 light:bg-slate-200"
            aria-label="Seek"
          >
            <span className="block h-full rounded-full bg-indigo-500" style={{ width: `${progress * 100}%` }} />
          </button>
          <div className="mt-2 flex justify-between text-xs text-slate-500 light:text-slate-400">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>

          <div className="mt-5 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => skip(-SKIP_SECONDS)}
              className="flex flex-col items-center gap-0.5 text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700"
              aria-label={`Rewind ${SKIP_SECONDS} seconds`}
            >
              <RotateCcw className="h-5 w-5" />
              <span className="text-[10px]">{SKIP_SECONDS}s</span>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-500"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
            </button>

            <button
              type="button"
              onClick={() => skip(SKIP_SECONDS)}
              className="flex flex-col items-center gap-0.5 text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700"
              aria-label={`Forward ${SKIP_SECONDS} seconds`}
            >
              <RotateCw className="h-5 w-5" />
              <span className="text-[10px]">{SKIP_SECONDS}s</span>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="mr-1 text-slate-500 light:text-slate-400">Speed</span>
              {SPEEDS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSpeedChange(value)}
                  className={cn(
                    "rounded px-1.5 py-1 font-semibold",
                    speed === value
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700"
                  )}
                >
                  {value}×
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-slate-400 light:text-slate-500" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(event) => handleVolumeChange(Number(event.target.value))}
                className="h-1.5 w-24 accent-indigo-500"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={data.url}
          className="hidden"
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration);
            event.currentTarget.playbackRate = speed;
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
        />
      </div>

      <div className="rounded-xl border border-slate-800 light:border-slate-200 bg-slate-900 light:bg-white p-6">
        <h3 className="text-base font-semibold text-white light:text-slate-900">About this episode</h3>
        <p className="mt-2 text-sm text-slate-400 light:text-slate-500">
          This audio study session covering {audio.category}, created from {audio.sourceFileName}.
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-800 light:border-slate-200 pt-4">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 light:text-slate-600 hover:text-white light:hover:text-slate-900"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          {showViewNotesLink && (
            <Link
              href={ROUTES.noteDetail(audio.noteId)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700"
            >
              View notes
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
