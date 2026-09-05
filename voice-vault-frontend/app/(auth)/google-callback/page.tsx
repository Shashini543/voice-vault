"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/lib/constants";
import type { User } from "@/types";

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace(`${ROUTES.login}?error=google_oauth_failed`);
      return;
    }

    axios
      .get<User>(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data: user }) => {
        setSession(user, token);
        router.replace(ROUTES.dashboard);
      })
      .catch(() => {
        router.replace(`${ROUTES.login}?error=google_oauth_failed`);
      });
  }, [searchParams, router, setSession]);

  return <LoadingSpinner label="Signing you in..." />;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Signing you in..." />}>
      <GoogleCallbackHandler />
    </Suspense>
  );
}
