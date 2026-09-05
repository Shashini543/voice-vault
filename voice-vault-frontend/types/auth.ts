import type { User } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ExportedNote {
  id: string;
  title: string;
  category: string;
  status: string;
  studyNotes: string | null;
  script: string | null;
  createdAt: string;
}

export interface ExportedAudio {
  id: string;
  title: string;
  category: string;
  status: string;
  durationSeconds: number | null;
  createdAt: string;
}

export interface ExportData {
  exportedAt: string;
  user: User;
  notes: ExportedNote[];
  audio: ExportedAudio[];
}
