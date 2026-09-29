"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Phone, ShieldCheck, Navigation, Clock, Building2 } from "lucide-react";
import { bloodBanksData, allCities, allBloodGroups, BloodGroup } from "@/lib/bloodBankData";
import { classNames } from "@/lib/utils";

export default function BloodBanksPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | "all">("all");

  const filtered = useMemo(() => {
    return bloodBanksData.filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase());
      const matchesCity = selectedCity === "all" || b.city === selectedCity;
      const matchesGroup = selectedGroup === "all" || (b.availability[selectedGroup] && b.availability[selectedGroup].status !== "unavailable");
      return matchesSearch && matchesCity && matchesGroup;
    });
  }, [search, selectedCity, selectedGroup]);

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[28px] lg:text-[34px] font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-primary-dark)" }}>Blood Banks</h1>
        <p className="text-[15px] mt-1" style={{ color: "var(--color-muted)" }}>Directory of {bloodBanksData.length} registered blood banks and hospitals across India</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-muted-light)" }} />
          <input type="text" placeholder="Search blood banks or hospitals..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }} />
        </div>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
          <option value="all">All Cities</option>
          {allCities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value as any)}
          className="px-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }}>
          <option value="all">All Blood Groups</option>
          {allBloodGroups.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((bank) => (
          <div key={bank.id} className="rounded-xl border p-5 transition-all hover:shadow-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>{bank.name}</h3>
                  {bank.verified && <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-secondary)" }} />}
                </div>
                <p className="text-[11px] mb-1" style={{ color: "var(--color-muted)" }}>{bank.address}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-secondary)" }}>{bank.type}</span>
            </div>

            {/* Blood groups */}
            <div className="flex flex-wrap gap-1 mb-3">
              {allBloodGroups.map((g) => {
                const a = bank.availability[g];
                return (
                  <span key={g} className={classNames("text-[9px] font-medium px-1.5 py-0.5 rounded",
                    a.status === "available" ? "text-green-700" : a.status === "limited" ? "text-yellow-700" : "text-red-700"
                  )} style={{ backgroundColor: a.status === "available" ? "#DCFCE7" : a.status === "limited" ? "#FEF9C3" : "#FEE2E2" }}>
                    {g}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-[10px] mb-3" style={{ color: "var(--color-muted-light)" }}>
              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{bank.city}, {bank.state}</span>
              <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" />{bank.phone}</span>
            </div>

            <div className="flex gap-2">
              <a href={`tel:${bank.phone}`} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors hover:bg-[var(--color-sage)]" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                <Phone className="w-3 h-3" /> Call
              </a>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${bank.lat},${bank.lng}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white transition-all" style={{ backgroundColor: "var(--color-primary)" }}>
                <Navigation className="w-3 h-3" /> Directions
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 rounded-xl border" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
          <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--color-accent)" }} />
          <p className="text-[14px] font-medium" style={{ color: "var(--color-text)" }}>No blood banks found</p>
          <p className="text-[12px]" style={{ color: "var(--color-muted-light)" }}>Try different filters</p>
        </div>
      )}
    </div>
  );
}
