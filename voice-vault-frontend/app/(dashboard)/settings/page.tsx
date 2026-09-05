"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { AccountSection } from "@/components/settings/AccountSection";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils";
import { getStoredAutoPlay, getStoredPlaybackSpeed, setStoredAutoPlay, setStoredPlaybackSpeed } from "@/lib/preferences";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { logout } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [playbackSpeed, setPlaybackSpeed] = useState(() => String(getStoredPlaybackSpeed()));
  const [autoPlay, setAutoPlay] = useState(() => getStoredAutoPlay());

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePlaybackSpeedChange(speed: string) {
    setPlaybackSpeed(speed);
    setStoredPlaybackSpeed(Number(speed));
  }

  function handleToggleAutoPlay() {
    setAutoPlay((value) => {
      const next = !value;
      setStoredAutoPlay(next);
      return next;
    });
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateUser({ name, email });
      setUser(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      {error && (
        <p className="mb-6 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-6">
        <ProfileSection user={user} name={name} email={email} onNameChange={setName} onEmailChange={setEmail} />

        <PreferencesSection
          isDarkMode={theme === "dark"}
          onToggleDarkMode={toggleTheme}
          playbackSpeed={playbackSpeed}
          onPlaybackSpeedChange={handlePlaybackSpeedChange}
          autoPlay={autoPlay}
          onToggleAutoPlay={handleToggleAutoPlay}
        />

        <AccountSection />

        <Button className="w-full" isLoading={isSaving} disabled={isSaving} onClick={handleSave}>
          Save Changes
        </Button>

        <button
          type="button"
          onClick={logout}
          className="block w-full text-center text-sm font-medium text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
