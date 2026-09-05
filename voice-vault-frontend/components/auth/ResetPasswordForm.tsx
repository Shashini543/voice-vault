"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth";
import { resetPassword } from "@/lib/api/auth";
import { Label } from "@/components/ui/Label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const { message } = await resetPassword({ token, ...values });
      setSuccessMessage(message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <div className="mt-6">
        <p
          className="rounded-lg bg-emerald-500/10 light:bg-emerald-50 px-3 py-2 text-sm text-emerald-400 light:text-emerald-700"
          role="status"
        >
          {successMessage}
        </p>
        <p className="mt-6 text-center text-sm text-slate-400 light:text-slate-500">
          <Link
            href={ROUTES.login}
            className="font-semibold text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700"
          >
            Continue to sign in
          </Link>
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mt-6">
        <p className="rounded-lg bg-red-500/10 light:bg-red-50 px-3 py-2 text-sm text-red-400 light:text-red-700" role="alert">
          This reset link is invalid or has expired.
        </p>
        <p className="mt-6 text-center text-sm text-slate-400 light:text-slate-500">
          <Link
            href={ROUTES.forgotPassword}
            className="font-semibold text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700"
          >
            Request a new reset link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <p className="rounded-lg bg-red-500/10 light:bg-red-50 px-3 py-2 text-sm text-red-400 light:text-red-700" role="alert">
            {error}
          </p>
        )}

        <div>
          <Label htmlFor="newPassword" className="text-slate-300 light:text-slate-700">New Password</Label>
          <PasswordInput id="newPassword" variant="dashboard" placeholder="Min. 8 characters" {...register("newPassword")} />
          {errors.newPassword && <p className="mt-1 text-xs text-red-400 light:text-red-600">{errors.newPassword.message}</p>}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-slate-300 light:text-slate-700">Confirm New Password</Label>
          <PasswordInput
            id="confirmPassword"
            variant="dashboard"
            placeholder="Repeat password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400 light:text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
          Reset Password
        </Button>
      </form>
    </div>
  );
}
