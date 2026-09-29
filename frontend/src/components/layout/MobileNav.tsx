"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquarePlus, Clock, BookOpen, Settings } from "lucide-react";
import { classNames } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/new-query", label: "New Query", icon: MessageSquarePlus },
  { href: "/history", label: "History", icon: Clock },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-2 pb-safe" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border-light)" }}>
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              aria-current={active ? "page" : undefined}
              className={classNames("flex flex-col items-center gap-1 px-3 py-1.5 rounded-[10px] transition-all", active ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]")}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
