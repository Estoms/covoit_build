import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { loginSchema, registerSchema, requestOtpSchema } from "./schemas";
import { loginUser, refreshSession, registerUser, requestOtp } from "./service";
import { revokeRefreshToken } from "./refreshTokens";
import { ApiError } from "../../middleware/error";
import { toPublicUser } from "../users/mapper";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import type { Request, Response } from "express";
import { otpRequestLimiter, loginLimiter } from "../../middleware/rateLimit";

export const authRouter = Router();

function requestCtx(req: Request) {
  return { userAgent: req.headers["user-agent"], ipAddress: req.ip };
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(env.refreshCookieName, token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    domain: env.cookieDomain,
    path: "/auth",
    maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(env.refreshCookieName, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    domain: env.cookieDomain,
    path: "/auth",
  });
}

authRouter.post("/otp/request", otpRequestLimiter, validateBody(requestOtpSchema), async (req, res) => {
  const { phone, purpose } = req.body;
  const result = await requestOtp(phone, purpose);
  res.json(result);
});

authRouter.post("/register", validateBody(registerSchema), async (req, res) => {
  const result = await registerUser(req.body, requestCtx(req));
  const full = await prisma.user.findUnique({ where: { id: result.user.id }, include: { roles: true, driverProfile: true } });
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({ user: toPublicUser(full!), accessToken: result.accessToken });
});

authRouter.post("/login", loginLimiter, validateBody(loginSchema), async (req, res) => {
  const { phone, password } = req.body;
  const result = await loginUser(phone, password, requestCtx(req));
  const full = await prisma.user.findUnique({ where: { id: result.user.id }, include: { roles: true, driverProfile: true } });
  setRefreshCookie(res, result.refreshToken);
  res.json({ user: toPublicUser(full!), accessToken: result.accessToken });
});

authRouter.post("/refresh", async (req, res) => {
  const rawToken = req.cookies?.[env.refreshCookieName];
  if (!rawToken) throw new ApiError(401, "Aucune session active.");
  try {
    const result = await refreshSession(rawToken, requestCtx(req));
    setRefreshCookie(res, result.refreshToken);
    res.json({ accessToken: result.accessToken });
  } catch (err) {
    clearRefreshCookie(res);
    throw err;
  }
});

authRouter.post("/logout", async (req, res) => {
  const rawToken = req.cookies?.[env.refreshCookieName];
  if (rawToken) await revokeRefreshToken(rawToken);
  clearRefreshCookie(res);
  res.json({ ok: true });
});
