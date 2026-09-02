import { apiClient } from "./client";
import type { AuthSession, LoginCredentials, RegisterCredentials, User } from "@/types";

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>("/auth/login", credentials);
  return data;
}

export async function register(credentials: RegisterCredentials): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>("/auth/register", credentials);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function updateUser(payload: Partial<Pick<User, "name" | "email">>): Promise<User> {
  const { data } = await apiClient.patch<User>("/auth/me", payload);
  return data;
}
