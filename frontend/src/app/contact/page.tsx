"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/contact", { name, email, message });
      toast("success", "Message sent! We'll get back to you soon.");
      setName(""); setEmail(""); setMessage("");
    } catch (err: any) {
      toast("error", err?.response?.data?.detail || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, title: "Email", value: "hello@prakriti.ai", link: "mailto:hello@prakriti.ai" },
    { icon: <Phone className="w-5 h-5" />, title: "Phone", value: "+91 11 4567 8900", link: "tel:+911145678900" },
    { icon: <MapPin className="w-5 h-5" />, title: "Location", value: "New Delhi, India", link: "#" },
    { icon: <Clock className="w-5 h-5" />, title: "Working Hours", value: "Mon - Fri, 9AM - 6PM IST", link: "#" },
  ];

  return (
    <div className="h-full overflow-y-auto p-5 lg:p-8 max-w-5xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[26px] lg:text-[30px] font-bold mb-1" style={{ color: "var(--color-text)" }}>Get in Touch</h1>
        <p className="text-[13px] mb-8" style={{ color: "var(--color-text-secondary)" }}>We&apos;re here to help. Reach out to us anytime.</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {contactInfo.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
              <Card padding="md" hover>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sage)", color: "var(--color-primary)" }}>{c.icon}</div>
                  <div>
                    <h4 className="text-[13px] font-semibold" style={{ color: "var(--color-text)" }}>{c.title}</h4>
                    <a href={c.link} className="text-[12px] hover:underline" style={{ color: "var(--color-text-secondary)" }}>{c.value}</a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="lg:col-span-3">
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              <h3 className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>Send a Message</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Your Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
              <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--color-text)" }}>Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-[10px] border text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  style={{ borderColor: errors.message ? "var(--color-error)" : "var(--color-border)", color: "var(--color-text)", backgroundColor: "var(--color-card)" }} />
                {errors.message && <p className="text-[11px] mt-1" style={{ color: "var(--color-error)" }}>{errors.message}</p>}
              </div>
              <Button type="submit" loading={loading} className="w-full" icon={<Send className="w-4 h-4" />}>Send Message</Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
