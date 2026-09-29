"use client";
import { Search, X } from "lucide-react";
import { classNames } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search...", className }: SearchBarProps) {
  return (
    <div className={classNames("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-muted-light)" }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-10 rounded-[10px] border bg-white dark:bg-[var(--color-card)] text-[13px] placeholder:text-[var(--color-muted-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
      />
      {value && (
        <button onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[var(--color-sage)]" style={{ color: "var(--color-muted)" }}>
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
