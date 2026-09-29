"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { MountainBackground } from "@/components/ui/Botanical";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const googleEnabled = googleClientId.length > 0 && !googleClientId.includes("YOUR_GOOGLE_CLIENT_ID");

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const handleGoogleResponse = useCallback(
    async (response: any) => {
      setGoogleLoading(true);
      try {
        await loginWithGoogle(response.credential);
        toast("success", "Google login successful!");
        router.push("/");
      } catch (err: any) {
        toast("error", err?.response?.data?.detail || "Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    [loginWithGoogle, toast, router]
  );

  const initGoogle = useCallback(() => {
    if (!googleEnabled || !window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleResponse,
    });
  }, [googleEnabled, googleClientId, handleGoogleResponse]);

  const triggerGoogleLogin = () => {
    if (!googleEnabled) {
      toast("error", "Google login not configured. Add a real NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local");
      return;
    }
    if (!window.google?.accounts?.id) {
      toast("error", "Google sign-in is still loading. Please try again in a moment.");
      return;
    }
    window.google.accounts.id.prompt();
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email format";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast("success", "Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 600);
    } catch (err: any) {
      toast("error", err?.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {googleEnabled && (
        <Script
          id="google-identity-services"
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onReady={initGoogle}
          onError={() => toast("error", "Could not load Google sign-in. Please use email and password.")}
        />
      )}
      <div className="min-h-screen flex">
      {/* Left - Nature background */}
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
              Unlock the power<br />of traditional<br />knowledge
            </h2>
            <p className="text-[14px] leading-relaxed max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
              AI-powered guidance for intellectual property protection and traditional knowledge documentation.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Trusted by 10,000+ users</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Secure & encrypted</span>
          </div>
        </div>
      </div>

      {/* Right - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10" style={{ backgroundColor: "var(--color-background)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-[16px] font-bold" style={{ color: "var(--color-text)" }}>Prakriti</span>
          </div>

          <h1 className="text-[26px] font-bold mb-1" style={{ color: "var(--color-text)" }}>Welcome Back</h1>
          <p className="text-[13px] mb-6" style={{ color: "var(--color-text-secondary)" }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <PasswordInput label="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]" />
                <span className="text-[12px]" style={{ color: "var(--color-text-secondary)" }}>Remember me</span>
              </label>
              <Link href="#" className="text-[12px] font-medium hover:underline" style={{ color: "var(--color-primary)" }}>Forgot password?</Link>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Login <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--color-muted)" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
            <button
              onClick={triggerGoogleLogin}
              disabled={googleLoading || !googleEnabled}
              title={googleEnabled ? "Sign in with Google" : "Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local to enable"}
              className="flex items-center justify-center gap-2 h-11 rounded-[10px] border text-[13px] font-medium transition-all hover:bg-[var(--color-sage)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>
          </div>

          <p className="text-center text-[12px]" style={{ color: "var(--color-text-secondary)" }}>
            Don&apos;t have an account? <Link href="/auth/register" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>Sign up</Link>
          </p>
        </motion.div>
      </div>
      </div>
    </>
  );
}
