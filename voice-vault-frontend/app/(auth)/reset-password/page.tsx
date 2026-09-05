import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white light:text-slate-900">Reset your password</h1>
      <p className="mt-1 text-sm text-slate-400 light:text-slate-500">Choose a new password for your account.</p>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
