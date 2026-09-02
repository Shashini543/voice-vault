import { apiClient } from "./client";
import type { Note, UploadPayload } from "@/types";

export async function getNotes(): Promise<Note[]> {
  const { data } = await apiClient.get<Note[]>("/notes");
  return data;
}

export async function getNote(id: string): Promise<Note> {
  const { data } = await apiClient.get<Note>(`/notes/${id}`);
  return data;
}

export async function uploadNote(payload: UploadPayload): Promise<Note> {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.title) formData.append("title", payload.title);

  const { data } = await apiClient.post<Note>("/notes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  await apiClient.delete(`/notes/${id}`);
}
