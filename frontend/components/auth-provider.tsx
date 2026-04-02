"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { fetchMe, login as apiLogin, register as apiRegister } from "@/lib/api";
import type { LoginRequest, RegisterRequest, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      setLoading(false);
      return;
    }
    setToken(stored);
    fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await apiLogin(payload);
    localStorage.setItem("token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const res = await apiRegister(payload);
    localStorage.setItem("token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
