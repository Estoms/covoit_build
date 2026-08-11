import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/** Limite generale sur toute l'API pour attenuer les abus/DoS applicatifs. */
export const generalLimiter = rateLimit({
  windowMs: env.rateLimitGeneralWindowMinutes * 60 * 1000,
  limit: env.rateLimitGeneralPerWindow,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "RATE_LIMITED", message: "Trop de requetes, reessaie plus tard." },
});

/** Limite stricte sur la demande de code OTP (par IP), pour empecher le spam SMS. */
export const otpRequestLimiter = rateLimit({
  windowMs: env.rateLimitOtpWindowMinutes * 60 * 1000,
  limit: env.rateLimitOtpPerWindow,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "RATE_LIMITED", message: "Trop de demandes de code. Reessaie dans quelques minutes." },
});

/** Limite sur les tentatives de connexion (par IP), en complement du verrouillage par compte. */
export const loginLimiter = rateLimit({
  windowMs: env.rateLimitLoginWindowMinutes * 60 * 1000,
  limit: env.rateLimitLoginPerWindow,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "RATE_LIMITED", message: "Trop de tentatives de connexion depuis cette adresse. Reessaie plus tard." },
});
