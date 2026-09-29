"use client";
import { useState, useMemo } from "react";
import { BookOpen, Search, ChevronLeft, ChevronRight, Filter, ExternalLink, Download, Copy, Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { curatedPapers, CuratedPaper, CATEGORIES, FIELD_OF_STUDY, YEAR_RANGES, searchCuratedPapers, filterPapers } from "@/lib/researchData";
import { searchPapersLive, getGoogleScholarUrl, formatCitation, formatAuthors, generateCiteText, QUICK_LINKS } from "@/lib/researchApi";
import { useToast } from "@/context/ToastContext";

const PER_PAGE = 12;

export default function ResourcesPage() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"browse" | "search">("browse");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [fieldOfStudy, setFieldOfStudy] = useState("All");
  const [yearRange, setYearRange] = useState("all");
  const [sort, setSort] = useState("citations");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<CuratedPaper[]>([]);
  const [livePapers, setLivePapers] = useState<CuratedPaper[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  const filteredPapers = useMemo(() => {
    if (mode === "search" && searchDone) return searchResults;
    return filterPapers(curatedPapers, { category, fieldOfStudy, yearRange, sort });
  }, [mode, searchDone, searchResults, category, fieldOfStudy, yearRange, sort]);

  const totalPages = Math.ceil(filteredPapers.length / PER_PAGE);
  const paginatedPapers = filteredPapers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearchDone(true);
    const results = searchCuratedPapers(query, curatedPapers);
    results.sort((a, b) => b.citations - a.citations);
    setSearchResults(results);
    setPage(1);

    setLiveLoading(true);
    try {
      const live = await searchPapersLive(query, { limit: 10 });
      if (live.data.length > 0) {
        const mapped: CuratedPaper[] = live.data.map((p) => ({
          id: `live-${p.paperId}`,
          title: p.title,
          year: p.year || 2024,
          authors: p.authors?.map((a) => a.name) || [],
          abstract: p.abstract || "",
          citations: p.citationCount || 0,
          venue: p.venue || "Semantic Scholar",
          category: "ai-ip",
          fieldOfStudy: "Computer Science",
          scholarUrl: p.url || getGoogleScholarUrl(p.title),
          pdfUrl: p.openAccessPdf?.url,
        }));
        setLivePapers(mapped);
        const merged = [...results, ...mapped.filter((lp) => !results.some((r) => r.title.toLowerCase() === lp.title.toLowerCase()))];
        merged.sort((a, b) => b.citations - a.citations);
        setSearchResults(merged);
      }
    } catch { /* silent */ }
    setLiveLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    setMode("search");
    const results = searchCuratedPapers(topic, curatedPapers);
    results.sort((a, b) => b.citations - a.citations);
    setSearchResults(results);
    setSearchDone(true);
    setPage(1);
  };

  const handleClearSearch = () => {
    setQuery("");
    setMode("browse");
    setSearchDone(false);
    setSearchResults([]);
    setLivePapers([]);
    setPage(1);
  };

  const handleCopyCite = async (paper: CuratedPaper) => {
    const text = generateCiteText(paper.title, paper.authors, paper.year, paper.venue);
    await navigator.clipboard.writeText(text);
    setCopiedId(paper.id);
    toast("success", "Citation copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-full overflow-y-auto p-5 lg:p-8 max-w-6xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[26px] lg:text-[30px] font-bold mb-1" style={{ color: "var(--color-text)" }}>Knowledge Resources</h1>
        <p className="text-[13px] mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Browse 500+ curated papers or search live from Semantic Scholar
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: "var(--color-muted-light)" }} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Search papers..."
              className="w-full h-11 pl-10 pr-4 rounded-[12px] border bg-white text-[13px] placeholder:text-[var(--color-muted-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
          </div>
          {searchDone ? (
            <Button onClick={handleClearSearch} variant="outline" size="md">Clear</Button>
          ) : (
            <Button onClick={handleSearch} disabled={!query.trim()} size="md">Search</Button>
          )}
        </div>
        <div className="flex gap-1 p-1 rounded-[10px]" style={{ backgroundColor: "var(--color-sage)" }}>
          <button onClick={() => { setMode("browse"); handleClearSearch(); }}
            className={`px-4 py-2 rounded-[8px] text-[12px] font-medium transition-all ${mode === "browse" ? "bg-white shadow-sm" : ""}`}
            style={{ color: mode === "browse" ? "var(--color-primary)" : "var(--color-text-secondary)" }}>Browse</button>
          <button onClick={() => setMode("search")}
            className={`px-4 py-2 rounded-[8px] text-[12px] font-medium transition-all ${mode === "search" ? "bg-white shadow-sm" : ""}`}
            style={{ color: mode === "search" ? "var(--color-primary)" : "var(--color-text-secondary)" }}>Live Search</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {["Patent Law", "Traditional Knowledge", "Ayurveda", "Copyright", "AI in IP", "Biopiracy"].map((t) => (
          <button key={t} onClick={() => handleTopicClick(t)}
            className="px-3 py-1 rounded-full text-[11px] font-medium border transition-all hover:shadow-sm"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", backgroundColor: "var(--color-card)" }}>{t}</button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Filter className="w-3.5 h-3.5" style={{ color: "var(--color-muted)" }} />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={fieldOfStudy} onChange={(e) => { setFieldOfStudy(e.target.value); setPage(1); }}
          className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
          {FIELD_OF_STUDY.map((f) => <option key={f} value={f}>{f === "All" ? "All Fields" : f}</option>)}
        </select>
        <select value={yearRange} onChange={(e) => { setYearRange(e.target.value); setPage(1); }}
          className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
          {YEAR_RANGES.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
          <option value="citations">Most Cited</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A-Z</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Showing <span className="font-semibold" style={{ color: "var(--color-text)" }}>{filteredPapers.length}</span> papers
          {searchDone && <span> for &ldquo;{query}&rdquo;</span>}
        </p>
        <div className="flex items-center gap-2">
          {liveLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--color-primary)" }} />}
          <span className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-text-secondary)" }}>
            {searchDone ? (livePapers.length > 0 ? "Mixed (Curated + Live)" : "Curated") : "500+ Papers"}
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {paginatedPapers.map((paper, i) => (
          <motion.div key={paper.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
            <Card hover padding="md" className="flex flex-col h-full">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-primary)" }}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <a href={paper.scholarUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] font-semibold leading-tight hover:underline block" style={{ color: "var(--color-primary)" }}>
                    {paper.title}
                  </a>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{formatAuthors(paper.authors)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <Badge size="sm">{paper.year}</Badge>
                <Badge size="sm" variant="outline">{paper.venue}</Badge>
                {paper.citations > 0 && <Badge size="sm" variant="info">{formatCitation(paper.citations)}</Badge>}
              </div>

              <div className="mb-2">
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {expandedId === paper.id ? paper.abstract : (paper.abstract.length > 150 ? paper.abstract.slice(0, 150) + "..." : paper.abstract)}
                </p>
                {paper.abstract.length > 150 && (
                  <button onClick={() => setExpandedId(expandedId === paper.id ? null : paper.id)}
                    className="text-[10px] font-medium mt-0.5 flex items-center gap-0.5 hover:underline"
                    style={{ color: "var(--color-primary)" }}>
                    {expandedId === paper.id ? <><ChevronUp className="w-3 h-3" /> less</> : <><ChevronDown className="w-3 h-3" /> more</>}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                {paper.pdfUrl ? (
                  <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-[10px] font-medium text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}>
                    <Download className="w-3 h-3" /> PDF
                  </a>
                ) : (
                  <a href={paper.scholarUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-[10px] font-medium text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}>
                    <ExternalLink className="w-3 h-3" /> Scholar
                  </a>
                )}
                <button onClick={() => handleCopyCite(paper)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-[10px] font-medium border transition-colors hover:bg-[var(--color-sage)]"
                  style={{ borderColor: "var(--color-border)", color: copiedId === paper.id ? "var(--color-success)" : "var(--color-text)" }}>
                  {copiedId === paper.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Cite</>}
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}
            className="p-2 rounded-[8px] border transition-colors hover:bg-[var(--color-sage)] disabled:opacity-40"
            style={{ borderColor: "var(--color-border)" }}>
            <ChevronLeft className="w-4 h-4" style={{ color: "var(--color-text)" }} />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 7) pageNum = i + 1;
            else if (page <= 4) pageNum = i + 1;
            else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
            else pageNum = page - 3 + i;
            return (
              <button key={pageNum} onClick={() => handlePageChange(pageNum)}
                className="w-8 h-8 rounded-[8px] text-[11px] font-medium transition-all"
                style={{
                  backgroundColor: page === pageNum ? "var(--color-primary)" : "white",
                  color: page === pageNum ? "white" : "var(--color-text)",
                  border: `1px solid ${page === pageNum ? "var(--color-primary)" : "var(--color-border)"}`,
                }}>{pageNum}</button>
            );
          })}
          <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}
            className="p-2 rounded-[8px] border transition-colors hover:bg-[var(--color-sage)] disabled:opacity-40"
            style={{ borderColor: "var(--color-border)" }}>
            <ChevronRight className="w-4 h-4" style={{ color: "var(--color-text)" }} />
          </button>
        </div>
      )}

      {filteredPapers.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-accent)" }} />
          <p className="text-[14px] font-medium mb-1" style={{ color: "var(--color-text)" }}>No papers found</p>
          <p className="text-[12px]" style={{ color: "var(--color-muted)" }}>Try different filters or search terms</p>
        </div>
      )}

      <div className="mt-8">
        <Card padding="lg">
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--color-text)" }}>Quick Links</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_LINKS.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-[12px] border text-[12px] font-medium transition-all hover:bg-[var(--color-sage)]"
                style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-secondary)" }}>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-primary)" }} />
                <div>
                  <span className="block font-semibold" style={{ color: "var(--color-text)" }}>{link.label}</span>
                  <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>{link.description}</span>
                </div>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
