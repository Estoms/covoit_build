import crypto from "node:crypto";
import { prisma } from "../../lib/prisma";
import { generateOpaqueToken, sha256Hex } from "../../lib/crypto";
import { env } from "../../config/env";
import { ApiError } from "../../middleware/error";

type IssueContext = { userAgent?: string; ipAddress?: string };

/** Demarre une nouvelle "famille" de jetons (nouvelle connexion). */
export async function issueRefreshToken(userId: string, ctx: IssueContext = {}) {
  const token = generateOpaqueToken();
  const familyId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: sha256Hex(token),
      familyId,
      expiresAt,
      userAgent: ctx.userAgent,
      ipAddress: ctx.ipAddress,
    },
  });

  return token;
}

/**
 * Verifie un jeton de rafraichissement, le fait tourner (rotation) et renvoie
 * un nouveau jeton pour la meme famille. Si le jeton presente a deja ete
 * marque "remplace" (donc potentiellement vole et reutilise), on revoque toute
 * la famille par precaution et on rejette la requete.
 */
export async function rotateRefreshToken(rawToken: string, ctx: IssueContext = {}) {
  const tokenHash = sha256Hex(rawToken);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing) {
    throw new ApiError(401, "Session invalide, reconnecte-toi.");
  }

  if (existing.revokedAt) {
    // Le jeton avait deja ete utilise/revoque : possible vol -> on coupe toute la famille.
    await prisma.refreshToken.updateMany({
      where: { familyId: existing.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new ApiError(401, "Session compromise detectee, toutes tes sessions ont ete deconnectees. Reconnecte-toi.");
  }

  if (existing.expiresAt < new Date()) {
    throw new ApiError(401, "Session expiree, reconnecte-toi.");
  }

  const newToken = generateOpaqueToken();
  const newHash = sha256Hex(newToken);
  const expiresAt = new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date(), replacedByHash: newHash },
    }),
    prisma.refreshToken.create({
      data: {
        userId: existing.userId,
        tokenHash: newHash,
        familyId: existing.familyId,
        expiresAt,
        userAgent: ctx.userAgent,
        ipAddress: ctx.ipAddress,
      },
    }),
  ]);

  return { userId: existing.userId, token: newToken };
}

export async function revokeRefreshToken(rawToken: string) {
  const tokenHash = sha256Hex(rawToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserSessions(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
