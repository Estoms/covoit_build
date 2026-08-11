import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { encryptField } from "../src/lib/crypto";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { phone: "+22900000001" },
    update: {},
    create: {
      phone: "+22900000001",
      phoneVerifiedAt: new Date(),
      fullName: "Admin MobiBenin",
      passwordHash,
      email: "admin@mobibenin.bj",
      roles: { create: [{ role: "ADMIN" }] },
      wallet: { create: {} },
      loyaltyAccount: { create: {} },
    },
  });

  const driverUser = await prisma.user.upsert({
    where: { phone: "+22997000001" },
    update: {},
    create: {
      phone: "+22997000001",
      phoneVerifiedAt: new Date(),
      fullName: "Kossi Driver",
      passwordHash,
      roles: { create: [{ role: "DRIVER" }] },
      wallet: { create: {} },
      loyaltyAccount: { create: {} },
      driverProfile: {
        create: {
          vehicleType: "Toyota Corolla",
          vehiclePlate: "AB-1234-RB",
          criminalRecordDueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          verificationStatus: "APPROVED",
          verifiedAt: new Date(),
        },
      },
      driverRewardProfile: { create: { monthKey: new Date().toISOString().slice(0, 7), tripsThisMonth: 12, commissionRatePercent: 10.5 } },
    },
    include: { driverProfile: true },
  });

  const passengerUser = await prisma.user.upsert({
    where: { phone: "+22996000002" },
    update: {},
    create: {
      phone: "+22996000002",
      phoneVerifiedAt: new Date(),
      fullName: "Awa Passagere",
      passwordHash,
      npiEncrypted: encryptField("NPI-DEMO-0001"),
      roles: { create: [{ role: "PASSENGER" }] },
      wallet: { create: {} },
      loyaltyAccount: { create: { points: 30, completedTrips: 3 } },
    },
  });

  await prisma.trip.upsert({
    where: { id: "seed-trip-1" },
    update: {},
    create: {
      id: "seed-trip-1",
      driverId: driverUser.id,
      fromCity: "Cotonou",
      fromPoint: "Gare Jonquet",
      toCity: "Parakou",
      toPoint: "Gare routiere de Parakou",
      departAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      pricePerSeatXof: 6000,
      seatsTotal: 4,
      seatsAvailable: 4,
      vehicleLabel: "Toyota Corolla - AB-1234-RB",
    },
  });

  console.log("Seed termine.");
  console.log("Comptes de demo (mot de passe: password123):");
  console.log(` - Admin: ${admin.phone}`);
  console.log(` - Conducteur: ${driverUser.phone}`);
  console.log(` - Passager: ${passengerUser.phone}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
