"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquarePlus, Clock, BookOpen, Settings, HelpCircle, ShieldCheck, Phone } from "lucide-react";
import { classNames } from "@/lib/utils";
import { BotanicalBranch } from "@/components/ui/Botanical";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/new-query", label: "New Query", icon: MessageSquarePlus },
  { href: "/history", label: "History", icon: Clock },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "About", icon: HelpCircle },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[240px] h-screen fixed left-0 top-0 z-30 border-r" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border-light)" }}>
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold leading-tight" style={{ color: "var(--color-text)" }}>Prakriti</h1>
          <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>AI Knowledge Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              aria-current={active ? "page" : undefined}
              className={classNames(
                "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-200 mb-1",
                active ? "bg-[var(--color-primary)] text-white shadow-sm" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-sage)] hover:text-[var(--color-text)]"
              )}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative mx-3 mb-4 overflow-hidden rounded-[12px]" style={{ backgroundColor: "var(--color-sage-light)" }}>
        <BotanicalBranch className="absolute -right-2 -top-4 w-20 h-24 opacity-40" />
        <div className="relative p-4">
          <p className="text-[11px] font-medium leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>Empowering traditional knowledge with modern AI</p>
        </div>
      </div>
    </aside>
  );
}
