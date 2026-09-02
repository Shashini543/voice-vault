import { FileText, Headphones, Zap } from "lucide-react";
import { SECTION_IDS } from "@/lib/constants";

const features = [
  {
    icon: FileText,
    iconClassName: "text-slate-500 light:text-slate-400",
    title: "Upload Notes",
    description: "Support for PDF, TXT, PNG, and JPG files from any course or textbook.",
  },
  {
    emoji: "🤖",
    title: "AI-Powered Processing",
    description: "Transform raw notes into a natural, conversational study script.",
  },
  {
    icon: Headphones,
    iconClassName: "text-slate-300 light:text-slate-700",
    title: "Listen Anywhere",
    description: "Podcast-style audio you can listen to on any device, anytime.",
  },
  {
    icon: Zap,
    iconClassName: "text-amber-500",
    title: "Automated Pipeline",
    description: "From upload to audio in minutes, with zero manual effort.",
  },
];

export function FeaturesSection() {
  return (
    <section id={SECTION_IDS.features} className="scroll-mt-16 bg-slate-950 light:bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white light:text-slate-900 sm:text-4xl">
            Everything you need to study smarter
          </h2>
          <p className="mt-3 text-lg text-slate-400 light:text-slate-500">
            One platform to transform your study notes into audio learning.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-800 light:border-slate-200 p-6 transition-colors hover:bg-slate-900 light:hover:bg-slate-50"
            >
              {feature.icon ? (
                <feature.icon className={`mb-4 h-6 w-6 ${feature.iconClassName}`} />
              ) : (
                <span className="mb-4 block text-2xl leading-none">{feature.emoji}</span>
              )}
              <h3 className="text-base font-semibold text-white light:text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400 light:text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
