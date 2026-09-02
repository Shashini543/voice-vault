import { Card } from "@/components/ui/Card";
import type { AudioTrack } from "@/types";

export function AudioPlayer({ audio }: { audio: AudioTrack }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-white light:text-slate-900">{audio.title}</h2>
      <audio className="mt-4 w-full" controls src={audio.url}>
        Your browser does not support the audio element.
      </audio>
    </Card>
  );
}
