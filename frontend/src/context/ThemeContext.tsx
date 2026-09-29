"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
interface ThemeContextType { theme: Theme; setTheme: (t: Theme) => void; resolvedTheme: "light" | "dark"; }

const ThemeContext = createContext<ThemeContextType>({ theme: "light", setTheme: () => {}, resolvedTheme: "light" });
export function useTheme() { return useContext(ThemeContext); }

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [resolvedTheme, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("nexora-theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const resolve = () => {
      const resolved = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
      setResolved(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
    };
    resolve();
    mq.addEventListener("change", resolve);
    localStorage.setItem("nexora-theme", theme);
    return () => mq.removeEventListener("change", resolve);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>;
}
