"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User } from "@/types";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("prakriti_token");
    const savedUser = localStorage.getItem("prakriti_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const saveAuth = useCallback((accessToken: string, userData: User) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("prakriti_token", accessToken);
    localStorage.setItem("prakriti_user", JSON.stringify(userData));
  }, []);

  const mapUser = (data: any): User => ({
    user_id: String(data.user.user_id),
    name: data.user.name,
    email: data.user.email,
    phone: data.user.phone || null,
    role: data.user.role,
    language: data.user.language,
    created_at: new Date().toISOString(),
  });

  const login = async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });
    saveAuth(res.data.access_token, mapUser(res.data));
  };

  const register = async (name: string, email: string, password: string, role = "user") => {
    const res = await api.post("/api/auth/register", { name, email, password, role });
    saveAuth(res.data.access_token, mapUser(res.data));
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await api.post("/api/auth/google", { credential });
    saveAuth(res.data.access_token, mapUser(res.data));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("prakriti_token");
    localStorage.removeItem("prakriti_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, loginWithGoogle, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
