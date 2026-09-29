"use client";

import { MessageSquare, FileSearch, ShieldCheck, FileCheck, Globe } from "lucide-react";

const features = [
  { icon: MessageSquare, title: "Multilingual AI Assistant", description: "Ask in your preferred language." },
  { icon: FileSearch, title: "RAG-Based Knowledge System", description: "Retrieves information from verified documents." },
  { icon: ShieldCheck, title: "IP & Product Classification", description: "Guidance on patents, trademarks, copyrights and more." },
  { icon: FileCheck, title: "Source-Cited Answers", description: "Get reliable answers with exact sources and references." },
  { icon: Globe, title: "India & International Support", description: "Covers Indian and global regulations." },
];

function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 4C12 12 8 22 12 36C14 28 17 20 20 16C23 20 26 28 28 36C32 22 28 12 20 4Z" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M20 16V34" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SmallLeaf({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M12 2C6 8 2 16 5 28C7 20 10 14 12 10C14 14 17 20 19 28C22 16 18 8 12 2Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 10V26" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

export default function RightPanel() {
  return (
    <aside className="hidden xl:flex flex-col w-[380px] border-l border-[var(--color-border)] bg-white shrink-0 overflow-y-auto">
      <div className="p-7 space-y-7">
        {/* About Card */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--color-sage)" }}>
          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-0.5">
              <LeafIcon className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold mb-2" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-primary-dark)" }}>About Nexora</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
                Nexora is a multilingual, RAG-based AI assistant that provides trusted Ayurveda IP and regulatory guidance from verified legal and regulatory sources.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h3 className="text-[17px] font-semibold mb-5" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-primary-dark)" }}>Key Features</h3>
          <div className="space-y-5">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)" }}>
                  <feature.icon className="w-5 h-5" style={{ color: "var(--color-secondary)" }} strokeWidth={1.8} />
                </div>
                <div className="pt-1.5">
                  <p className="text-[14px] font-semibold mb-0.5" style={{ color: "var(--color-text)" }}>{feature.title}</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-muted)" }}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: "var(--color-border)" }} />

        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 py-2">
          <SmallLeaf className="w-5 h-7" style={{ color: "var(--color-accent)" }} />
          <p className="text-[12px] italic tracking-wide" style={{ color: "var(--color-muted-light)", fontFamily: "var(--font-playfair), serif" }}>
            Traditional Knowledge for a Smarter Future
          </p>
          <SmallLeaf className="w-5 h-7 -scale-x-100" style={{ color: "var(--color-accent)" }} />
        </div>
      </div>
    </aside>
  );
}
