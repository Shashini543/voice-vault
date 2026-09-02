export const NOTE_STATUS = {
  UPLOADING: "UPLOADING",
  PROCESSING: "PROCESSING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

export type NoteStatus = (typeof NOTE_STATUS)[keyof typeof NOTE_STATUS];

export interface Note {
  id: string;
  title: string;
  sourceFileName: string;
  category: string;
  status: NoteStatus;
  script: string | null;
  audioId: string | null;
  durationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}
