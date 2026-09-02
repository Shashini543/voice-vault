"use client";

import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export function useSmoothScroll() {
  const pathname = usePathname();
  const router = useRouter();

  function scrollToSection(sectionId: string, event?: React.MouseEvent) {
    if (pathname === ROUTES.home) {
      event?.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`${ROUTES.home}#${sectionId}`);
    }
  }

  return { scrollToSection };
}
