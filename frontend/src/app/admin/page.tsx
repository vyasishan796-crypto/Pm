"use client";

import { useState, useEffect } from "react";
import { Users, Droplets, Brain, Database, BarChart3, Activity, ShieldCheck, AlertTriangle, Clock } from "lucide-react";
import { classNames } from "@/lib/utils";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";

type Tab = "overview" | "users" | "blood_banks" | "documents" | "queries" | "activity";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-xl border p-5 transition-all hover:shadow-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
      <Icon className="w-5 h-5 mb-3" style={{ color }} />
      <p className="text-[24px] font-bold" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-text)" }}>{value.toLocaleString()}</p>
      <p className="text-[12px] mt-0.5" style={{ color: "var(--color-muted-light)" }}>{label}</p>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, banksRes, docsRes, queriesRes] = await Promise.allSettled([
        api.get("/api/admin/stats"),
        api.get("/api/admin/users"),
        api.get("/api/admin/blood-banks"),
        api.get("/api/admin/documents"),
        api.get("/api/admin/queries"),
      ]);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (usersRes.status === "fulfilled") setUsers(usersRes.value.data.users || []);
      if (banksRes.status === "fulfilled") setBloodBanks(banksRes.value.data.banks || []);
      if (docsRes.status === "fulfilled") setDocuments(docsRes.value.data.documents || []);
      if (queriesRes.status === "fulfilled") setQueries(queriesRes.value.data.queries || []);
    } catch {
      toast("error", "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "overview" as Tab, label: "Overview", icon: BarChart3 },
    { key: "users" as Tab, label: "Users", icon: Users },
    { key: "blood_banks" as Tab, label: "Blood Banks", icon: Droplets },
    { key: "documents" as Tab, label: "Documents", icon: Database },
    { key: "queries" as Tab, label: "AI Queries", icon: Brain },
    { key: "activity" as Tab, label: "Activity", icon: Activity },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[28px] lg:text-[34px] font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-primary-dark)" }}>Admin Dashboard</h1>
        <p className="text-[15px] mt-1" style={{ color: "var(--color-muted)" }}>System management and analytics</p>
      </div>

      <div className="flex gap-1 mb-8 p-1 rounded-xl overflow-x-auto" style={{ backgroundColor: "var(--color-sage)" }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={classNames("flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all",
              activeTab === t.key ? "shadow-sm text-white" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            )}
            style={activeTab === t.key ? { backgroundColor: "var(--color-primary)" } : {}}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl h-20 animate-pulse" style={{ backgroundColor: "var(--color-sage)" }} />
          ))}
        </div>
      )}

      {!loading && activeTab === "overview" && stats && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Total Users" value={stats.total_users || 0} icon={Users} color="var(--color-secondary)" />
            <StatCard label="Registered Blood Banks" value={stats.total_blood_banks || 0} icon={Droplets} color="var(--color-emergency)" />
            <StatCard label="AI Queries" value={stats.total_queries || 0} icon={Brain} color="var(--color-secondary)" />
            <StatCard label="Documents" value={stats.total_documents || 0} icon={Database} color="var(--color-gold)" />
            <StatCard label="Verified Facilities" value={stats.verified_blood_banks || 0} icon={ShieldCheck} color="var(--color-secondary)" />
            <StatCard label="Pending Verifications" value={stats.pending_verifications || 0} icon={AlertTriangle} color="var(--color-gold)" />
          </div>
        </div>
      )}

      {!loading && activeTab === "users" && (
        <div className="rounded-xl border overflow-hidden animate-fade-in" style={{ borderColor: "var(--color-border)" }}>
          <table className="w-full text-[13px]">
            <thead style={{ backgroundColor: "var(--color-sage)" }}>
              <tr>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Name</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Email</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Role</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Provider</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.user_id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "var(--color-text)" }}>{u.name}</td>
                  <td className="px-5 py-3" style={{ color: "var(--color-muted)" }}>{u.email}</td>
                  <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-secondary)" }}>{u.role}</span></td>
                  <td className="px-5 py-3" style={{ color: "var(--color-muted-light)" }}>{u.auth_provider || "local"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === "blood_banks" && (
        <div className="rounded-xl border overflow-hidden animate-fade-in" style={{ borderColor: "var(--color-border)" }}>
          <table className="w-full text-[13px]">
            <thead style={{ backgroundColor: "var(--color-sage)" }}>
              <tr>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Name</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>City</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Phone</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bloodBanks.map((b: any) => (
                <tr key={b.blood_bank_id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "var(--color-text)" }}>{b.name}</td>
                  <td className="px-5 py-3" style={{ color: "var(--color-muted)" }}>{b.city}</td>
                  <td className="px-5 py-3" style={{ color: "var(--color-muted)" }}>{b.phone}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: b.verification_status === "verified" ? "var(--color-secondary)" : "var(--color-gold)" }}>
                      <ShieldCheck className="w-3 h-3" /> {b.verification_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === "documents" && (
        <div className="rounded-xl border overflow-hidden animate-fade-in" style={{ borderColor: "var(--color-border)" }}>
          <table className="w-full text-[13px]">
            <thead style={{ backgroundColor: "var(--color-sage)" }}>
              <tr>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Title</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Category</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Source</th>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--color-text)" }}>Language</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d: any) => (
                <tr key={d.document_id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "var(--color-text)" }}>{d.title}</td>
                  <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-secondary)" }}>{d.category}</span></td>
                  <td className="px-5 py-3" style={{ color: "var(--color-muted)" }}>{d.source}</td>
                  <td className="px-5 py-3" style={{ color: "var(--color-muted-light)" }}>{d.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === "queries" && (
        <div className="space-y-3 animate-fade-in">
          {queries.length === 0 && (
            <div className="rounded-xl border p-8 text-center" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
              <Brain className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-muted)" }} />
              <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>No AI queries yet</p>
            </div>
          )}
          {queries.map((q: any) => (
            <div key={q.query_id} className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-secondary)" }}>{q.language}</span>
                <span className="text-[11px]" style={{ color: "var(--color-muted-light)" }}>{q.created_at ? new Date(q.created_at).toLocaleDateString() : ""}</span>
              </div>
              <p className="text-[14px] font-medium" style={{ color: "var(--color-text)" }}>{q.question}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === "activity" && (
        <div className="animate-fade-in">
          <div className="rounded-xl border p-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
            <h3 className="text-[15px] font-semibold mb-4" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--color-text)" }}>Recent Activity</h3>
            <div className="space-y-3">
              {[
                { time: "Now", action: `${users.length} users registered`, icon: Users },
                { time: "Now", action: `${bloodBanks.length} blood banks in system`, icon: Droplets },
                { time: "Now", action: `${documents.length} documents in knowledge base`, icon: Database },
                { time: "Now", action: `${queries.length} AI queries processed`, icon: Brain },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--color-sage-light)" }}>
                  <item.icon className="w-4 h-4 shrink-0" style={{ color: "var(--color-secondary)" }} />
                  <p className="text-[13px] flex-1" style={{ color: "var(--color-text)" }}>{item.action}</p>
                  <span className="text-[11px] flex items-center gap-1 shrink-0" style={{ color: "var(--color-muted-light)" }}>
                    <Clock className="w-3 h-3" /> {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
