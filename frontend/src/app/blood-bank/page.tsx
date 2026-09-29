"use client";

import { useState } from "react";
import { Droplets, Save, CheckCircle, Building2, Phone, MapPin, Clock, AlertCircle } from "lucide-react";
import { bloodGroups } from "@/lib/mockData";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { classNames } from "@/lib/utils";

type Status = "available" | "limited" | "unavailable";

export default function BloodBankDashboardPage() {
  const [availability, setAvailability] = useState<Record<string, { status: Status; units: string }>>(() => {
    const init: Record<string, { status: Status; units: string }> = {};
    bloodGroups.forEach((g) => { init[g] = { status: "unavailable", units: "0" }; });
    init["A+"] = { status: "available", units: "12" };
    init["B+"] = { status: "available", units: "8" };
    init["O+"] = { status: "limited", units: "3" };
    return init;
  });
  const [saved, setSaved] = useState(false);
  const [facilityName, setFacilityName] = useState("Indian Red Cross Society - Delhi");
  const [facilityPhone, setFacilityPhone] = useState("+91-11-23356789");
  const [facilityAddress, setFacilityAddress] = useState("Red Cross Building, Civil Lines, New Delhi");
  const [facilityCity, setFacilityCity] = useState("New Delhi");
  const [facilityHours, setFacilityHours] = useState("24 hours");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalUnits = Object.values(availability).reduce((sum, a) => sum + parseInt(a.units || "0", 10), 0);
  const availableGroups = Object.values(availability).filter((a) => a.status === "available").length;

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[28px] lg:text-[34px] font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-primary-dark)" }}>Blood Bank Dashboard</h1>
        <p className="text-[15px] mt-1" style={{ color: "var(--color-muted)" }}>Update blood availability for your facility</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
          <Droplets className="w-5 h-5 mb-2" style={{ color: "var(--color-secondary)" }} />
          <p className="text-[22px] font-bold" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-text)" }}>{availableGroups}</p>
          <p className="text-[12px]" style={{ color: "var(--color-muted-light)" }}>Available Blood Groups</p>
        </div>
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
          <Droplets className="w-5 h-5 mb-2" style={{ color: "var(--color-emergency)" }} />
          <p className="text-[22px] font-bold" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-text)" }}>{totalUnits}</p>
          <p className="text-[12px]" style={{ color: "var(--color-muted-light)" }}>Total Available Units</p>
        </div>
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
          <Clock className="w-5 h-5 mb-2" style={{ color: "var(--color-gold)" }} />
          <p className="text-[22px] font-bold" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-text)" }}>Just now</p>
          <p className="text-[12px]" style={{ color: "var(--color-muted-light)" }}>Last Updated</p>
        </div>
      </div>

      {/* Availability table */}
      <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor: "var(--color-border)" }}>
        <div className="px-5 py-3" style={{ backgroundColor: "var(--color-sage)" }}>
          <h2 className="text-[14px] font-semibold" style={{ color: "var(--color-text)" }}>Blood Availability</h2>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
              <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Blood Group</th>
              <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Status</th>
              <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Units</th>
              <th className="text-right px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bloodGroups.map((group) => {
              const item = availability[group];
              return (
                <tr key={group} className="border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
                  <td className="px-5 py-3">
                    <span className="text-[16px] font-bold" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-text)" }}>{group}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {(["available", "limited", "unavailable"] as Status[]).map((s) => (
                        <button key={s} onClick={() => setAvailability({ ...availability, [group]: { ...availability[group], status: s } })}
                          className={classNames("px-2 py-1 rounded text-[11px] font-medium transition-all",
                            item.status === s ? "text-white" : ""
                          )}
                          style={item.status === s
                            ? { backgroundColor: s === "available" ? "#16A34A" : s === "limited" ? "#CA8A04" : "#DC2626" }
                            : { backgroundColor: "var(--color-sage-light)", color: "var(--color-muted)" }
                          }>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <input type="number" min="0" value={item.units}
                      onChange={(e) => setAvailability({ ...availability, [group]: { ...availability[group], units: e.target.value } })}
                      className="w-20 px-3 py-1.5 rounded border text-[13px] focus:outline-none focus:ring-2"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={classNames("text-[11px] font-medium",
                      item.status === "available" ? "text-green-600" : item.status === "limited" ? "text-yellow-600" : "text-red-600"
                    )}>{item.status === "available" ? "Updated" : item.status === "limited" ? "Low" : "Empty"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Facility profile */}
      <div className="rounded-xl border p-6 mb-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
        <h2 className="text-[14px] font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
          <Building2 className="w-4 h-4" /> Facility Profile
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--color-muted)" }}>Facility Name</label>
            <input type="text" value={facilityName} onChange={(e) => setFacilityName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--color-muted)" }}>Phone</label>
            <input type="tel" value={facilityPhone} onChange={(e) => setFacilityPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--color-muted)" }}>Address</label>
            <input type="text" value={facilityAddress} onChange={(e) => setFacilityAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--color-muted)" }}>City</label>
              <input type="text" value={facilityCity} onChange={(e) => setFacilityCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--color-muted)" }}>Hours</label>
              <input type="text" value={facilityHours} onChange={(e) => setFacilityHours(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-[14px] focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg p-3 mb-6 flex items-start gap-2" style={{ backgroundColor: "var(--color-sage)", border: "1px solid var(--color-border)" }}>
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--color-gold)" }} />
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
          Blood availability is NOT guaranteed. Inventory can change rapidly. Always confirm directly with the facility.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
      </div>

      {saved && <Toast type="success" message="Changes saved successfully." onClose={() => setSaved(false)} />}
    </div>
  );
}
