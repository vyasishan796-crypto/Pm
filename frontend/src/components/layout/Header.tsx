"use client";
import { Bell, Globe, ChevronDown, Menu, Sun, Moon, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguage } from "@/types";
import Avatar from "@/components/ui/Avatar";
import { classNames } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const languages = [
  { code: "en", label: "English", flag: "EN" },
  { code: "hi", label: "Hindi", flag: "HI" },
  { code: "sa", label: "Sanskrit", flag: "SA" },
  { code: "bn", label: "Bengali", flag: "BN" },
  { code: "ta", label: "Tamil", flag: "TA" },
];

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);
  const { language: lang, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const selected = languages.find((l) => l.code === lang);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setLangOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-5 lg:px-6 border-b shrink-0" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border-light)" }}>
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-[10px] hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-text)" }}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-[10px]" style={{ backgroundColor: "var(--color-sage-light)" }}>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[11px] font-medium" style={{ color: "var(--color-text-secondary)" }}>Prakriti AI</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div ref={ref} className="relative">
          <button onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-medium transition-colors hover:bg-[var(--color-sage)]"
            style={{ color: "var(--color-text-secondary)" }}>
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{selected?.flag}</span>
            <ChevronDown className={classNames("w-3 h-3 transition-transform", langOpen && "rotate-180")} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[var(--color-card)] rounded-[10px] shadow-lg border z-50 min-w-[140px] animate-fade-in" style={{ borderColor: "var(--color-border)" }}>
              {languages.map((l) => (
                <button key={l.code} onClick={() => { setLanguage(l.code as SupportedLanguage); setLangOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-[12px] hover:bg-[var(--color-sage)] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]"
                  style={{ color: l.code === lang ? "var(--color-primary)" : "var(--color-text)" }}>
                  <span className="font-medium">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-[10px] hover:bg-[var(--color-sage)] transition-colors"
          style={{ color: "var(--color-text-secondary)" }}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative p-2 rounded-[10px] hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-text-secondary)" }}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <button onClick={handleLogout} title="Logout"
          className="p-2 rounded-[10px] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" style={{ color: "var(--color-text-secondary)" }}>
          <LogOut className="w-4 h-4" />
        </button>

        <div className="ml-1">
          <Avatar name={user?.name || "User"} size="md" />
        </div>
      </div>
    </header>
  );
}
