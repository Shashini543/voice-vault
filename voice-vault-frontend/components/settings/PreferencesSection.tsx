import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";

const PLAYBACK_SPEEDS = ["0.75", "1", "1.25", "1.5", "2"];

function speedLabel(speed: string): string {
  return speed === "1" ? "1x (Normal)" : `${speed}x`;
}

interface PreferencesSectionProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  playbackSpeed: string;
  onPlaybackSpeedChange: (speed: string) => void;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
}

export function PreferencesSection({
  isDarkMode,
  onToggleDarkMode,
  playbackSpeed,
  onPlaybackSpeedChange,
  autoPlay,
  onToggleAutoPlay,
}: PreferencesSectionProps) {
  return (
    <Card>
      <p className="font-semibold text-white light:text-slate-900">Preferences</p>

      <div className="mt-4 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white light:text-slate-900">Dark Mode</p>
            <p className="text-sm text-slate-400 light:text-slate-500">Switch between light and dark themes.</p>
          </div>
          <Switch checked={isDarkMode} onChange={onToggleDarkMode} label="Dark Mode" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white light:text-slate-900">Default Playback Speed</p>
            <p className="text-sm text-slate-400 light:text-slate-500">Set your preferred audio speed.</p>
          </div>
          <Select
            value={playbackSpeed}
            onChange={(event) => onPlaybackSpeedChange(event.target.value)}
            className="w-40"
          >
            {PLAYBACK_SPEEDS.map((speed) => (
              <option key={speed} value={speed}>
                {speedLabel(speed)}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white light:text-slate-900">Auto-play Next Episode</p>
            <p className="text-sm text-slate-400 light:text-slate-500">
              Automatically play the next episode when one ends.
            </p>
          </div>
          <Switch checked={autoPlay} onChange={onToggleAutoPlay} label="Auto-play Next Episode" />
        </div>
      </div>
    </Card>
  );
}
