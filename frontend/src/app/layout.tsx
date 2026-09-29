import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prakriti — AI Knowledge Platform",
  description: "AI-powered intellectual property guidance and traditional knowledge protection platform.",
  keywords: ["IP", "patent", "traditional knowledge", "AI", "intellectual property"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full" style={{ fontFamily: "var(--font-sans)" }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
