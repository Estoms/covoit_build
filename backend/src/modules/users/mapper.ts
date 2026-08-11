import type { DriverProfile, User, UserRole } from "@prisma/client";
import { decryptField } from "../../lib/crypto";

type UserWithRelations = User & { roles: UserRole[]; driverProfile?: DriverProfile | null };

/**
 * Le frontend raisonne avec un role compose "PASSENGER_DRIVER" pour les
 * comptes mixtes (cf. cahier des charges: "conducteurs semi-professionnels"
 * qui sont souvent aussi passagers). En base, on stocke les roles atomiques
 * PASSENGER + DRIVER ; ce mapper derive le role compose pour l'API publique.
 */
export function derivedRoles(roles: string[]): string[] {
  const has = (r: string) => roles.includes(r);
  if (has("PASSENGER") && has("DRIVER")) {
    return [...roles.filter((r) => r !== "PASSENGER" && r !== "DRIVER"), "PASSENGER_DRIVER"];
  }
  return roles;
}

export function toPublicUser(user: UserWithRelations) {
  const baseRoles = user.roles.map((r) => r.role);
  return {
    id: user.id,
    phone: user.phone,
    phoneVerified: !!user.phoneVerifiedAt,
    email: user.email,
    fullName: user.fullName,
    npi: user.npiEncrypted ? decryptField(user.npiEncrypted) : undefined,
    idCardDocumentId: user.idCardDocumentId,
    address: user.address,
    avatarUrl: user.avatarUrl,
    roles: derivedRoles(baseRoles),
    driverVerification: user.driverProfile
      ? {
          status: user.driverProfile.verificationStatus,
          criminalRecordDueAt: user.driverProfile.criminalRecordDueAt,
          criminalRecordSubmitted: !!user.driverProfile.criminalRecordSubmittedAt,
        }
      : undefined,
    createdAt: user.createdAt,
  };
}
