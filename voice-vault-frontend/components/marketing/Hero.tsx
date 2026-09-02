"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ROUTES, SECTION_IDS } from "@/lib/constants";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function Hero() {
  const { scrollToSection } = useSmoothScroll();

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
      <Badge tone="indigo" className="mb-6">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 light:bg-indigo-600" />
        AI-Powered Study Platform
      </Badge>

      <h1 className="text-4xl font-extrabold tracking-tight text-white light:text-slate-900 sm:text-5xl lg:text-6xl">
        Turn Your Study Notes
        <br />
        <span className="text-indigo-400 light:text-indigo-600">Into Audio</span>
      </h1>

      <p className="mt-6 max-w-xl text-lg text-slate-400 light:text-slate-500">
        Transform your notes into engaging, podcast-style audio and learn wherever you go.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href={ROUTES.register}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 text-base font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Get Started — It&apos;s Free
        </Link>
        <button
          type="button"
          onClick={() => scrollToSection(SECTION_IDS.howItWorks)}
          className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-700 light:border-slate-300 bg-slate-900 light:bg-white px-6 text-base font-semibold text-white light:text-slate-900 transition-colors hover:bg-slate-800 light:hover:bg-slate-50"
        >
          See How It Works
        </button>
      </div>
    </section>
  );
}
