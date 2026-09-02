import { Card } from "@/components/ui/Card";

export function AccountSection() {
  return (
    <Card>
      <p className="font-semibold text-white light:text-slate-900">Account</p>

      <div className="mt-4 space-y-3">
        <button
          type="button"
          className="w-full rounded-lg border border-slate-700 light:border-slate-300 px-4 py-2.5 text-left text-sm font-medium text-slate-200 light:text-slate-700 hover:bg-slate-800 light:hover:bg-slate-50"
        >
          Change Password
        </button>
        <button
          type="button"
          className="w-full rounded-lg border border-slate-700 light:border-slate-300 px-4 py-2.5 text-left text-sm font-medium text-slate-200 light:text-slate-700 hover:bg-slate-800 light:hover:bg-slate-50"
        >
          Export My Data
        </button>
        <button
          type="button"
          className="w-full rounded-lg border border-slate-700 light:border-slate-300 px-4 py-2.5 text-left text-sm font-medium text-red-400 light:text-red-600 hover:bg-red-500/5 light:hover:bg-red-50"
        >
          Delete Account
        </button>
      </div>
    </Card>
  );
}
