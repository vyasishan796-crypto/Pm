"use client";

import { ArrowRight } from "lucide-react";

interface ExampleQueryCardProps {
  query: string;
  onClick: () => void;
}

export default function ExampleQueryCard({ query, onClick }: ExampleQueryCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-left p-5 rounded-xl transition-all duration-200 group hover:translate-y-[-1px] hover:shadow-sm"
      style={{
        backgroundColor: "var(--color-sage)",
        border: "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-text)" }}>
          {query}
        </p>
        <ArrowRight
          className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
          style={{ color: "var(--color-muted)" }}
        />
      </div>
    </button>
  );
}
