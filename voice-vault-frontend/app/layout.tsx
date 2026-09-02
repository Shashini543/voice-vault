import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeRoot } from "@/components/layout/ThemeRoot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voice Vault",
  description: "Turn your study notes into podcast-style audio you can learn from anywhere.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeRoot>{children}</ThemeRoot>
      </body>
    </html>
  );
}
