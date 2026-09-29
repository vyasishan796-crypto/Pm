"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, ArrowRight, Sparkles, Brain, BookOpen, ShieldCheck, Globe, FileText, Leaf, MessageSquare, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FeatureCard from "@/components/ui/FeatureCard";
import { BotanicalBranch, LeafIcon } from "@/components/ui/Botanical";
import { useAuth } from "@/context/AuthContext";

const exampleQueries = [
  { title: "How can I get started?", desc: "Learn the basics of IP protection", icon: "🚀" },
  { title: "What documents do I need?", desc: "Required documentation for filing", icon: "📄" },
  { title: "Explain patent classifications", desc: "Understanding IPC codes", icon: "🏷️" },
  { title: "What are the latest guidelines?", desc: "Recent policy updates", icon: "📋" },
];

const features = [
  { icon: <Brain className="w-5 h-5" />, title: "AI Assistant", description: "Get intelligent answers powered by advanced language models trained on IP documentation." },
  { icon: <BookOpen className="w-5 h-5" />, title: "Knowledge Base", description: "Access verified documents, research papers, and government resources." },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Smart Classification", description: "Automatic IP type detection and classification using AI." },
  { icon: <FileText className="w-5 h-5" />, title: "Source-Cited Answers", description: "Every response includes references to official sources and documents." },
  { icon: <Globe className="w-5 h-5" />, title: "Multilingual Support", description: "Ask questions in English, Hindi, Sanskrit, Bengali, Tamil, and more." },
  { icon: <Sparkles className="w-5 h-5" />, title: "Personalized Guidance", description: "Tailored recommendations based on your specific needs and history." },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const handleSend = () => {
    if (!query.trim()) return;
    router.push(`/new-query?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card padding="lg" className="relative overflow-hidden mb-8" style={{ backgroundColor: "var(--color-card)" }}>
            <BotanicalBranch className="absolute -right-4 -top-6 w-32 h-40 opacity-30" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">AI Powered</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-primary)" }}>Trusted Platform</span>
              </div>
              <h1 className="text-[28px] lg:text-[34px] font-bold leading-tight mb-2" style={{ color: "var(--color-text)" }}>
                Welcome back, <span style={{ color: "var(--color-primary)" }}>{user?.name || "User"}</span>
              </h1>
              <p className="text-[14px] max-w-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Ask questions about intellectual property protection, traditional knowledge documentation, and get AI-powered guidance with verified sources.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* AI Query Box */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card padding="md" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)", color: "white" }}>
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--color-text)" }}>Ask Your Question</h3>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask anything about IP protection, patents, traditional knowledge..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-[12px] border text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <button className="h-10 px-3 rounded-[10px] border text-[11px] font-medium flex items-center gap-1 transition-colors hover:bg-[var(--color-sage)]"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                  <Globe className="w-3.5 h-3.5" /> EN
                </button>
                <Button onClick={handleSend} disabled={!query.trim()} size="md">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Example Queries */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h3 className="text-[14px] font-semibold mb-3" style={{ color: "var(--color-text)" }}>Example Queries</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {exampleQueries.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}>
                <Card hover padding="md" onClick={() => router.push(`/new-query?q=${encodeURIComponent(q.title)}`)}>
                  <span className="text-[20px] mb-2 block">{q.icon}</span>
                  <h4 className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--color-text)" }}>{q.title}</h4>
                  <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>{q.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <h3 className="text-[14px] font-semibold mb-3" style={{ color: "var(--color-text)" }}>Platform Features</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}>
                <FeatureCard icon={f.icon} title={f.title} description={f.description} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
