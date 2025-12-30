// src/routes.ts
import { Router } from "express";
import { githubWebhookHandler } from "./webhooks/github";

const router = Router();

router.post("/webhooks/github", githubWebhookHandler);

export default router;
