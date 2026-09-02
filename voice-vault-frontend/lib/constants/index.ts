export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  notes: "/notes",
  noteDetail: (id: string) => `/notes/${id}`,
  upload: "/upload",
  audio: "/audio",
  audioDetail: (id: string) => `/audio/${id}`,
  settings: "/settings",
} as const;

export const SECTION_IDS = {
  features: "features",
  howItWorks: "how-it-works",
} as const;

export const ACCEPTED_UPLOAD_TYPES = [
  "application/pdf",
  "text/plain",
  "image/png",
  "image/jpeg",
] as const;

export const ACCEPTED_UPLOAD_EXTENSIONS = [".pdf", ".txt", ".png", ".jpg", ".jpeg"] as const;

export const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;
