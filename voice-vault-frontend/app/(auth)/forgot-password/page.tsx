import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white light:text-slate-900">Forgot your password?</h1>
      <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
