"use client";

import { useState, useRef } from "react";
import { Send, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export default function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState("");
  const { language, setLanguage } = useLanguage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!query.trim() || isLoading) return;
    onSubmit(query.trim());
    setQuery("");
  };

  return (
    <div
      className="rounded-xl transition-all duration-200"
      style={{
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-card)",
        minHeight: "170px",
      }}
    >
      <textarea
        ref={textareaRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Ask your question in English, Hindi or any other language..."
        className="w-full px-6 pt-6 pb-4 bg-transparent resize-none text-[15px] leading-relaxed focus:outline-none"
        style={{ color: "var(--color-text)", minHeight: "110px" }}
        disabled={isLoading}
      />

      <div className="flex items-center justify-between px-6 pb-5">
        {/* Language selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--color-sage)" }}>
          <Globe className="w-4 h-4" style={{ color: "var(--color-muted)" }} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="text-[13px] font-medium bg-transparent border-none focus:outline-none cursor-pointer"
            style={{ color: "var(--color-text)" }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
            ))}
          </select>
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium text-white transition-all duration-200 disabled:opacity-40 hover:translate-y-[-1px] hover:shadow-md"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
}
