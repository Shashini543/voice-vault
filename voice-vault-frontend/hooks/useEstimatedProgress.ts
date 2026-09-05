import { useEffect, useState } from "react";

// The backend pipeline (extract -> Gemini study notes -> Gemini script ->
// Polly audio) doesn't expose real per-stage progress, so this estimates
// elapsed-time-based progress instead: fills smoothly toward a cap based on
// a typical processing duration, then waits there until the caller's own
// polling detects the note has actually finished (status flips away from
// PROCESSING) and stops rendering this at all.
const ASSUMED_DURATION_SECONDS = 90;
const MAX_ESTIMATED_PERCENT = 92;
const TICK_MS = 1000;

function computePercent(startedAt: string): number {
  const elapsedSeconds = (Date.now() - new Date(startedAt).getTime()) / 1000;
  const raw = (elapsedSeconds / ASSUMED_DURATION_SECONDS) * 100;
  return Math.min(MAX_ESTIMATED_PERCENT, Math.max(0, raw));
}

export function useEstimatedProgress(startedAt: string, isActive: boolean): number {
  const [percent, setPercent] = useState(() => computePercent(startedAt));

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => setPercent(computePercent(startedAt)), TICK_MS);
    return () => clearInterval(interval);
  }, [startedAt, isActive]);

  return isActive ? percent : 0;
}
