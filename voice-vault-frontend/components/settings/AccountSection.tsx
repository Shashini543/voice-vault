"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { exportData, deleteAccount } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToastStore } from "@/store/toastStore";
import { ROUTES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";

export function AccountSection() {
  const { logout } = useAuth();
  const showToast = useToastStore((state) => state.show);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleExport() {
    setIsExporting(true);
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "voice-vault-data-export.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      await deleteAccount("DELETE");
      logout();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }

  return (
    <>
      <Card>
        <p className="font-semibold text-white light:text-slate-900">Account</p>

        <div className="mt-4 space-y-3">
          <Link
            href={ROUTES.forgotPassword}
            className="block w-full rounded-lg border border-slate-700 light:border-slate-300 px-4 py-2.5 text-left text-sm font-medium text-slate-200 light:text-slate-700 hover:bg-slate-800 light:hover:bg-slate-50"
          >
            Change Password
          </Link>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="w-full rounded-lg border border-slate-700 light:border-slate-300 px-4 py-2.5 text-left text-sm font-medium text-slate-200 light:text-slate-700 hover:bg-slate-800 light:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? "Preparing export..." : "Export My Data"}
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="w-full rounded-lg border border-slate-700 light:border-slate-300 px-4 py-2.5 text-left text-sm font-medium text-red-400 light:text-red-600 hover:bg-red-500/5 light:hover:bg-red-50"
          >
            Delete Account
          </button>
        </div>
      </Card>

      <DeleteAccountDialog
        open={isDeleteOpen}
        isDeleting={isDeleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  );
}
