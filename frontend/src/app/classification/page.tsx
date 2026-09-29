"use client";

import { useState } from "react";
import { ShieldCheck, FileText, BookOpen, Layers, MapPin, Leaf, AlertCircle, Search } from "lucide-react";
import { ipCategories } from "@/lib/mockData";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck, FileText, BookOpen, Layers, MapPin, Leaf,
};

export default function IPClassificationPage() {
  const [query, setQuery] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!query.trim()) return;
    setAnalyzed(true);
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[28px] lg:text-[34px] font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-primary-dark)" }}>IP & Product Classification</h1>
        <p className="text-[15px] mt-1" style={{ color: "var(--color-muted)" }}>Understand which intellectual-property category may be relevant to your idea or product.</p>
      </div>

      {/* Input */}
      <div className="rounded-xl border p-6 mb-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
        <textarea value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your Ayurveda product, formulation, brand or innovation..."
          className="w-full resize-none text-[15px] leading-relaxed focus:outline-none bg-transparent" style={{ color: "var(--color-text)", minHeight: "100px" }} />
        <div className="flex justify-end mt-4">
          <button onClick={handleAnalyze} disabled={!query.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium text-white transition-all hover:translate-y-[-1px] disabled:opacity-40"
            style={{ backgroundColor: "var(--color-primary)" }}>
            <Search className="w-4 h-4" /> Analyze
          </button>
        </div>
      </div>

      {/* Results */}
      {analyzed && (
        <div className="animate-fade-in">
          <h2 className="text-[17px] font-semibold mb-4" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-text)" }}>Relevant IP Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {ipCategories.map((cat) => {
              const Icon = iconMap[cat.icon] || ShieldCheck;
              return (
                <div key={cat.id} className="rounded-xl border p-5 transition-all hover:shadow-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
                  <Icon className="w-7 h-7 mb-3" style={{ color: "var(--color-secondary)" }} />
                  <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--color-text)" }}>{cat.name}</h3>
                  <p className="text-[12px] mb-2" style={{ color: "var(--color-muted)" }}>{cat.description}</p>
                  <p className="text-[11px] italic" style={{ color: "var(--color-secondary)" }}>{cat.whyApply}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: "var(--color-sage)", border: "1px solid var(--color-border)" }}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--color-gold)" }} />
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
              This tool provides general informational guidance and does not replace professional legal advice.
            </p>
          </div>
        </div>
      )}

      {!analyzed && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ipCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || ShieldCheck;
            return (
              <div key={cat.id} className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)", opacity: 0.7 }}>
                <Icon className="w-7 h-7 mb-3" style={{ color: "var(--color-accent)" }} />
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--color-text)" }}>{cat.name}</h3>
                <p className="text-[12px]" style={{ color: "var(--color-muted-light)" }}>{cat.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
