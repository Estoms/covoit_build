const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:4000";

/**
 * Le jeton d'acces (courte duree) est garde en memoire JS uniquement, jamais
 * dans localStorage/sessionStorage : ca reduit la fenetre d'exposition en cas
 * de faille XSS (un script injecte ne peut pas le lire depuis le stockage,
 * seulement s'il s'execute pendant qu'il est en memoire). Le jeton de
 * rafraichissement, lui, vit dans un cookie httpOnly pose par le serveur :
 * le JavaScript du navigateur n'y a jamais acces du tout.
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

export class ApiClientError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

let refreshPromise: Promise<boolean> | null = null;

/** Echange le cookie de rafraichissement (envoye automatiquement par le navigateur)
 * contre un nouveau jeton d'acces. Ne transporte jamais le refresh token en JS. */
async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) {
          setAccessToken(null);
          return false;
        }
        const data = await r.json();
        setAccessToken(data.accessToken);
        return true;
      })
      .catch(() => {
        setAccessToken(null);
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean; retry?: boolean } = {}
): Promise<T> {
  const { method = "GET", body, auth = true, retry = true } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include", // necessaire pour que le cookie de refresh (scope /auth) soit envoye
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(path, { ...options, retry: false });
  }

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const errBody = (data ?? {}) as { message?: string; details?: unknown };
    throw new ApiClientError(res.status, errBody.message || "Une erreur est survenue.", errBody.details);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, opts?: { auth?: boolean }) =>
    apiFetch<T>(path, { method: "POST", body, auth: opts?.auth ?? true }),
  patch: <T = unknown>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PATCH", body }),
  delete: <T = unknown>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};

/** Tente silencieusement d'obtenir un jeton d'acces au demarrage de l'app,
 * a partir du cookie de rafraichissement s'il existe encore (session persistante). */
export async function trySilentLogin(): Promise<boolean> {
  return tryRefresh();
}

export { BASE_URL };
