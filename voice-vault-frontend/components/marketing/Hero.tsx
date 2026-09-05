"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTES, SECTION_IDS } from "@/lib/constants";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const HERO_IMAGE_ALT =
  "Illustration of a student uploading study notes (PDF, TXT, PNG, JPG) and listening to the AI-generated podcast-style audio";

function HeroCopy({ align }: { align: "center" | "left" }) {
  const { scrollToSection } = useSmoothScroll();
  const isLeft = align === "left";

  return (
    <div className={`flex flex-col ${isLeft ? "items-start text-left" : "items-center text-center"}`}>
      <h1
        className={`font-extrabold tracking-tight text-slate-900 ${
          isLeft ? "text-5xl xl:text-6xl 2xl:text-7xl" : "text-4xl sm:text-5xl"
        }`}
      >
        Turn Your Study Notes
        <br />
        <span className="text-indigo-600">Into Audio</span>
      </h1>

      <p className={`mt-6 text-lg text-slate-600 ${isLeft ? "max-w-sm" : "max-w-xl"}`}>
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
          className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50"
        >
          See How It Works
        </button>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-white">
      {/* Mobile/tablet: text and image stack in normal flow so nothing overlaps */}
      <div className="flex flex-col items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:hidden">
        <HeroCopy align="center" />
        <Image
          src="/voice-vault-hero.png"
          alt={HERO_IMAGE_ALT}
          width={1671}
          height={941}
          priority
          sizes="100vw"
          className="h-auto w-full max-w-2xl"
        />
      </div>

      {/* Desktop: one full-width image, headline overlaid on its empty left area */}
      <div className="relative hidden lg:block">
        <Image
          src="/voice-vault-hero.png"
          alt={HERO_IMAGE_ALT}
          width={1671}
          height={941}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[90rem] px-8 xl:px-12">
            <div className="max-w-sm xl:max-w-md 2xl:max-w-lg">
              <HeroCopy align="left" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
