"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, Sparkles, Globe, Paperclip, Mic, ThumbsUp, ThumbsDown, Copy, RefreshCw, ExternalLink, ArrowRight, Clock, ChevronRight, Languages, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AIMessageRenderer from "@/components/ui/AIMessageRenderer";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { classNames } from "@/lib/utils";

const popularQueries = [
  "How do I file a patent?", "What is traditional knowledge?", "Explain IP classification",
  "Document requirements for filing", "How long does protection last?", "What are geographical indications?",
];

interface Message {
  role: "user" | "ai";
  content: string;
  sources?: { title: string; url: string }[];
  timestamp: Date;
  translation?: {
    text: string;
    targetLang: string;
    showing: boolean;
    loading: boolean;
  };
}

function NewQueryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(initialQuery.length);
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const userMsg: Message = { role: "user", content: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setCharCount(0);
    setLoading(true);
    try {
      const res = await api.post("/api/ai/query", { question: query, language });
      const data = res.data;
      setMessages((prev) => [...prev, {
        role: "ai",
        content: data.answer,
        sources: data.sources?.map((s: any) => ({ title: s.title, url: "#" })) || [],
        timestamp: new Date(),
      }]);
    } catch (err: any) {
      toast("error", err?.response?.data?.detail || "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (messageIndex: number, targetLang: string) => {
    const msg = messages[messageIndex];
    if (!msg || msg.translation?.loading) return;

    // Toggle off if already showing same language
    if (msg.translation?.showing && msg.translation?.targetLang === targetLang) {
      setMessages((prev) => prev.map((m, i) =>
        i === messageIndex ? { ...m, translation: { ...m.translation!, showing: false } } : m
      ));
      return;
    }

    // Start loading
    setMessages((prev) => prev.map((m, i) =>
      i === messageIndex ? {
        ...m,
        translation: {
          text: "",
          targetLang,
          showing: true,
          loading: true,
        }
      } : m
    ));

    try {
      // Use MyMemory API directly from frontend (free, no API key)
      const langMap: Record<string, string> = {
        en: "en", hi: "hi", sa: "sa", bn: "bn", ta: "ta", te: "te", mr: "mr", gu: "gu", kn: "kn", ml: "ml"
      };
      const sourceLang = "en"; // AI responses are in English
      const targetLangCode = langMap[targetLang] || targetLang;
      const langPair = `${sourceLang}|${targetLangCode}`;
      
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(msg.content)}&langpair=${langPair}`);
      const data = await res.json();
      
      if (data.responseData?.translatedText) {
        setMessages((prev) => prev.map((m, i) =>
          i === messageIndex ? {
            ...m,
            translation: {
              text: data.responseData.translatedText,
              targetLang,
              showing: true,
              loading: false,
            }
          } : m
        ));
      } else {
        throw new Error("Translation failed");
      }
    } catch (err: any) {
      toast("error", err?.message || "Translation failed");
      setMessages((prev) => prev.map((m, i) =>
        i === messageIndex ? { ...m, translation: undefined } : m
      ));
    }
  };

  const toggleTranslation = (messageIndex: number) => {
    setMessages((prev) => prev.map((m, i) =>
      i === messageIndex && m.translation
        ? { ...m, translation: { ...m.translation, showing: !m.translation.showing } }
        : m
    ));
  };

  return (
    <div className="h-full overflow-y-auto p-5 lg:p-8 max-w-4xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[26px] lg:text-[30px] font-bold mb-1" style={{ color: "var(--color-text)" }}>Ask a New Question</h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--color-text-secondary)" }}>Get accurate, source-supported answers about intellectual property protection</p>
      </motion.div>

      {/* Input area */}
      <Card padding="md" className="mb-6">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCharCount(e.target.value.length); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Describe your question in detail..."
            rows={4}
            className="w-full px-4 py-3 rounded-[12px] border text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-[10px]" style={{ color: "var(--color-muted-light)" }}>{charCount}/5000</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-[10px] hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-muted)" }}><Paperclip className="w-4 h-4" /></button>
            <button className="p-2 rounded-[10px] hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-muted)" }}><Mic className="w-4 h-4" /></button>
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] border text-[11px] font-medium hover:bg-[var(--color-sage)] transition-colors"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || "English"}</span>
                <ChevronDown className={classNames("w-3 h-3 transition-transform", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[var(--color-card)] rounded-[10px] shadow-lg border z-50 min-w-[140px] animate-fade-in" style={{ borderColor: "var(--color-border)" }}>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code as any); setLangOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[12px] hover:bg-[var(--color-sage)] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]"
                      style={{ color: l.code === language ? "var(--color-primary)" : "var(--color-text)" }}
                    >
                      <span className="font-medium">{l.nativeName || l.name}</span>
                      <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button onClick={handleSend} disabled={!query.trim() || loading} loading={loading}>
            <Send className="w-4 h-4" /> Ask AI
          </Button>
        </div>
      </Card>

      {/* Messages */}
      <div className="space-y-4 mb-6">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] px-4 py-3 rounded-[14px] rounded-br-sm text-[13px]" style={{ backgroundColor: "var(--color-primary)", color: "white" }}>
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-primary)", color: "white" }}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <Card padding="md">
                    <AIMessageRenderer content={msg.content} className="mb-3" />
                    {msg.sources && (
                      <div className="border-t pt-3 mt-3" style={{ borderColor: "var(--color-border-light)" }}>
                        <p className="text-[11px] font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>Sources & References</p>
                        <div className="space-y-1.5">
                          {msg.sources.map((s, j) => (
                            <a key={j} href={s.url} className="flex items-center gap-1.5 text-[11px] hover:underline" style={{ color: "var(--color-primary)" }}>
                              <ExternalLink className="w-3 h-3" /> {s.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {msg.translation && (
                      <div className="border-t pt-3 mt-3" style={{ borderColor: "var(--color-border-light)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                            Translated to {SUPPORTED_LANGUAGES.find(l => l.code === msg.translation?.targetLang)?.nativeName || msg.translation?.targetLang}
                          </span>
                          <button
                            onClick={() => toggleTranslation(i)}
                            className="text-[10px] hover:underline"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {msg.translation.showing ? "Hide" : "Show"}
                          </button>
                        </div>
                        {msg.translation.showing && (
                          <div className="text-[13px] leading-relaxed" style={{ color: "var(--color-text)" }}>
                            {msg.translation.loading ? (
                              <div className="flex items-center gap-2">
                                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                                <span className="text-[12px]" style={{ color: "var(--color-muted)" }}>Translating...</span>
                              </div>
                            ) : (
                              <AIMessageRenderer content={msg.translation.text} />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                      <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-text-secondary)" }}><ThumbsUp className="w-3 h-3" /> Helpful</button>
                      <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-text-secondary)" }}><ThumbsDown className="w-3 h-3" /> Not Helpful</button>
                      <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-text-secondary)" }}><Copy className="w-3 h-3" /> Copy</button>
                      <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-text-secondary)" }}><RefreshCw className="w-3 h-3" /> Regenerate</button>
                      <div className="flex-1" />
                      <button
                        onClick={() => handleTranslate(i, "hi")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium hover:bg-[var(--color-sage)] transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <Languages className="w-3 h-3" /> Hindi
                      </button>
                      <button
                        onClick={() => handleTranslate(i, "bn")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium hover:bg-[var(--color-sage)] transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <Languages className="w-3 h-3" /> Bengali
                      </button>
                      <button
                        onClick={() => handleTranslate(i, "ta")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium hover:bg-[var(--color-sage)] transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <Languages className="w-3 h-3" /> Tamil
                      </button>
                      <button
                        onClick={() => handleTranslate(i, "te")}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium hover:bg-[var(--color-sage)] transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <Languages className="w-3 h-3" /> Telugu
                      </button>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-primary)", color: "white" }}>
              <Sparkles className="w-4 h-4" />
            </div>
            <Card padding="md" className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
              <p className="text-[12px]" style={{ color: "var(--color-muted)" }}>Analyzing your question...</p>
            </Card>
          </div>
        )}
      </div>

      {/* Popular queries */}
      {messages.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-[13px] font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>Popular Queries</h3>
          <div className="flex flex-wrap gap-2">
            {popularQueries.map((q, i) => (
              <button key={i} onClick={() => { setQuery(q); setCharCount(q.length); }}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all hover:bg-[var(--color-sage)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function NewQueryPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>}>
      <NewQueryContent />
    </Suspense>
  );
}