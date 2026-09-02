import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white light:text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-400 light:text-slate-500">Start turning your notes into audio today.</p>
      <RegisterForm />
    </div>
  );
}
