import { api } from "./client";
import type { DriverProfileDTO } from "../types";

export function getMyVerifications() {
  return api.get<{
    passenger: { npi?: string; idCardDocumentId?: string; complete: boolean } | null;
    driver: DriverProfileDTO | null;
  }>("/verifications/me");
}

export function submitCriminalRecord(documentId: string) {
  return api.post("/verifications/driver/criminal-record", { documentId });
}

export function adminVerificationQueue() {
  return api.get<{ items: DriverProfileDTO[] }>("/verifications/admin/queue");
}

export function adminDecideVerification(driverUserId: string, approve: boolean, reason?: string) {
  return api.post(`/verifications/admin/${driverUserId}/decision`, { approve, reason });
}

export function setPayoutMode(payoutModePreference: "ADVANCE_THEN_FINAL" | "FULL_AT_END") {
  return api.patch("/verifications/driver/payout-mode", { payoutModePreference });
}

export function updateVehicle(input: { vehicleType?: string; vehiclePlate?: string; licenseDocumentId?: string }) {
  return api.patch("/verifications/driver/vehicle", input);
}
