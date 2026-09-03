"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "./GoogleButton";
import { OrDivider } from "./OrDivider";
import { ROUTES } from "@/lib/constants";

export function RegisterForm() {
  const { registerUser, isSubmitting, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  return (
    <div className="mt-6">
      <GoogleButton label="Sign up with Google" />
      <OrDivider label="or sign up with email" />

      <form className="space-y-4" onSubmit={handleSubmit(registerUser)} noValidate>
        {error && (
          <p className="rounded-lg bg-red-500/10 light:bg-red-50 px-3 py-2 text-sm text-red-400 light:text-red-700" role="alert">
            {error}
          </p>
        )}

        <div>
          <Label htmlFor="name" className="text-slate-300 light:text-slate-700">Full Name</Label>
          <Input id="name" type="text" variant="dashboard" placeholder="Jane Doe" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400 light:text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-slate-300 light:text-slate-700">Email</Label>
          <Input id="email" type="email" variant="dashboard" placeholder="you@university.edu" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-400 light:text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="text-slate-300 light:text-slate-700">Password</Label>
          <PasswordInput id="password" variant="dashboard" placeholder="Min. 8 characters" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red-400 light:text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-slate-300 light:text-slate-700">Confirm Password</Label>
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
          Create Account
        </Button>

        <p className="text-center text-sm text-slate-400 light:text-slate-500">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="font-semibold text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500 light:text-slate-400">
        By creating an account, you agree to our <span className="underline">Terms of Service</span> and{" "}
        <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
}
