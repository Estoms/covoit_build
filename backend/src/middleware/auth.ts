import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt";
import { ApiError } from "./error";
import type { RoleName } from "@prisma/client";

export type AuthedRequest = Request & {
  auth?: { userId: string; roles: RoleName[] };
};

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentification requise.");
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, roles: payload.roles as RoleName[] };
    next();
  } catch {
    throw new ApiError(401, "Jeton invalide ou expire.");
  }
}

export function requireRoles(...roles: RoleName[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    const userRoles = req.auth?.roles ?? [];
    if (!roles.some((r) => userRoles.includes(r))) {
      throw new ApiError(403, "Acces refuse pour ce role.");
    }
    next();
  };
}
