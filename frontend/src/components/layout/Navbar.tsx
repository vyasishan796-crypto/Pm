"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Droplets, Brain, Search, User, LogOut, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { classNames } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: null },
  { href: "/ip-sakti", label: "IP-SAKTI", icon: Brain },
  { href: "/blood-finder", label: "Find Blood", icon: Droplets },
  { href: "/about", label: "About", icon: Info },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-green-600 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                NEX<span className="text-red-600">ORA</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={classNames(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user?.role === "admin" ? "/admin" : "/blood-bank"}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <User className="w-4 h-4" />
                  {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={classNames(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                  pathname === link.href
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600">
                    Login
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg text-center">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
