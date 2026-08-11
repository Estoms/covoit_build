import crypto from "node:crypto";
import { env } from "../config/env";

/** Empreinte non-reversible (tokens de rafraichissement, codes OTP). */
export function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Comparaison en temps constant pour eviter les attaques par timing. */
export function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function generateOpaqueToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

/**
 * Chiffrement au repos (AES-256-GCM) pour les champs tres sensibles (ex: NPI).
 * La cle vient d'une variable d'environnement (32 octets, encodee en base64).
 * Format stocke : base64(iv) + ":" + base64(authTag) + ":" + base64(ciphertext)
 */
function getEncryptionKey(): Buffer {
  const key = Buffer.from(env.fieldEncryptionKey, "base64");
  if (key.length !== 32) {
    throw new Error(
      "FIELD_ENCRYPTION_KEY doit etre une cle de 32 octets encodee en base64 (ex: `openssl rand -base64 32`)."
    );
  }
  return key;
}

export function encryptField(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${ciphertext.toString("base64")}`;
}

export function decryptField(stored: string): string {
  const [ivB64, tagB64, dataB64] = stored.split(":");
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]);
  return plaintext.toString("utf8");
}

/** Signature HMAC pour verifier l'authenticite des webhooks (Mobile Money). */
export function computeHmacSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyHmacSignature(payload: string, secret: string, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = computeHmacSignature(payload, secret);
  return timingSafeEqualHex(expected, signature);
}
