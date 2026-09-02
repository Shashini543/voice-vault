export function OrDivider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-700 light:bg-slate-200" />
      <span className="text-xs text-slate-500 light:text-slate-400">{label}</span>
      <div className="h-px flex-1 bg-slate-700 light:bg-slate-200" />
    </div>
  );
}
