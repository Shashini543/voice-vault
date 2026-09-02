import { apiClient } from "./client";
import type { AudioTrack } from "@/types";

export async function getAudioList(): Promise<AudioTrack[]> {
  const { data } = await apiClient.get<AudioTrack[]>("/audio");
  return data;
}

export async function getAudio(id: string): Promise<AudioTrack> {
  const { data } = await apiClient.get<AudioTrack>(`/audio/${id}`);
  return data;
}
