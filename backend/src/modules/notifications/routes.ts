import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../../middleware/auth";
import { listNotifications, markNotificationRead } from "./service";

export const notificationsRouter = Router();

notificationsRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const items = await listNotifications(req.auth!.userId);
  res.json({ items });
});

notificationsRouter.post("/:id/read", requireAuth, async (req: AuthedRequest, res) => {
  await markNotificationRead(req.auth!.userId, req.params.id);
  res.json({ ok: true });
});
