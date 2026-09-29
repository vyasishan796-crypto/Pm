"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Pill, Leaf, HeartPulse, ChevronLeft, ChevronRight, Loader2, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

interface Medicine {
  _id: string;
  name: string;
  sanskritName?: string;
  form: string;
  category: string;
  dosha: string[];
  uses: string[];
  dosage?: string;
  contraindications?: string[];
  description?: string;
}

interface Remedy {
  _id: string;
  name: string;
  condition: string;
  ingredients: string[];
  category: string;
  description?: string;
  preparation?: string;
}

interface Disease {
  _id: string;
  name: string;
  sanskritName?: string;
  symptoms: string[];
  doshaInvolved: string[];
  description?: string;
  treatment?: string[];
}

type Tab = "medicines" | "remedies" | "diseases";

const PER_PAGE = 20;

const DOSHA_OPTIONS = ["Vata", "Pitta", "Kapha", "Tridosha"];
const MEDICINE_CATEGORIES = ["Herbal", "Mineral", "Animal", "Herbo-Mineral", "Guggulu", "Asava-Arishta"];
const MEDICINE_FORMS = ["Churna", "Vati", "Ghrita", "Taila", "Kashaya", "Bhasma", "Guggulu", "Avaleha", "Swarasa", "Paste"];
const REMEDY_CATEGORIES = ["Digestive", "Respiratory", "Skin", "Joint", "Neurological", "Cardiac", "Metabolic", "General"];

export default function AyurvedaPage() {
  const [tab, setTab] = useState<Tab>("medicines");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const [medicineCategory, setMedicineCategory] = useState("");
  const [medicineForm, setMedicineForm] = useState("");
  const [medicineDosha, setMedicineDosha] = useState("");
  const [remedyCategory, setRemedyCategory] = useState("");
  const [diseaseDosha, setDiseaseDosha] = useState("");

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);

  const [totalMedicines, setTotalMedicines] = useState(0);
  const [totalRemedies, setTotalRemedies] = useState(0);
  const [totalDiseases, setTotalDiseases] = useState(0);

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Medicine | Remedy | Disease | null>(null);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: String(PER_PAGE) };
      if (search) params.search = search;
      if (medicineCategory) params.category = medicineCategory;
      if (medicineForm) params.form = medicineForm;
      if (medicineDosha) params.dosha = medicineDosha;
      const res = await api.get("/api/ayurveda/medicines", { params });
      setMedicines(res.data.data || res.data.medicines || []);
      setTotalMedicines(res.data.total || res.data.count || 0);
    } catch {
      setMedicines([]);
    }
    setLoading(false);
  }, [page, search, medicineCategory, medicineForm, medicineDosha]);

  const fetchRemedies = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: String(PER_PAGE) };
      if (search) params.search = search;
      if (remedyCategory) params.category = remedyCategory;
      const res = await api.get("/api/ayurveda/remedies", { params });
      setRemedies(res.data.data || res.data.remedies || []);
      setTotalRemedies(res.data.total || res.data.count || 0);
    } catch {
      setRemedies([]);
    }
    setLoading(false);
  }, [page, search, remedyCategory]);

  const fetchDiseases = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: String(PER_PAGE) };
      if (search) params.search = search;
      if (diseaseDosha) params.dosha = diseaseDosha;
      const res = await api.get("/api/ayurveda/diseases", { params });
      setDiseases(res.data.data || res.data.diseases || []);
      setTotalDiseases(res.data.total || res.data.count || 0);
    } catch {
      setDiseases([]);
    }
    setLoading(false);
  }, [page, search, diseaseDosha]);

  useEffect(() => {
    if (tab === "medicines") fetchMedicines();
    else if (tab === "remedies") fetchRemedies();
    else fetchDiseases();
  }, [tab, fetchMedicines, fetchRemedies, fetchDiseases]);

  useEffect(() => {
    if (tab === "medicines") {
      const p = api.get("/api/ayurveda/medicines", { params: { page: 1, limit: 1 } });
      p.then((r) => setTotalMedicines(r.data.total || r.data.count || 0)).catch(() => {});
    }
    if (tab === "remedies") {
      const p = api.get("/api/ayurveda/remedies", { params: { page: 1, limit: 1 } });
      p.then((r) => setTotalRemedies(r.data.total || r.data.count || 0)).catch(() => {});
    }
    if (tab === "diseases") {
      const p = api.get("/api/ayurveda/diseases", { params: { page: 1, limit: 1 } });
      p.then((r) => setTotalDiseases(r.data.total || r.data.count || 0)).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setPage(1);
    setSearch("");
    setSearchInput("");
  };

  const resetFilters = () => {
    setMedicineCategory("");
    setMedicineForm("");
    setMedicineDosha("");
    setRemedyCategory("");
    setDiseaseDosha("");
    setPage(1);
  };

  const currentItems = tab === "medicines" ? medicines : tab === "remedies" ? remedies : diseases;
  const totalItems = tab === "medicines" ? totalMedicines : tab === "remedies" ? totalRemedies : totalDiseases;
  const totalPages = Math.ceil(totalItems / PER_PAGE);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "medicines", label: "Medicines", icon: <Pill className="w-4 h-4" />, count: totalMedicines },
    { id: "remedies", label: "Remedies", icon: <Leaf className="w-4 h-4" />, count: totalRemedies },
    { id: "diseases", label: "Diseases", icon: <HeartPulse className="w-4 h-4" />, count: totalDiseases },
  ];

  return (
    <div className="h-full overflow-y-auto p-5 lg:p-8 max-w-6xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[26px] lg:text-[30px] font-bold mb-1" style={{ color: "var(--color-text)" }}>Ayurveda Knowledge Base</h1>
        <p className="text-[13px] mb-5" style={{ color: "var(--color-text-secondary)" }}>
          Explore traditional Ayurvedic medicines, remedies, and diseases
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Medicines", value: totalMedicines, icon: <Pill className="w-4 h-4" />, color: "var(--color-primary)" },
          { label: "Remedies", value: totalRemedies, icon: <Leaf className="w-4 h-4" />, color: "var(--color-success, #16a34a)" },
          { label: "Diseases", value: totalDiseases, icon: <HeartPulse className="w-4 h-4" />, color: "var(--color-secondary, #9333ea)" },
        ].map((s) => (
          <Card key={s.label} padding="sm" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--color-text)" }}>{s.value}</p>
              <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>{s.label}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-[12px] mb-4" style={{ backgroundColor: "var(--color-sage)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => handleTabChange(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-medium transition-all flex-1 justify-center ${tab === t.id ? "bg-white shadow-sm" : ""}`}
            style={{ color: tab === t.id ? "var(--color-primary)" : "var(--color-text-secondary)" }}>
            {t.icon}
            <span>{t.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: tab === t.id ? "var(--color-primary)" : "var(--color-border)", color: tab === t.id ? "white" : "var(--color-text-secondary)" }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: "var(--color-muted-light, #9ca3af)" }} />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={`Search ${tab}...`}
            className="w-full h-11 pl-10 pr-4 rounded-[12px] border bg-white text-[13px] placeholder:text-[var(--color-muted-light, #9ca3af)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
          {searchInput && (
            <button onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--color-sage)]">
              <X className="w-3.5 h-3.5" style={{ color: "var(--color-text-secondary)" }} />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} size="md">Search</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Filter className="w-3.5 h-3.5" style={{ color: "var(--color-muted, #9ca3af)" }} />
        {tab === "medicines" && (
          <>
            <select value={medicineCategory} onChange={(e) => { setMedicineCategory(e.target.value); setPage(1); }}
              className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
              <option value="">All Categories</option>
              {MEDICINE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={medicineForm} onChange={(e) => { setMedicineForm(e.target.value); setPage(1); }}
              className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
              <option value="">All Forms</option>
              {MEDICINE_FORMS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={medicineDosha} onChange={(e) => { setMedicineDosha(e.target.value); setPage(1); }}
              className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
              <option value="">All Doshas</option>
              {DOSHA_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </>
        )}
        {tab === "remedies" && (
          <select value={remedyCategory} onChange={(e) => { setRemedyCategory(e.target.value); setPage(1); }}
            className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
            <option value="">All Categories</option>
            {REMEDY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        {tab === "diseases" && (
          <select value={diseaseDosha} onChange={(e) => { setDiseaseDosha(e.target.value); setPage(1); }}
            className="h-8 px-2 rounded-[8px] border text-[11px] focus:outline-none"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
            <option value="">All Doshas</option>
            {DOSHA_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        {(medicineCategory || medicineForm || medicineDosha || remedyCategory || diseaseDosha) && (
          <button onClick={resetFilters} className="text-[11px] font-medium flex items-center gap-1 px-2 py-1 rounded-full transition-colors hover:bg-red-50" style={{ color: "var(--color-error, #dc2626)" }}>
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Showing <span className="font-semibold" style={{ color: "var(--color-text)" }}>{currentItems.length}</span> of {totalItems} {tab}
          {search && <span> for &ldquo;{search}&rdquo;</span>}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      )}

      {/* Empty State */}
      {!loading && currentItems.length === 0 && (
        <div className="text-center py-16">
          <Leaf className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-border, #d1d5db)" }} />
          <p className="text-[14px] font-medium mb-1" style={{ color: "var(--color-text)" }}>No {tab} found</p>
          <p className="text-[12px]" style={{ color: "var(--color-muted, #9ca3af)" }}>Try different filters or search terms</p>
        </div>
      )}

      {/* Card Grid */}
      {!loading && currentItems.length > 0 && (
        <>
          {tab === "medicines" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {(medicines as Medicine[]).map((med, i) => (
                <motion.div key={med._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
                  <Card hover padding="md" className="flex flex-col h-full" onClick={() => setSelected(med)}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-primary)" }}>
                        <Pill className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--color-text)" }}>{med.name}</p>
                        {med.sanskritName && <p className="text-[11px] italic" style={{ color: "var(--color-text-secondary)" }}>{med.sanskritName}</p>}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <Badge size="sm">{med.form}</Badge>
                      <Badge size="sm" variant="info">{med.category}</Badge>
                      {med.dosha?.map((d) => (
                        <Badge key={d} size="sm" variant={
                          d === "Vata" ? "info" : d === "Pitta" ? "warning" : d === "Kapha" ? "success" : "default"
                        }>{d}</Badge>
                      ))}
                    </div>

                    <div className="mb-2">
                      <p className="text-[11px] leading-relaxed line-clamp-3" style={{ color: "var(--color-text-secondary)" }}>
                        {med.uses?.length > 0 ? med.uses.join(", ") : med.description || "No description available"}
                      </p>
                    </div>

                    <div className="mt-auto pt-2 border-t flex items-center gap-1" style={{ borderColor: "var(--color-border-light, #f3f4f6)" }}>
                      <span className="text-[10px] font-medium" style={{ color: "var(--color-primary)" }}>View Details</span>
                      <ChevronRight className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "remedies" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {(remedies as Remedy[]).map((rem, i) => (
                <motion.div key={rem._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
                  <Card hover padding="md" className="flex flex-col h-full" onClick={() => setSelected(rem)}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-success, #16a34a)" }}>
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--color-text)" }}>{rem.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>{rem.condition}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <Badge size="sm" variant="success">{rem.category}</Badge>
                    </div>

                    <div className="mb-2">
                      <p className="text-[10px] font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Ingredients:</p>
                      <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
                        {rem.ingredients?.join(", ") || "N/A"}
                      </p>
                    </div>

                    <div className="mt-auto pt-2 border-t flex items-center gap-1" style={{ borderColor: "var(--color-border-light, #f3f4f6)" }}>
                      <span className="text-[10px] font-medium" style={{ color: "var(--color-primary)" }}>View Details</span>
                      <ChevronRight className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "diseases" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {(diseases as Disease[]).map((dis, i) => (
                <motion.div key={dis._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
                  <Card hover padding="md" className="flex flex-col h-full" onClick={() => setSelected(dis)}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-secondary, #9333ea)" }}>
                        <HeartPulse className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--color-text)" }}>{dis.name}</p>
                        {dis.sanskritName && <p className="text-[11px] italic" style={{ color: "var(--color-text-secondary)" }}>{dis.sanskritName}</p>}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {dis.doshaInvolved?.map((d) => (
                        <Badge key={d} size="sm" variant={
                          d === "Vata" ? "info" : d === "Pitta" ? "warning" : d === "Kapha" ? "success" : "default"
                        }>{d}</Badge>
                      ))}
                    </div>

                    <div className="mb-2">
                      <p className="text-[10px] font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Symptoms:</p>
                      <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
                        {dis.symptoms?.join(", ") || "N/A"}
                      </p>
                    </div>

                    <div className="mt-auto pt-2 border-t flex items-center gap-1" style={{ borderColor: "var(--color-border-light, #f3f4f6)" }}>
                      <span className="text-[10px] font-medium" style={{ color: "var(--color-primary)" }}>View Details</span>
                      <ChevronRight className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <button onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={page === 1}
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
              <button key={pageNum} onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-8 h-8 rounded-[8px] text-[11px] font-medium transition-all"
                style={{
                  backgroundColor: page === pageNum ? "var(--color-primary)" : "white",
                  color: page === pageNum ? "white" : "var(--color-text)",
                  border: `1px solid ${page === pageNum ? "var(--color-primary)" : "var(--color-border)"}`,
                }}>{pageNum}</button>
            );
          })}
          <button onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={page === totalPages}
            className="p-2 rounded-[8px] border transition-colors hover:bg-[var(--color-sage)] disabled:opacity-40"
            style={{ borderColor: "var(--color-border)" }}>
            <ChevronRight className="w-4 h-4" style={{ color: "var(--color-text)" }} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[16px] border p-6"
              style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
              onClick={(e) => e.stopPropagation()}>

              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-1.5 rounded-[8px] transition-colors hover:bg-[var(--color-sage)]">
                <X className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
              </button>

              {/* Medicine Detail */}
              {"name" in selected && "form" in selected && (
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-primary)" }}>
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold" style={{ color: "var(--color-text)" }}>{selected.name}</h2>
                      {"sanskritName" in selected && selected.sanskritName && <p className="text-[13px] italic" style={{ color: "var(--color-text-secondary)" }}>{selected.sanskritName}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge size="md">{(selected as Medicine).form}</Badge>
                    <Badge size="md" variant="info">{(selected as Medicine).category}</Badge>
                    {(selected as Medicine).dosha?.map((d: string) => (
                      <Badge key={d} size="md" variant={d === "Vata" ? "info" : d === "Pitta" ? "warning" : "success"}>{d}</Badge>
                    ))}
                  </div>
                  {"uses" in selected && (selected as Medicine).uses?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Uses</h3>
                      <ul className="list-disc list-inside text-[12px] space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                        {(selected as Medicine).uses.map((u: string, i: number) => <li key={i}>{u}</li>)}
                      </ul>
                    </div>
                  )}
                  {(selected as Medicine).dosage && (
                    <div className="mb-4">
                      <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Dosage</h3>
                      <p className="text-[12px]" style={{ color: "var(--color-text-secondary)" }}>{(selected as Medicine).dosage}</p>
                    </div>
                  )}
                  {((selected as Medicine).contraindications || []).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-error, #dc2626)" }}>Contraindications</h3>
                      <ul className="list-disc list-inside text-[12px] space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                        {((selected as Medicine).contraindications || []).map((c: string, i: number) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {"description" in selected && (selected as Medicine).description && (
                    <div>
                      <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Description</h3>
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{(selected as Medicine).description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Remedy Detail */}
              {"condition" in selected && "ingredients" in selected && (
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-success, #16a34a)" }}>
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold" style={{ color: "var(--color-text)" }}>{selected.name}</h2>
                      <p className="text-[13px]" style={{ color: "var(--color-text-secondary)" }}>{(selected as Remedy).condition}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge size="md" variant="success">{(selected as Remedy).category}</Badge>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Ingredients</h3>
                    <ul className="list-disc list-inside text-[12px] space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                      {(selected as Remedy).ingredients.map((ing: string, i: number) => <li key={i}>{ing}</li>)}
                    </ul>
                  </div>
                  {(selected as Remedy).preparation && (
                    <div className="mb-4">
                      <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Preparation</h3>
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{(selected as Remedy).preparation}</p>
                    </div>
                  )}
                  {"description" in selected && (selected as Remedy).description && (
                    <div>
                      <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Description</h3>
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{(selected as Remedy).description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Disease Detail */}
              {"symptoms" in selected && "doshaInvolved" in selected && (
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-secondary, #9333ea)" }}>
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold" style={{ color: "var(--color-text)" }}>{selected.name}</h2>
                      {"sanskritName" in selected && (selected as Disease).sanskritName && <p className="text-[13px] italic" style={{ color: "var(--color-text-secondary)" }}>{(selected as Disease).sanskritName}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(selected as Disease).doshaInvolved?.map((d: string) => (
                      <Badge key={d} size="md" variant={d === "Vata" ? "info" : d === "Pitta" ? "warning" : "success"}>{d}</Badge>
                    ))}
                  </div>
                  <div className="mb-4">
                    <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Symptoms</h3>
                    <ul className="list-disc list-inside text-[12px] space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                      {(selected as Disease).symptoms.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  {((selected as Disease).treatment || []).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Treatment</h3>
                      <ul className="list-disc list-inside text-[12px] space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                        {((selected as Disease).treatment || []).map((t: string, i: number) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}
                  {"description" in selected && (selected as Disease).description && (
                    <div>
                      <h3 className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>Description</h3>
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{(selected as Disease).description}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
