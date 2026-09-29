"use client";
import { useState, useEffect } from "react";
import { Clock, Trash2, Eye, Search, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  category: string;
  status: string;
  response: string;
  sources: string;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "Last 7 Days" },
  { id: "month", label: "Last 30 Days" },
];

function categorizeQuestion(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("patent")) return "Patents";
  if (lower.includes("trademark")) return "Trademark";
  if (lower.includes("copyright")) return "Copyright";
  if (lower.includes("geographical") || lower.includes("gi")) return "GI";
  if (lower.includes("traditional") || lower.includes("tkdl")) return "TKDL";
  if (lower.includes("classification")) return "Classification";
  return "General";
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [allData, setAllData] = useState<HistoryItem[]>([]);
  const [filtered, setFiltered] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    handleFilter(activeTab, search);
  }, [allData, activeTab, search]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/ai/history");
      const items = res.data.queries.map((q: any) => ({
        id: String(q.id),
        title: q.question,
        date: q.created_at,
        category: categorizeQuestion(q.question),
        status: "answered",
        response: q.response || "",
        sources: q.sources || "",
      }));
      setAllData(items);
    } catch {
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (tab: string, searchText: string) => {
    setActiveTab(tab);
    let items = allData;
    const now = new Date();
    if (tab === "today") items = items.filter((i) => new Date(i.date).toDateString() === now.toDateString());
    else if (tab === "week") items = items.filter((i) => (now.getTime() - new Date(i.date).getTime()) < 7 * 86400000);
    else if (tab === "month") items = items.filter((i) => (now.getTime() - new Date(i.date).getTime()) < 30 * 86400000);
    if (searchText) items = items.filter((i) => i.title.toLowerCase().includes(searchText.toLowerCase()));
    setFiltered(items);
  };

  return (
    <div className="h-full overflow-y-auto p-5 lg:p-8 max-w-5xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[26px] lg:text-[30px] font-bold mb-1" style={{ color: "var(--color-text)" }}>Query History</h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--color-text-secondary)" }}>Past queries and responses</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={(v) => { setSearch(v); handleFilter(activeTab, v); }} placeholder="Search history..." className="flex-1" />
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(tab) => handleFilter(tab, search)} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border p-4 animate-pulse" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
              <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: "var(--color-sage)" }} />
              <div className="h-3 rounded w-1/2" style={{ backgroundColor: "var(--color-sage)" }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Clock className="w-8 h-8" />} title="No queries found" description="Your query history will appear here after you ask questions." />
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
              <Card hover padding="md" className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-primary)" }}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>{item.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--color-muted)" }}>
                      <Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <Badge variant="default" size="sm">{item.category}</Badge>
                    <Badge variant="success" size="sm">Answered</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-2 rounded-[10px] hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-primary)" }}><Eye className="w-4 h-4" /></button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
