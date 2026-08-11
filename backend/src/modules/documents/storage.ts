import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { env } from "../../config/env";

/**
 * Interface de stockage d'objets. L'implementation par defaut ecrit sur disque
 * local (pratique pour le developpement et cet environnement sans acces
 * reseau) mais est concue pour etre remplacee par un adaptateur S3/GCS/Azure
 * Blob en production sans changer le reste du code (meme forme put/get).
 */
export interface ObjectStorage {
  put(buffer: Buffer, extension: string): Promise<string>; // renvoie la storageKey
  get(storageKey: string): Promise<Buffer>;
  delete(storageKey: string): Promise<void>;
}

class LocalDiskStorage implements ObjectStorage {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  private async ensureDir() {
    await fs.mkdir(this.baseDir, { recursive: true });
  }

  private resolvePath(storageKey: string) {
    // storageKey est generee par nous (jamais fournie par le client) donc pas
    // de risque de path traversal, mais on normalise par prudence.
    const safeName = path.basename(storageKey);
    return path.join(this.baseDir, safeName);
  }

  async put(buffer: Buffer, extension: string): Promise<string> {
    await this.ensureDir();
    const storageKey = `${crypto.randomUUID()}${extension}`;
    await fs.writeFile(this.resolvePath(storageKey), buffer, { mode: 0o600 });
    return storageKey;
  }

  async get(storageKey: string): Promise<Buffer> {
    return fs.readFile(this.resolvePath(storageKey));
  }

  async delete(storageKey: string): Promise<void> {
    await fs.rm(this.resolvePath(storageKey), { force: true });
  }
}

export const objectStorage: ObjectStorage = new LocalDiskStorage(env.documentsStorageDir);

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

export function extensionForMime(mimeType: string): string {
  return MIME_EXTENSIONS[mimeType] ?? "";
}

export function isAllowedMime(mimeType: string): boolean {
  return mimeType in MIME_EXTENSIONS;
}
