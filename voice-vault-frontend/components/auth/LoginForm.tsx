"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "./GoogleButton";
import { OrDivider } from "./OrDivider";
import { ROUTES } from "@/lib/constants";

export function LoginForm() {
  const { loginUser, isSubmitting, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="mt-6">
      <GoogleButton label="Continue with Google" />
      <OrDivider label="or continue with email" />

      <form className="space-y-4" onSubmit={handleSubmit(loginUser)} noValidate>
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

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-300 light:text-slate-700">Password</Label>
            <button type="button" className="text-sm font-medium text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700">
              Forgot password?
            </button>
          </div>
          <Input id="password" type="password" variant="dashboard" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red-400 light:text-red-600">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
          Sign In
        </Button>

        <p className="text-center text-sm text-slate-400 light:text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.register} className="font-semibold text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700">
            Create account
          </Link>
        </p>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500 light:text-slate-400">
        By signing in, you agree to our <span className="underline">Terms of Service</span> and{" "}
        <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
}
