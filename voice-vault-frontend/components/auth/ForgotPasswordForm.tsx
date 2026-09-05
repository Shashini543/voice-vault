"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth";
import { forgotPassword } from "@/lib/api/auth";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const { message } = await forgotPassword(values);
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
            Back to sign in
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
          <Label htmlFor="email" className="text-slate-300 light:text-slate-700">Email</Label>
          <Input id="email" type="email" variant="dashboard" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-400 light:text-red-600">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-slate-400 light:text-slate-500">
          Remembered your password?{" "}
          <Link
            href={ROUTES.login}
            className="font-semibold text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
