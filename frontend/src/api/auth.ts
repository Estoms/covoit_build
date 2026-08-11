import { api } from "./client";
import type { PublicUser, Role } from "../types";

export function requestOtp(phone: string, purpose: "REGISTER" | "LOGIN" = "REGISTER") {
  return api.post<{ sent: boolean; ttlMinutes: number; devCode?: string }>("/auth/otp/request", { phone, purpose }, { auth: false });
}

export function register(input: {
  phone: string; otp: string; fullName: string; password: string; roles: ("PASSENGER" | "DRIVER")[];
  email?: string; npi?: string; idCardDocumentId?: string; address?: string;
  vehicleType?: string; vehiclePlate?: string; licenseDocumentId?: string; nip?: string;
}) {
  // Le jeton de rafraichissement est pose directement en cookie httpOnly par le
  // serveur (jamais renvoye dans le corps JSON) : seul le jeton d'acces revient ici.
  return api.post<{ user: PublicUser; accessToken: string }>("/auth/register", input, { auth: false });
}

export function login(phone: string, password: string) {
  return api.post<{ user: PublicUser; accessToken: string }>("/auth/login", { phone, password }, { auth: false });
}

export function logout() {
  return api.post<{ ok: boolean }>("/auth/logout", undefined, { auth: false });
}

export function fetchMe() {
  return api.get<{ user: PublicUser }>("/users/me");
}

export type { Role };
