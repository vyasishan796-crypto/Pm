"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User, ArrowRight, ShieldCheck, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { MountainBackground } from "@/components/ui/Botanical";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#DC2626", "#CA8A04", "#2563EB", "#16A34A"];

  if (!password) return null;

  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ backgroundColor: i <= strength ? colors[strength] : "var(--color-border)" }} />
        ))}
      </div>
      <p className="text-[10px] font-medium" style={{ color: colors[strength] }}>{labels[strength]}</p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email format";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name, email, password);
      toast("success", "Account created successfully! Redirecting...");
      setTimeout(() => router.push("/"), 600);
    } catch (err: any) {
      toast("error", err?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden" style={{ backgroundColor: "var(--color-sage)" }}>
        <MountainBackground className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-[18px] font-bold" style={{ color: "var(--color-primary-dark)" }}>Prakriti</span>
          </div>
          <div>
            <h2 className="text-[28px] font-bold leading-tight mb-3" style={{ color: "var(--color-primary-dark)" }}>
              Begin your journey<br />of knowledge<br />discovery
            </h2>
            <p className="text-[14px] leading-relaxed max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
              Join thousands of researchers and innovators protecting traditional knowledge with AI.
            </p>
          </div>
          <blockquote className="text-[12px] italic leading-relaxed max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
            &ldquo;Knowledge is the currency of the future.&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10" style={{ backgroundColor: "var(--color-background)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-[16px] font-bold" style={{ color: "var(--color-text)" }}>Prakriti</span>
          </div>

          <h1 className="text-[26px] font-bold mb-1" style={{ color: "var(--color-text)" }}>Create Your Account</h1>
          <p className="text-[13px] mb-6" style={{ color: "var(--color-text-secondary)" }}>Start protecting traditional knowledge today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" icon={<User className="w-4 h-4" />} value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
            <Input label="Email Address" type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <div>
              <PasswordInput label="Password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
              <PasswordStrength password={password} />
              {password && (
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {checks.map((c) => (
                    <span key={c.label} className="flex items-center gap-1 text-[10px]" style={{ color: c.met ? "#16A34A" : "var(--color-muted-light)" }}>
                      {c.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {c.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <PasswordInput label="Confirm Password" placeholder="Re-enter your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-[12px] mt-5" style={{ color: "var(--color-text-secondary)" }}>
            Already have an account? <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
