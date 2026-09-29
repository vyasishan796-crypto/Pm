"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { classNames } from "@/lib/utils";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, languages, getLanguageName } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors hover:bg-[var(--color-sage)]"
        style={{ color: "var(--color-text)" }}
      >
        <Globe className="w-4 h-4" style={{ color: "var(--color-muted)" }} />
        <span>{getLanguageName(language)}</span>
        <ChevronDown className="w-3.5 h-3.5" style={{ color: "var(--color-muted-light)" }} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-1 z-50" style={{ borderColor: "var(--color-border)" }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
              className={classNames(
                "w-full text-left px-4 py-2.5 text-[13px] flex justify-between items-center transition-colors",
                language === lang.code ? "font-medium" : "hover:bg-[var(--color-sage)]"
              )}
              style={language === lang.code
                ? { backgroundColor: "var(--color-sage)", color: "var(--color-primary)" }
                : { color: "var(--color-text)" }
              }
            >
              <span>{lang.nativeName}</span>
              {language === lang.code && <span className="text-xs">&#10003;</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
