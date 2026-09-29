"use client";

export default function Footer() {
  return (
    <footer className="border-t py-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[12px]" style={{ color: "var(--color-muted-light)" }}>© 2026 Nexora. All rights reserved.</p>
        <div className="flex items-center gap-5 text-[12px]" style={{ color: "var(--color-muted-light)" }}>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span style={{ color: "var(--color-border)" }}>|</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span style={{ color: "var(--color-border)" }}>|</span>
          <span className="hover:underline cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
}
