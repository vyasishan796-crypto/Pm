"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { classNames } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Dropdown({ options, value, onChange, placeholder = "Select...", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={classNames("relative", className)}>
      <button onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between h-10 px-4 rounded-[10px] border bg-white dark:bg-[var(--color-card)] text-[13px] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        style={{ borderColor: "var(--color-border)", color: selected ? "var(--color-text)" : "var(--color-muted-light)" }}>
        <span className="flex items-center gap-2 truncate">{selected?.icon}{selected?.label || placeholder}</span>
        <ChevronDown className={classNames("w-4 h-4 transition-transform", open && "rotate-180")} style={{ color: "var(--color-muted)" }} />
      </button>
      {open && (
        <div role="listbox" className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[var(--color-card)] rounded-[10px] shadow-lg border z-20 max-h-48 overflow-y-auto animate-fade-in"
          style={{ borderColor: "var(--color-border)" }}>
          {options.map((opt) => (
            <button key={opt.value} role="option" aria-selected={opt.value === value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-[13px] text-left hover:bg-[var(--color-sage)] transition-colors"
              style={{ color: "var(--color-text)" }}>
              {opt.icon}
              <span className="flex-1">{opt.label}</span>
              {opt.value === value && <Check className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
