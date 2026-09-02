import Link from "next/link";
import { ROUTES, SECTION_IDS } from "@/lib/constants";

const steps = [
  { number: 1, title: "Upload", description: "Upload your notes in any format." },
  { number: 2, title: "Extract", description: "Text is extracted from your file." },
  { number: 3, title: "AI Script", description: "AI crafts a conversational script." },
  { number: 4, title: "Generate Audio", description: "Text-to-speech creates your audio." },
  { number: 5, title: "Listen", description: "Listen anytime, on any device." },
];

export function HowItWorksSection() {
  return (
    <section id={SECTION_IDS.howItWorks} className="scroll-mt-16 bg-slate-900 light:bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white light:text-slate-900 sm:text-4xl">How it works</h2>
          <p className="mt-3 text-lg text-slate-400 light:text-slate-500">From notes to audio in five simple steps.</p>
        </div>

        <div className="relative mt-14 flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div
            className="absolute left-[calc(10%+1.25rem)] right-[calc(10%+1.25rem)] top-5 hidden h-px bg-slate-700 light:bg-slate-200 sm:block"
            aria-hidden
          />
          {steps.map((step) => (
            <div key={step.number} className="relative flex items-start gap-4 sm:w-1/5 sm:flex-col sm:items-center">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {step.number}
              </div>
              <div className="text-left sm:mt-4 sm:text-center">
                <p className="text-sm font-semibold text-white light:text-slate-900">{step.title}</p>
                <p className="mx-auto mt-1 max-w-[9rem] text-xs text-slate-400 light:text-slate-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href={ROUTES.register}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 text-base font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Start Learning Smarter
          </Link>
        </div>
      </div>
    </section>
  );
}
