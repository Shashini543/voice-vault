import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white light:text-slate-900">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-400 light:text-slate-500">Sign in to your Voice Vault account.</p>
      <LoginForm />
    </div>
  );
}
