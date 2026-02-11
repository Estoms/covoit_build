import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { type Role, useAuth } from "./AuthContext";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: Role[];
}) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.emailVerified === false) {
    return <Navigate to="/verify-email" replace state={{ from: location.pathname }} />;
  }

  if (roles && roles.length > 0) {
    const userRoles = user.roles ?? [];
    const ok = userRoles.some((r) => roles.includes(r));
    if (!ok) return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}