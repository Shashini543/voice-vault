import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-950 light:bg-white">{children}</main>
    </>
  );
}
