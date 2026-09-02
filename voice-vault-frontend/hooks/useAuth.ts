import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import * as authApi from "@/lib/api/auth";
import { ROUTES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import type { LoginCredentials, RegisterCredentials } from "@/types";

export function useAuth() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const logoutStore = useAuthStore((state) => state.logout);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loginUser(credentials: LoginCredentials) {
    setIsSubmitting(true);
    setError(null);
    try {
      const session = await authApi.login(credentials);
      setSession(session.user, session.token);
      router.push(ROUTES.dashboard);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function registerUser(credentials: RegisterCredentials) {
    setIsSubmitting(true);
    setError(null);
    try {
      const session = await authApi.register(credentials);
      setSession(session.user, session.token);
      router.push(ROUTES.dashboard);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function logout() {
    logoutStore();
    router.push(ROUTES.home);
  }

  return { loginUser, registerUser, logout, isSubmitting, error };
}
