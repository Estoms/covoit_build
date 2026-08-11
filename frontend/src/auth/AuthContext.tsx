/* eslint-disable react-refresh/only-export-components -- hook useAuth colocalisé avec son Provider */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PublicUser, Role } from "../types";
import { setAccessToken, trySilentLogin } from "../api/client";
import { fetchMe, logout as logoutApi } from "../api/auth";

export type { Role };
export type AuthUser = PublicUser;

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithToken: (user: AuthUser, accessToken: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { user: me } = await fetchMe();
      setUser(me);
    } catch {
      setAccessToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    // Au chargement de l'app, on tente un rafraichissement silencieux : si le
    // cookie httpOnly de session est encore valide, on obtient un nouveau
    // jeton d'acces sans redemander de mot de passe.
    (async () => {
      const ok = await trySilentLogin();
      if (ok) await refreshUser();
      setIsLoading(false);
    })();
  }, []);

  const loginWithToken = (u: AuthUser, accessToken: string) => {
    setAccessToken(accessToken);
    setUser(u);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = useMemo<AuthState>(
    () => ({ user, isAuthenticated: !!user, isLoading, loginWithToken, logout, refreshUser }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
