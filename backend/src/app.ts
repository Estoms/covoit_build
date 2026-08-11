import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "express-async-errors";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error";
import { generalLimiter } from "./middleware/rateLimit";

import { authRouter } from "./modules/auth/routes";
import { usersRouter } from "./modules/users/routes";
import { verificationsRouter } from "./modules/verifications/routes";
import { tripsRouter } from "./modules/trips/routes";
import { bookingsRouter } from "./modules/bookings/routes";
import { walletRouter } from "./modules/wallet/routes";
import { messagingRouter } from "./modules/messaging/routes";
import { reviewsRouter } from "./modules/reviews/routes";
import { loyaltyRouter } from "./modules/loyalty/routes";
import { driverRewardsRouter } from "./modules/driverRewards/routes";
import { adminRouter } from "./modules/admin/routes";
import { supportRouter } from "./modules/support/routes";
import { notificationsRouter } from "./modules/notifications/routes";
import { documentsRouter } from "./modules/documents/routes";

export function createApp() {
  const app = express();

  // Securite HTTP de base (en-tetes anti-clickjacking, no-sniff, etc.)
  app.use(helmet());
  app.disable("x-powered-by");

  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(cookieParser());

  // On conserve le corps brut de la requete pour pouvoir verifier la signature
  // HMAC des webhooks (ex: Mobile Money) sur les octets exacts recus.
  app.use(
    express.json({
      limit: "10mb",
      verify: (req, _res, buf) => {
        (req as express.Request & { rawBody?: Buffer }).rawBody = buf;
      },
    })
  );

  app.use(generalLimiter);

  app.get("/health", (_req, res) => res.json({ ok: true, service: "mobibenin-backend" }));

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/verifications", verificationsRouter);
  app.use("/trips", tripsRouter);
  app.use("/bookings", bookingsRouter);
  app.use("/wallet", walletRouter);
  app.use("/messaging", messagingRouter);
  app.use("/reviews", reviewsRouter);
  app.use("/loyalty", loyaltyRouter);
  app.use("/driver-rewards", driverRewardsRouter);
  app.use("/admin", adminRouter);
  app.use("/support", supportRouter);
  app.use("/notifications", notificationsRouter);
  app.use("/documents", documentsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
