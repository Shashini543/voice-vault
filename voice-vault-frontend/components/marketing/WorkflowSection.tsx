import { ArrowRight, FileText, Headphones } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Upload Notes",
    description: "PDF, TXT, PNG, JPG",
  },
  {
    icon: null,
    emoji: "🤖",
    title: "AI Processing",
    description: "Creates study script",
  },
  {
    icon: Headphones,
    title: "Listen & Learn",
    description: "Podcast-style audio",
  },
];

export function WorkflowSection() {
  return (
    <section className="bg-indigo-500/10 light:bg-indigo-50/60 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-indigo-400 light:text-indigo-500">
          The Workflow
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center gap-4">
              <div className="flex w-44 flex-col items-center rounded-xl bg-slate-900 light:bg-white px-4 py-6 text-center">
                {step.icon ? (
                  <step.icon className="mb-3 h-6 w-6 text-slate-400" />
                ) : (
                  <span className="mb-3 text-2xl leading-none">{step.emoji}</span>
                )}
                <p className="text-sm font-semibold text-white light:text-slate-900">{step.title}</p>
                <p className="mt-1 text-xs text-slate-400 light:text-slate-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden h-5 w-5 flex-shrink-0 text-indigo-400/50 light:text-indigo-300 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
