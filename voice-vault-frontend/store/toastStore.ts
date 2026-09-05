import { create } from "zustand";

export type ToastTone = "success" | "error";

interface ToastState {
  message: string | null;
  tone: ToastTone;
  show: (message: string, tone?: ToastTone) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  tone: "success",
  show: (message, tone = "success") => set({ message, tone }),
  hide: () => set({ message: null }),
}));
