import "dotenv/config";

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Variable d'environnement manquante: ${name}`);
  return v;
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const isProduction = nodeEnv === "production";

if (isProduction) {
  // En production, on refuse de demarrer avec des secrets par defaut.
  const mustBeSet = ["JWT_ACCESS_SECRET", "MOMO_WEBHOOK_SECRET", "FIELD_ENCRYPTION_KEY", "OTP_PEPPER"];
  for (const key of mustBeSet) {
    if (!process.env[key]) {
      throw new Error(`${key} doit etre defini explicitement en production (pas de valeur par defaut).`);
    }
  }
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv,
  isProduction,
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",

  // --- JWT (jeton d'acces, courte duree) ---
  jwtAccessSecret: required("JWT_ACCESS_SECRET", "dev-access-secret-change-me"),
  jwtAccessTtl: process.env.JWT_ACCESS_TTL ?? "15m",

  // --- Jeton de rafraichissement opaque (stocke hashe en base, rotation) ---
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30),
  refreshCookieName: "mb_refresh",
  cookieSecure: isProduction,
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,

  // --- OTP ---
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES ?? 5),
  otpMockLog: (process.env.OTP_MOCK_LOG ?? "true") === "true",
  otpPepper: required("OTP_PEPPER", "dev-otp-pepper-change-me"),
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS ?? 5),

  // --- Mots de passe / verrouillage de compte ---
  passwordMinLength: Number(process.env.PASSWORD_MIN_LENGTH ?? 8),
  loginMaxAttempts: Number(process.env.LOGIN_MAX_ATTEMPTS ?? 5),
  loginLockoutMinutes: Number(process.env.LOGIN_LOCKOUT_MINUTES ?? 15),

  // --- Chiffrement au repos (NPI, etc.) ---
  fieldEncryptionKey: required("FIELD_ENCRYPTION_KEY", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="),

  // --- Mobile Money (mock) ---
  momoAutoConfirmMs: Number(process.env.MOMO_MOCK_AUTO_CONFIRM_MS ?? 4000),
  momoWebhookSecret: required("MOMO_WEBHOOK_SECRET", "dev-momo-secret-change-me"),

  // --- Stockage de documents sensibles ---
  documentsStorageDir: process.env.DOCUMENTS_STORAGE_DIR ?? "./storage/documents",
  documentsMaxSizeBytes: Number(process.env.DOCUMENTS_MAX_SIZE_BYTES ?? 8 * 1024 * 1024),

  // --- Rate limiting ---
  rateLimitOtpPerWindow: Number(process.env.RATE_LIMIT_OTP_PER_WINDOW ?? 3),
  rateLimitOtpWindowMinutes: Number(process.env.RATE_LIMIT_OTP_WINDOW_MINUTES ?? 15),
  rateLimitLoginPerWindow: Number(process.env.RATE_LIMIT_LOGIN_PER_WINDOW ?? 10),
  rateLimitLoginWindowMinutes: Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MINUTES ?? 15),
  rateLimitGeneralPerWindow: Number(process.env.RATE_LIMIT_GENERAL_PER_WINDOW ?? 300),
  rateLimitGeneralWindowMinutes: Number(process.env.RATE_LIMIT_GENERAL_WINDOW_MINUTES ?? 15),

  // --- Regles metier (inchange) ---
  commissionBasePercent: Number(process.env.COMMISSION_BASE_PERCENT ?? 12),
  commissionMinPercent: Number(process.env.COMMISSION_MIN_PERCENT ?? 8),
  cashoutFeeRatePercent: Number(process.env.CASHOUT_FEE_RATE_PERCENT ?? 1.5),
  passengerFeeSharePercent: Number(process.env.PASSENGER_FEE_SHARE_PERCENT ?? 50),
  criminalRecordDeadlineDays: Number(process.env.CRIMINAL_RECORD_DEADLINE_DAYS ?? 30),
};
