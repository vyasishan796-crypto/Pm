"use client";
import { useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import ThemeProvider from "@/context/ThemeContext";
import ToastProvider from "@/context/ToastContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

const noLayoutRoutes = ["/auth/login", "/auth/register"];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isNoLayout = noLayoutRoutes.some((r) => pathname.startsWith(r));

  if (isNoLayout) {
    return <ThemeProvider><LanguageProvider><ToastProvider><AuthProvider>{children}</AuthProvider></ToastProvider></LanguageProvider></ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
              <Sidebar />
              <div className="flex-1 flex flex-col lg:ml-[240px]">
                <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                  {children}
                </main>
              </div>
              <MobileNav />
            </div>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
