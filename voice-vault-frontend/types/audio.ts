export type AudioStatus = "PROCESSING" | "READY" | "FAILED";

export interface AudioTrack {
  id: string;
  noteId: string;
  title: string;
  status: AudioStatus;
  errorMessage: string | null;
  durationSeconds: number | null;
  category: string;
  sourceFileName: string;
  createdAt: string;
}

export interface AudioDownload {
  url: string;
}
