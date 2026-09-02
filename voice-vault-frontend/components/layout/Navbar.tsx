"use client";

import Link from "next/link";
import { Headphones } from "lucide-react";
import { ROUTES, SECTION_IDS } from "@/lib/constants";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function Navbar() {
  const { scrollToSection } = useSmoothScroll();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 light:border-slate-200 bg-slate-950 light:bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Headphones className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold text-white light:text-slate-900">Voice Vault</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href={`${ROUTES.home}#${SECTION_IDS.features}`}
            onClick={(event) => scrollToSection(SECTION_IDS.features, event)}
            className="text-sm font-medium text-slate-400 light:text-slate-600 transition-colors hover:text-white light:hover:text-slate-900"
          >
            Features
          </a>
          <a
            href={`${ROUTES.home}#${SECTION_IDS.howItWorks}`}
            onClick={(event) => scrollToSection(SECTION_IDS.howItWorks, event)}
            className="text-sm font-medium text-slate-400 light:text-slate-600 transition-colors hover:text-white light:hover:text-slate-900"
          >
            How it Works
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.login}
            className="text-sm font-medium text-slate-400 light:text-slate-600 transition-colors hover:text-white light:hover:text-slate-900"
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.register}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
