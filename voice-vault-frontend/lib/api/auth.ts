import { apiClient } from "./client";
import type {
  AuthSession,
  ExportData,
  ForgotPasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
  User,
} from "@/types";

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

export async function forgotPassword(payload: ForgotPasswordCredentials): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>("/auth/forgot-password", payload);
  return data;
}

export async function resetPassword(payload: ResetPasswordCredentials): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>("/auth/reset-password", payload);
  return data;
}

export async function exportData(): Promise<ExportData> {
  const { data } = await apiClient.get<ExportData>("/auth/export");
  return data;
}

export async function deleteAccount(confirmation: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>("/auth/me", { data: { confirmation } });
  return data;
}
