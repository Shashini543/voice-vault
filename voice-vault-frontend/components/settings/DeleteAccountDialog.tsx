"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const CONFIRMATION_WORD = "DELETE";

interface DeleteAccountDialogProps {
  open: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAccountDialog({ open, isDeleting, onConfirm, onCancel }: DeleteAccountDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");

  if (!open) return null;

  const canDelete = confirmationText === CONFIRMATION_WORD;

  function handleCancel() {
    setConfirmationText("");
    onCancel();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />
      <div className="relative w-full max-w-sm rounded-xl border border-slate-800 light:border-slate-200 bg-slate-900 light:bg-white p-6 shadow-xl">
        <h2 className="text-base font-semibold text-white light:text-slate-900">Delete your account?</h2>
        <p className="mt-2 text-sm text-slate-400 light:text-slate-500">
          This permanently deletes your account, all your notes, and all generated audio. This action cannot be
          undone.
        </p>

        <div className="mt-4">
          <Label htmlFor="delete-confirmation" className="text-slate-300 light:text-slate-700">
            Type <span className="font-semibold text-red-400 light:text-red-600">{CONFIRMATION_WORD}</span> to
            confirm
          </Label>
          <Input
            id="delete-confirmation"
            variant="dashboard"
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            placeholder={CONFIRMATION_WORD}
            autoComplete="off"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700 light:border-slate-300 bg-slate-800 light:bg-white px-4 text-sm font-semibold text-slate-100 light:text-slate-700 transition-colors hover:bg-slate-700 light:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting || !canDelete}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
