"use client";

import { useState } from "react";
import { bloodBanksData, BloodBankData, BloodGroup, allBloodGroups } from "@/lib/bloodBankData";
import { MapPin, Phone, Navigation, ShieldCheck, Clock, X } from "lucide-react";
import { classNames } from "@/lib/utils";

interface IndiaMapProps {
  selectedGroup: BloodGroup | null;
  onSelectBank: (bank: BloodBankData) => void;
  selectedBank: BloodBankData | null;
}

function getMarkerColor(bank: BloodBankData, group: BloodGroup | null): string {
  if (!group) return "var(--color-secondary)";
  const avail = bank.availability[group];
  if (!avail) return "var(--color-muted-light)";
  if (avail.status === "available") return "#16A34A";
  if (avail.status === "limited") return "#CA8A04";
  return "#DC2626";
}

// Approximate positions on a 500x600 viewBox India map
function getCityPos(city: string): { x: number; y: number } {
  const positions: Record<string, { x: number; y: number }> = {
    "New Delhi": { x: 280, y: 165 },
    "Mumbai": { x: 235, y: 345 },
    "Pune": { x: 240, y: 340 },
    "Bangalore": { x: 250, y: 430 },
    "Chennai": { x: 280, y: 435 },
    "Kolkata": { x: 370, y: 290 },
    "Hyderabad": { x: 265, y: 380 },
    "Ahmedabad": { x: 215, y: 295 },
    "Jaipur": { x: 250, y: 220 },
    "Lucknow": { x: 315, y: 215 },
    "Kochi": { x: 240, y: 480 },
    "Chandigarh": { x: 265, y: 145 },
    "Bhopal": { x: 265, y: 285 },
    "Patna": { x: 345, y: 240 },
    "Nagpur": { x: 285, y: 310 },
    "Indore": { x: 250, y: 295 },
    "Coimbatore": { x: 250, y: 450 },
    "Surat": { x: 220, y: 310 },
    "Vadodara": { x: 218, y: 300 },
    "Noida": { x: 285, y: 170 },
    "Mohali": { x: 262, y: 148 },
    "Rohtak": { x: 275, y: 160 },
    "Ranchi": { x: 355, y: 270 },
    "Cuttack": { x: 355, y: 310 },
    "Bhubaneswar": { x: 358, y: 315 },
    "Guwahati": { x: 410, y: 225 },
    "Raipur": { x: 310, y: 295 },
    "Panaji": { x: 225, y: 395 },
    "Srinagar": { x: 260, y: 80 },
    "Rishikesh": { x: 280, y: 150 },
    "Visakhapatnam": { x: 320, y: 370 },
    "Thiruvananthapuram": { x: 245, y: 500 },
    "Jodhpur": { x: 230, y: 235 },
    "Varanasi": { x: 335, y: 230 },
    "Mysuru": { x: 248, y: 440 },
    "Ludhiana": { x: 262, y: 140 },
    "Agra": { x: 290, y: 185 },
    "Kozhikode": { x: 242, y: 465 },
  };
  return positions[city] || { x: 280, y: 300 };
}

export default function IndiaMap({ selectedGroup, onSelectBank, selectedBank }: IndiaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Group banks by city for marker aggregation
  const cityBanks: Record<string, BloodBankData[]> = {};
  bloodBanksData.forEach((b) => {
    if (!cityBanks[b.city]) cityBanks[b.city] = [];
    cityBanks[b.city].push(b);
  });

  return (
    <div className="relative w-full rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
      <svg viewBox="0 0 500 580" className="w-full h-auto" style={{ minHeight: "400px" }}>
        {/* India outline - simplified */}
        <path
          d="M220 50 L260 40 L290 55 L310 50 L340 65 L370 80 L395 100 L420 110 L440 130 L450 160 L445 190 L430 210 L420 230 L430 250 L440 270 L435 300 L420 320 L400 340 L380 360 L360 370 L340 380 L320 400 L300 420 L280 440 L260 460 L240 475 L225 490 L215 510 L210 530 L200 540 L190 535 L185 520 L190 500 L195 480 L200 460 L205 440 L195 420 L185 400 L175 380 L165 360 L155 340 L150 320 L145 300 L140 280 L135 260 L130 240 L140 220 L155 200 L170 185 L185 175 L200 165 L210 155 L215 140 L220 120 L225 100 L230 80 Z"
          fill="var(--color-sage)"
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />

        {/* State boundaries (simplified) */}
        <path d="M220 50 L260 40 L290 55 L310 50 L340 65 L370 80" fill="none" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.5" />
        <path d="M140 280 L220 280 L280 280 L340 280 L400 280" fill="none" stroke="var(--color-border)" strokeWidth="0.3" opacity="0.3" />
        <path d="M200 200 L280 200 L360 200" fill="none" stroke="var(--color-border)" strokeWidth="0.3" opacity="0.3" />
        <path d="M200 350 L280 350 L360 350" fill="none" stroke="var(--color-border)" strokeWidth="0.3" opacity="0.3" />

        {/* City markers */}
        {Object.entries(cityBanks).map(([city, banks]) => {
          const pos = getCityPos(city);
          const color = getMarkerColor(banks[0], selectedGroup);
          const isSelected = selectedBank && banks.some((b) => b.id === selectedBank.id);
          const isHovered = hovered === city;
          const size = isSelected ? 8 : isHovered ? 7 : 5;

          return (
            <g key={city} onMouseEnter={() => setHovered(city)} onMouseLeave={() => setHovered(null)} onClick={() => onSelectBank(banks[0])} className="cursor-pointer">
              {/* Pulse ring for selected */}
              {isSelected && (
                <circle cx={pos.x} cy={pos.y} r="14" fill={color} opacity="0.15">
                  <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.2" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Shadow */}
              <circle cx={pos.x} cy={pos.y + 1} r={size} fill="black" opacity="0.1" />
              {/* Marker */}
              <circle cx={pos.x} cy={pos.y} r={size} fill={color} stroke="white" strokeWidth="2" />
              {/* Label on hover */}
              {isHovered && (
                <g>
                  <rect x={pos.x - 40} y={pos.y - 28} width="80" height="20" rx="4" fill="var(--color-primary-dark)" opacity="0.9" />
                  <text x={pos.x} y={pos.y - 15} textAnchor="middle" fill="white" fontSize="9" fontWeight="500">{city}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-[10px]" style={{ border: "1px solid var(--color-border)" }}>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#16A34A" }} /> Available</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#CA8A04" }} /> Limited</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#DC2626" }} /> Unavailable</span>
      </div>

      {/* Bank count */}
      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-medium" style={{ border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
        {bloodBanksData.length} Blood Banks
      </div>
    </div>
  );
}
