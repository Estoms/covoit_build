import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "PASSENGER" | "DRIVER" | "ADMIN" | "SUPPORT";

export type AuthUser = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  roles: Role[];
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
};

const STORAGE_KEY = "covoitbuild_auth_user";

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore session
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
