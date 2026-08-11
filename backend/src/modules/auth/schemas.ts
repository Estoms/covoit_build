import { z } from "zod";

export const requestOtpSchema = z.object({
  phone: z.string().min(8),
  purpose: z.enum(["REGISTER", "LOGIN"]).default("REGISTER"),
});

export const registerSchema = z.object({
  phone: z.string().min(8),
  otp: z.string().length(6),
  fullName: z.string().min(2),
  password: z.string().min(8).max(128),
  roles: z.array(z.enum(["PASSENGER", "DRIVER"])).min(1),
  email: z.string().email().optional(),
  // Passager
  npi: z.string().min(4).optional(),
  idCardDocumentId: z.string().optional(),
  address: z.string().optional(),
  // Conducteur
  vehicleType: z.string().optional(),
  vehiclePlate: z.string().optional(),
  licenseDocumentId: z.string().optional(),
  nip: z.string().optional(),
});

export const loginSchema = z.object({
  phone: z.string().min(8),
  password: z.string().min(1).max(128),
});
