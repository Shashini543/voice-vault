const PLAYBACK_SPEED_KEY = "voice-vault-playback-speed";
const AUTO_PLAY_KEY = "voice-vault-auto-play";

const DEFAULT_PLAYBACK_SPEED = 1;
const DEFAULT_AUTO_PLAY = true;

export function getStoredPlaybackSpeed(): number {
  if (typeof window === "undefined") return DEFAULT_PLAYBACK_SPEED;
  const raw = window.localStorage.getItem(PLAYBACK_SPEED_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PLAYBACK_SPEED;
}

export function setStoredPlaybackSpeed(speed: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYBACK_SPEED_KEY, String(speed));
}

export function getStoredAutoPlay(): boolean {
  if (typeof window === "undefined") return DEFAULT_AUTO_PLAY;
  const raw = window.localStorage.getItem(AUTO_PLAY_KEY);
  return raw === null ? DEFAULT_AUTO_PLAY : raw === "true";
}

export function setStoredAutoPlay(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTO_PLAY_KEY, String(enabled));
}
