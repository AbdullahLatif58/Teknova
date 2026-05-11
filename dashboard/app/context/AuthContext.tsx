'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getProfile, loginUser, logoutUser } from "@/app/api/auth/api"; // Corrected path
import { useRouter, useSearchParams } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  // any extra fields you need
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const refresh = async () => {
    try {
      const res = await getProfile();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error("Auth refresh failed:", err);
    }
  };

  useEffect(() => {
    const hasToken = document.cookie.split('; ').some(row => row.trim().startsWith('accessToken='));
    if (hasToken) {
      refresh();
    }
  }, []);

  const login = async (email: string, password: string) => {
    await loginUser({ email, password });
    await refresh();
    router.push("/dashboard");
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
