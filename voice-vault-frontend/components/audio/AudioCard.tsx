import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { formatDuration, seededBars } from "@/lib/utils";
import type { AudioTrack } from "@/types";

export function AudioCard({ audio }: { audio: AudioTrack }) {
  const bars = seededBars(audio.id, 18);

  return (
    <Link href={ROUTES.audioDetail(audio.id)}>
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 light:border-slate-200 bg-slate-900 light:bg-white transition-colors hover:bg-slate-800 light:hover:bg-slate-50">
        <div className="flex h-24 items-end justify-center gap-1 rounded-t-xl bg-indigo-500/10 light:bg-indigo-50 px-4 pb-4 pt-6">
          {bars.map((height, index) => (
            <span
              key={index}
              className="w-1.5 rounded-full bg-indigo-400 light:bg-indigo-400"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="inline-flex w-fit items-center rounded-full bg-indigo-500/10 light:bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-400 light:text-indigo-600">
            {audio.category}
          </span>
          <p className="mt-3 font-semibold text-white light:text-slate-900">{audio.title}</p>
          <p className="mt-1 truncate text-sm text-slate-400 light:text-slate-500">From: {audio.sourceFileName}</p>

          <div className="mt-4 flex flex-1 items-end justify-between">
            <span className="text-sm text-slate-400 light:text-slate-500">
              {audio.durationSeconds != null ? formatDuration(audio.durationSeconds) : "—"}
            </span>
            <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">
              ▸ Play
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
