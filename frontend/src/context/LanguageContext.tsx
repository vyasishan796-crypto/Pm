"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupportedLanguage, LanguageOption } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  getLanguageName: (code: SupportedLanguage) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const saved = localStorage.getItem("prakriti_language") as SupportedLanguage;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("prakriti_language", lang);
  };

  const getLanguageName = (code: SupportedLanguage) => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.nativeName || code;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getLanguageName, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
