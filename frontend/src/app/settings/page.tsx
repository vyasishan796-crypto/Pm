"use client";
import { useState, useEffect } from "react";
import { User, Globe, Bell, Palette, Save, Check } from "lucide-react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const tabs = [
  { id: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
  { id: "language", label: "Language", icon: <Globe className="w-3.5 h-3.5" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-3.5 h-3.5" /> },
  { id: "appearance", label: "Appearance", icon: <Palette className="w-3.5 h-3.5" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lang, setLang] = useState("en");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, product: true, ai: true });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/api/users/me", { name, phone });
      toast("success", "Profile updated successfully!");
    } catch (err: any) {
      toast("error", err?.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLanguage = async () => {
    setSaving(true);
    try {
      await api.put("/api/users/me", { language: lang });
      toast("success", "Language preference saved!");
    } catch {
      toast("error", "Failed to save language preference");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-5 lg:p-8 max-w-4xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[26px] lg:text-[30px] font-bold mb-1" style={{ color: "var(--color-text)" }}>Settings</h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--color-text-secondary)" }}>Manage your account preferences</p>
      </motion.div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {activeTab === "profile" && (
          <Card padding="lg">
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                <Avatar name={name || "User"} size="lg" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>{name || "User"}</h3>
                <p className="text-[12px]" style={{ color: "var(--color-muted)" }}>{user?.email || ""}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--color-muted-light)" }}>Signed in via {user ? "local" : "unknown"}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <Button onClick={handleSaveProfile} loading={saving} icon={<Save className="w-4 h-4" />}>Save Changes</Button>
          </Card>
        )}

        {activeTab === "language" && (
          <Card padding="lg">
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--color-text)" }}>Language Preferences</h3>
            <div className="space-y-3">
              {[
                { value: "en", label: "English", native: "English" },
                { value: "hi", label: "Hindi", native: "हिन्दी" },
                { value: "sa", label: "Sanskrit", native: "संस्कृतम्" },
                { value: "bn", label: "Bengali", native: "বাংলা" },
                { value: "ta", label: "Tamil", native: "தமிழ்" },
              ].map((l) => (
                <label key={l.value} className="flex items-center gap-3 p-3 rounded-[12px] cursor-pointer transition-colors hover:bg-[var(--color-sage)]"
                  style={{ backgroundColor: lang === l.value ? "var(--color-sage)" : "transparent", border: `1px solid ${lang === l.value ? "var(--color-primary)" : "var(--color-border-light)"}` }}>
                  <input type="radio" name="lang" value={l.value} checked={lang === l.value} onChange={() => setLang(l.value)} className="accent-[var(--color-primary)]" />
                  <div className="flex-1">
                    <span className="text-[13px] font-medium" style={{ color: "var(--color-text)" }}>{l.label}</span>
                    <span className="text-[11px] ml-2" style={{ color: "var(--color-muted)" }}>{l.native}</span>
                  </div>
                  {lang === l.value && <Check className="w-4 h-4" style={{ color: "var(--color-primary)" }} />}
                </label>
              ))}
            </div>
            <div className="mt-6"><Button onClick={handleSaveLanguage} loading={saving} icon={<Save className="w-4 h-4" />}>Save Language</Button></div>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card padding="lg">
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--color-text)" }}>Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "email" as const, title: "Email Notifications", desc: "Receive updates via email" },
                { key: "product" as const, title: "Product Updates", desc: "New features and improvements" },
                { key: "ai" as const, title: "AI Response Notifications", desc: "Get notified when AI processes queries" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between p-4 rounded-[12px] border" style={{ borderColor: "var(--color-border-light)" }}>
                  <div>
                    <h4 className="text-[13px] font-medium" style={{ color: "var(--color-text)" }}>{n.title}</h4>
                    <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>{n.desc}</p>
                  </div>
                  <button onClick={() => setNotifications((p) => ({ ...p, [n.key]: !p[n.key] }))}
                    className="w-11 h-6 rounded-full transition-colors relative"
                    style={{ backgroundColor: notifications[n.key] ? "var(--color-primary)" : "var(--color-border)" }}>
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm"
                      style={{ left: notifications[n.key] ? "22px" : "2px" }} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "appearance" && (
          <Card padding="lg">
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--color-text)" }}>Appearance</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light" as const, label: "Light", icon: "☀️" },
                { value: "dark" as const, label: "Dark", icon: "🌙" },
                { value: "system" as const, label: "System", icon: "💻" },
              ].map((t) => (
                <button key={t.value} onClick={() => setTheme(t.value)}
                  className="flex flex-col items-center gap-2 p-4 rounded-[14px] border-2 transition-all"
                  style={{ borderColor: theme === t.value ? "var(--color-primary)" : "var(--color-border-light)", backgroundColor: theme === t.value ? "var(--color-sage)" : "var(--color-card)" }}>
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-[12px] font-medium" style={{ color: "var(--color-text)" }}>{t.label}</span>
                </button>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
