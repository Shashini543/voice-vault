import { apiClient } from "./client";
import type { AudioDownload, AudioTrack } from "@/types";

export async function getAudioList(): Promise<AudioTrack[]> {
  const { data } = await apiClient.get<AudioTrack[]>("/audio");
  return data;
}

export async function getAudio(id: string): Promise<AudioTrack> {
  const { data } = await apiClient.get<AudioTrack>(`/audio/${id}`);
  return data;
}

export async function downloadAudio(id: string): Promise<AudioDownload> {
  const { data } = await apiClient.get<AudioDownload>(`/audio/${id}/download`);
  return data;
}
