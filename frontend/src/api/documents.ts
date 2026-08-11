import { api } from "./client";

export type DocumentKind = "ID_CARD" | "DRIVER_LICENSE" | "CRIMINAL_RECORD";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Televerse un document sensible (piece d'identite, permis, casier judiciaire)
 * vers le stockage prive du backend et renvoie une reference opaque
 * (documentId) a associer au profil. Le fichier n'est jamais expose par une
 * URL publique ni stocke tel quel en base de donnees.
 */
export async function uploadDocument(kind: DocumentKind, file: File): Promise<string> {
  const base64Data = await readFileAsBase64(file);
  const { documentId } = await api.post<{ documentId: string }>("/documents", {
    kind,
    mimeType: file.type,
    base64Data,
  });
  return documentId;
}

/** URL authentifiee (le navigateur doit envoyer le jeton) pour prévisualiser un document déjà envoyé. */
export function documentPreviewPath(documentId: string) {
  return `/documents/${documentId}`;
}

/** Variante quand on a deja les octets en data URL (ex: capture camera) plutot qu'un File. */
export async function uploadDocumentFromDataUrl(kind: DocumentKind, dataUrl: string, mimeType = "image/jpeg"): Promise<string> {
  const { documentId } = await api.post<{ documentId: string }>("/documents", {
    kind,
    mimeType,
    base64Data: dataUrl,
  });
  return documentId;
}
