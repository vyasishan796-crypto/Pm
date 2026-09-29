"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, Trash2, ShieldCheck, HelpCircle, Mic, AlertCircle, ChevronRight } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useLanguage } from "@/context/LanguageContext";
import QueryInput from "@/components/ip-sakti/QueryInput";
import ExampleQueryCard from "@/components/ip-sakti/ExampleQueryCard";
import Spinner from "@/components/ui/Spinner";
import AIMessageRenderer from "@/components/ui/AIMessageRenderer";
import { classNames } from "@/lib/utils";
import { exampleQueries } from "@/lib/mockData";

function ConfidenceIndicator({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color = confidence >= 0.7 ? "var(--color-secondary)" : confidence >= 0.4 ? "var(--color-gold)" : "var(--color-muted-light)";
  return (
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-4 h-4" style={{ color }} />
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-sage)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-medium" style={{ color }}>{pct}%</span>
    </div>
  );
}

function SourceCard({ src, index }: { src: any; index: number }) {
  return (
    <div className="flex items-start gap-3 text-[12px] p-3 rounded-lg" style={{ backgroundColor: "var(--color-sage)" }}>
      <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white shrink-0" style={{ backgroundColor: "var(--color-secondary)" }}>{index + 1}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <ShieldCheck className="w-3 h-3 shrink-0" style={{ color: "var(--color-secondary)" }} />
          <span className="font-medium" style={{ color: "var(--color-text)" }}>Verified Source</span>
        </div>
        <p className="font-medium" style={{ color: "var(--color-text)" }}>{src.title}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          <span style={{ color: "var(--color-muted-light)" }}>Category: {src.category}</span>
          <span style={{ color: "var(--color-muted-light)" }}>Language: English</span>
        </div>
        {src.snippet && <p style={{ color: "var(--color-muted)" }} className="mt-1">{src.snippet}</p>}
      </div>
      <button className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium shrink-0 hover:bg-white transition-colors" style={{ color: "var(--color-secondary)" }}>
        <ExternalLink className="w-3 h-3" /> Open
      </button>
    </div>
  );
}

export default function IPSaktiPage() {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const { language } = useLanguage();
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const handleSend = (query: string) => {
    setPendingQuery(query);
    sendMessage(query, language);
  };

  return (
    <div className="h-full flex flex-col p-6 lg:p-8 max-w-4xl mx-auto w-full">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-[28px] lg:text-[34px] font-semibold leading-tight mb-2" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-primary-dark)" }}>
          IP-SAKTI Sahayak
        </h1>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
          Ask questions about Ayurveda IP, regulations and Traditional Knowledge.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg p-3 mb-6 flex items-start gap-2" style={{ backgroundColor: "var(--color-sage)", border: "1px solid var(--color-border)" }}>
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--color-gold)" }} />
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
          Informational guidance only — not professional legal advice.
        </p>
      </div>

      {/* Query Box */}
      <div className="mb-8">
        <QueryInput onSubmit={handleSend} isLoading={isLoading} />
      </div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="mb-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={classNames("flex animate-fade-in", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={classNames("max-w-[85%] rounded-xl px-5 py-4", msg.role === "user" ? "text-white" : "border")}
                style={msg.role === "user"
                  ? { backgroundColor: "var(--color-primary)" }
                  : { backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }
                }
              >
                {msg.role === "user" ? (
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: "white" }}>
                    {msg.content}
                  </p>
                ) : (
                  <AIMessageRenderer content={msg.content} />
                )}

                {/* Confidence */}
                {msg.role === "assistant" && msg.confidence !== undefined && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <ConfidenceIndicator confidence={msg.confidence} />
                  </div>
                )}

                {/* Sources as citation cards */}
                {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 space-y-2" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <p className="text-[12px] font-medium flex items-center gap-1 mb-2" style={{ color: "var(--color-muted)" }}>
                      <BookOpen className="w-3 h-3" /> Sources
                    </p>
                    {msg.sources.map((src, i) => (
                      <SourceCard key={i} src={src} index={i} />
                    ))}
                  </div>
                )}

                {/* Related questions */}
                {msg.role === "assistant" && msg.relatedQuestions && msg.relatedQuestions.length > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <p className="text-[12px] font-medium mb-2 flex items-center gap-1" style={{ color: "var(--color-muted)" }}>
                      <HelpCircle className="w-3 h-3" /> Related Questions
                    </p>
                    <div className="space-y-1.5">
                      {msg.relatedQuestions.map((q, i) => (
                        <button key={i} onClick={() => handleSend(q)}
                          className="flex items-center gap-1.5 w-full text-left text-[12px] p-2 rounded-lg transition-colors hover:bg-[var(--color-sage)]"
                          style={{ color: "var(--color-secondary)" }}>
                          <ChevronRight className="w-3 h-3" /> {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="rounded-xl px-5 py-4 border" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                  <span className="text-[13px]" style={{ color: "var(--color-muted-light)" }}>Searching knowledge base...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Example Queries */}
      {messages.length === 0 && (
        <div>
          <h2 className="text-[17px] font-semibold mb-4" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-text)" }}>Example Queries</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {exampleQueries.map((q, i) => (
              <ExampleQueryCard key={i} query={q} onClick={() => handleSend(q)} />
            ))}
          </div>
        </div>
      )}

      {/* Clear button */}
      {messages.length > 0 && (
        <div className="mt-auto pt-4">
          <button onClick={clearMessages} className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-sage)]" style={{ color: "var(--color-muted-light)" }}>
            <Trash2 className="w-3.5 h-3.5" /> Clear conversation
          </button>
        </div>
      )}
    </div>
  );
}
