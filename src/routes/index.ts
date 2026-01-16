import { Router } from "express";
import teamRoutes from "./team.route";
import webhookRoutes from "./webhook.route";

const router = Router();

router.use("/team", teamRoutes);
router.use("/webhook", webhookRoutes);

export default router;
