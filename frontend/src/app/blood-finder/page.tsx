"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Phone, Navigation, AlertCircle, Clock, List, MapIcon, ShieldCheck } from "lucide-react";
import { bloodBanksData, BloodBankData, BloodGroup, allBloodGroups, allCities } from "@/lib/bloodBankData";
import IndiaMap from "@/components/blood/IndiaMap";
import { classNames } from "@/lib/utils";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

type ViewMode = "list" | "map";

export default function FindBloodPage() {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | null>(null);
  const [city, setCity] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [results, setResults] = useState<BloodBankData[]>([]);
  const [searched, setSearched] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [selectedBank, setSelectedBank] = useState<BloodBankData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const filteredCities = useMemo(() => {
    if (!city) return allCities;
    return allCities.filter((c) => c.toLowerCase().includes(city.toLowerCase()));
  }, [city]);

  const mapApiToBloodBankData = (apiBank: any): BloodBankData => {
    const groups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const availability: Record<BloodGroup, { status: any; units: number; updated: string }> = {} as any;
    groups.forEach((g) => {
      const av = apiBank.availability?.find((a: any) => a.blood_group === g);
      if (av) {
        const units = av.units_available || 0;
        availability[g] = {
          status: units === 0 ? "unavailable" : units <= 3 ? "limited" : "available",
          units,
          updated: av.last_updated ? "Recently updated" : "N/A",
        };
      } else {
        availability[g] = { status: "unavailable", units: 0, updated: "N/A" };
      }
    });
    return {
      id: String(apiBank.blood_bank_id),
      name: apiBank.name,
      address: apiBank.address,
      city: apiBank.city,
      state: "",
      lat: apiBank.latitude,
      lng: apiBank.longitude,
      phone: apiBank.phone,
      type: "Blood Bank",
      verified: apiBank.verification_status === "verified",
      availability,
    };
  };

  const handleSearch = async () => {
    if (!selectedGroup) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { blood_group: selectedGroup };
      if (city) params.city = city;
      const res = await api.get("/api/blood/search", { params });
      const apiResults = res.data.results || [];
      setResults(apiResults.map(mapApiToBloodBankData));
    } catch {
      let filtered = bloodBanksData;
      if (city) filtered = filtered.filter((b) => b.city.toLowerCase().includes(city.toLowerCase()));
      if (selectedGroup) {
        filtered = filtered.filter((b) => {
          const a = b.availability[selectedGroup];
          return a && a.status !== "unavailable";
        });
      }
      setResults(filtered);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleSelectCity = (c: string) => {
    setCity(c);
    setCityOpen(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-[28px] lg:text-[34px] font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-primary-dark)" }}>Find Blood</h1>
        <p className="text-[15px]" style={{ color: "var(--color-muted)" }}>Find nearby registered blood banks and hospitals reporting availability</p>
      </div>

      {/* Search card */}
      <div className="rounded-xl border p-5 mb-5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
        <h2 className="text-[14px] font-semibold mb-3" style={{ color: "var(--color-text)" }}>Select Blood Group</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
          {allBloodGroups.map((group) => (
            <button key={group} onClick={() => setSelectedGroup(group)}
              className={classNames("py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 border-2",
                selectedGroup === group ? "text-white shadow-md scale-105" : "hover:shadow-sm"
              )}
              style={selectedGroup === group
                ? { backgroundColor: "var(--color-emergency)", borderColor: "var(--color-emergency)" }
                : { color: "var(--color-text)", borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }
              }>{group}</button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: "var(--color-muted-light)" }} />
            <input type="text" placeholder="Enter city..." value={city}
              onChange={(e) => { setCity(e.target.value); setCityOpen(true); }}
              onFocus={() => setCityOpen(true)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }} />
            {cityOpen && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg border max-h-48 overflow-y-auto z-20" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
                {filteredCities.slice(0, 15).map((c) => (
                  <button key={c} onClick={() => handleSelectCity(c)}
                    className="w-full text-left px-4 py-2 text-[13px] hover:bg-[var(--color-sage)] transition-colors" style={{ color: "var(--color-text)" }}>{c}</button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleSearch} disabled={!selectedGroup} loading={loading}>
            <Search className="w-4 h-4 mr-2" /> Find Blood
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg p-3 mb-5 flex items-start gap-2" style={{ backgroundColor: "var(--color-emergency-light)", border: "1px solid #FECACA" }}>
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--color-emergency)" }} />
        <p className="text-[11px] leading-relaxed" style={{ color: "#991B1B" }}>
          Availability may change rapidly. Please confirm directly with the facility before travelling.
        </p>
      </div>

      {/* Results header */}
      {searched && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold" style={{ color: "var(--color-text)" }}>
            {results.length} blood bank{results.length !== 1 ? "s" : ""} found
            {selectedGroup && <span className="ml-2 font-normal" style={{ color: "var(--color-muted)" }}>for {selectedGroup}</span>}
          </h2>
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--color-sage)" }}>
            <button onClick={() => setViewMode("list")} className={classNames("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-white shadow-sm" : "")}>
              <List className="w-4 h-4" style={{ color: viewMode === "list" ? "var(--color-primary)" : "var(--color-muted-light)" }} />
            </button>
            <button onClick={() => setViewMode("map")} className={classNames("p-1.5 rounded-md transition-all", viewMode === "map" ? "bg-white shadow-sm" : "")}>
              <MapIcon className="w-4 h-4" style={{ color: viewMode === "map" ? "var(--color-primary)" : "var(--color-muted-light)" }} />
            </button>
          </div>
        </div>
      )}

      {/* Map + List view */}
      {searched && (
        <div className="grid lg:grid-cols-5 gap-4">
          {viewMode === "map" && (
            <div className="lg:col-span-3">
              <IndiaMap selectedGroup={selectedGroup} onSelectBank={setSelectedBank} selectedBank={selectedBank} />
            </div>
          )}
          <div className={classNames("space-y-3", viewMode === "map" ? "lg:col-span-2 max-h-[600px] overflow-y-auto" : "")}>
            {results.map((bank) => {
              const avail = selectedGroup ? bank.availability[selectedGroup] : null;
              const isSelected = selectedBank?.id === bank.id;
              return (
                <div key={bank.id}
                  onClick={() => setSelectedBank(bank)}
                  className={classNames("rounded-xl border p-4 transition-all cursor-pointer",
                    isSelected ? "ring-2 shadow-md" : "hover:shadow-sm"
                  )}
                  style={{
                    borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)",
                    backgroundColor: "var(--color-card)",
                  }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>{bank.name}</h3>
                        {bank.verified && <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-secondary)" }} />}
                      </div>
                      <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>{bank.address}</p>
                    </div>
                    {avail && (
                      <span className={classNames("text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                        avail.status === "available" ? "text-green-700" : avail.status === "limited" ? "text-yellow-700" : "text-red-700"
                      )} style={{ backgroundColor: avail.status === "available" ? "#DCFCE7" : avail.status === "limited" ? "#FEF9C3" : "#FEE2E2" }}>
                        {avail.units} units
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {allBloodGroups.map((g) => {
                      const a = bank.availability[g];
                      const isTarget = g === selectedGroup;
                      return (
                        <span key={g} className={classNames("text-[9px] font-medium px-1.5 py-0.5 rounded", isTarget ? "ring-1" : "")}
                          style={{
                            backgroundColor: a.status === "available" ? "#DCFCE7" : a.status === "limited" ? "#FEF9C3" : "#FEE2E2",
                            color: a.status === "available" ? "#166534" : a.status === "limited" ? "#854D0E" : "#991B1B",
                          }}>
                          {g}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--color-muted-light)" }}>
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{avail?.updated || "N/A"}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <a href={`tel:${bank.phone}`} onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border transition-colors hover:bg-[var(--color-sage)]"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${bank.lat},${bank.lng}`} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-white transition-all"
                        style={{ backgroundColor: "var(--color-primary)" }}>
                        <Navigation className="w-3 h-3" /> Directions
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!searched && (
        <div className="rounded-xl text-center py-16 border" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
          <MapIcon className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h3 className="text-[16px] font-semibold mb-2" style={{ color: "var(--color-text)" }}>Select a blood group to search</h3>
          <p className="text-[13px] max-w-sm mx-auto" style={{ color: "var(--color-muted)" }}>
            Choose a blood group above and click Find Blood to see registered blood banks across India
          </p>
        </div>
      )}
    </div>
  );
}
