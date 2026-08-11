import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { sendSms } from "../notifications/smsProvider";
import { signAccessToken } from "../../lib/jwt";
import { encryptField, sha256Hex } from "../../lib/crypto";
import { issueRefreshToken, rotateRefreshToken } from "./refreshTokens";
import { ApiError } from "../../middleware/error";
import type { OtpPurpose, RoleName } from "@prisma/client";

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(phone: string, purpose: string, code: string): string {
  // Le "pepper" (secret serveur) empeche de retrouver le code par simple hash
  // inverse si la base fuite ; phone+purpose evite les collisions entre demandes.
  return sha256Hex(`${env.otpPepper}:${phone}:${purpose}:${code}`);
}

export async function requestOtp(phone: string, purpose: OtpPurpose) {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + env.otpTtlMinutes * 60_000);
  await prisma.otpCode.create({
    data: {
      phone,
      codeHash: hashOtp(phone, purpose, code),
      purpose,
      expiresAt,
      maxAttempts: env.otpMaxAttempts,
    },
  });
  await sendSms(phone, `MobiBenin: votre code de verification est ${code} (valable ${env.otpTtlMinutes} min).`);
  return { sent: true, ttlMinutes: env.otpTtlMinutes, devCode: env.otpMockLog ? code : undefined };
}

export async function consumeOtp(phone: string, purpose: OtpPurpose, code: string) {
  const otp = await prisma.otpCode.findFirst({
    where: { phone, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) throw new ApiError(400, "Code de verification invalide.");
  if (otp.expiresAt < new Date()) throw new ApiError(400, "Code de verification expire.");
  if (otp.attempts >= otp.maxAttempts) {
    throw new ApiError(429, "Trop de tentatives pour ce code. Demande un nouveau code.");
  }

  const candidateHash = hashOtp(phone, purpose, code);
  if (candidateHash !== otp.codeHash) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    throw new ApiError(400, "Code de verification invalide.");
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
  return true;
}

/** Politique de mot de passe : longueur minimale + au moins une lettre et un chiffre. */
export function assertStrongPassword(password: string) {
  if (password.length < env.passwordMinLength) {
    throw new ApiError(400, `Le mot de passe doit contenir au moins ${env.passwordMinLength} caracteres.`);
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    throw new ApiError(400, "Le mot de passe doit contenir au moins une lettre et un chiffre.");
  }
}

async function issueSession(userId: string, roles: RoleName[], ctx: { userAgent?: string; ipAddress?: string }) {
  const accessToken = signAccessToken({ sub: userId, roles });
  const refreshToken = await issueRefreshToken(userId, ctx);
  return { accessToken, refreshToken };
}

export async function registerUser(
  input: {
    phone: string; otp: string; fullName: string; password: string; roles: RoleName[];
    email?: string; npi?: string; idCardDocumentId?: string; address?: string;
    vehicleType?: string; vehiclePlate?: string; licenseDocumentId?: string; nip?: string;
  },
  ctx: { userAgent?: string; ipAddress?: string }
) {
  const existing = await prisma.user.findUnique({ where: { phone: input.phone } });
  if (existing) throw new ApiError(409, "Un compte existe deja avec ce numero.");

  assertStrongPassword(input.password);
  await consumeOtp(input.phone, "REGISTER", input.otp);

  const passwordHash = await bcrypt.hash(input.password, 12);
  const isDriver = input.roles.includes("DRIVER");
  const isPassenger = input.roles.includes("PASSENGER");

  const user = await prisma.user.create({
    data: {
      phone: input.phone,
      phoneVerifiedAt: new Date(), // le SMS OTP fait office de verification d'identite basique
      fullName: input.fullName,
      passwordHash,
      email: input.email,
      npiEncrypted: isPassenger && input.npi ? encryptField(input.npi) : undefined,
      idCardDocumentId: isPassenger ? input.idCardDocumentId : undefined,
      address: input.address,
      roles: { create: input.roles.map((role) => ({ role })) },
      wallet: { create: { balanceXof: 0 } },
      loyaltyAccount: { create: {} },
    },
  });

  if (isDriver) {
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + env.criminalRecordDeadlineDays);
    await prisma.driverProfile.create({
      data: {
        userId: user.id,
        vehicleType: input.vehicleType,
        vehiclePlate: input.vehiclePlate,
        licenseDocumentId: input.licenseDocumentId,
        nip: input.nip,
        criminalRecordDueAt: dueAt,
      },
    });
    const monthKey = new Date().toISOString().slice(0, 7);
    await prisma.driverRewardProfile.create({ data: { userId: user.id, monthKey } });
    await sendSms(
      input.phone,
      `MobiBenin: n'oublie pas de fournir ton extrait de casier judiciaire avant le ${dueAt.toLocaleDateString("fr-FR")}. Un rappel te sera envoye.`
    );
  }

  const session = await issueSession(user.id, input.roles, ctx);
  return { user, ...session };
}

export async function loginUser(phone: string, password: string, ctx: { userAgent?: string; ipAddress?: string }) {
  const user = await prisma.user.findUnique({ where: { phone }, include: { roles: true } });

  // Meme message d'erreur generique dans tous les cas d'echec pour ne pas
  // permettre a un attaquant de savoir si le numero existe.
  const genericError = () => new ApiError(401, "Identifiants incorrects.");

  if (!user || user.deletedAt) throw genericError();

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60_000);
    throw new ApiError(423, `Compte temporairement verrouille suite a plusieurs echecs. Reessaie dans ${minutesLeft} min.`);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const attempts = user.failedLoginCount + 1;
    const shouldLock = attempts >= env.loginMaxAttempts;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: shouldLock ? 0 : attempts,
        lockedUntil: shouldLock ? new Date(Date.now() + env.loginLockoutMinutes * 60_000) : null,
      },
    });
    throw genericError();
  }

  if (user.failedLoginCount > 0 || user.lockedUntil) {
    await prisma.user.update({ where: { id: user.id }, data: { failedLoginCount: 0, lockedUntil: null } });
  }

  const roles = user.roles.map((r) => r.role);
  const session = await issueSession(user.id, roles, ctx);
  return { user, ...session };
}

export async function refreshSession(rawRefreshToken: string, ctx: { userAgent?: string; ipAddress?: string }) {
  const { userId, token } = await rotateRefreshToken(rawRefreshToken, ctx);
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { roles: true } });
  if (!user || user.deletedAt) throw new ApiError(401, "Utilisateur introuvable.");
  const roles = user.roles.map((r) => r.role);
  return { accessToken: signAccessToken({ sub: user.id, roles }), refreshToken: token, user };
}
