// src/routes.ts
import { Router } from "express";
import express from "express";
import { githubWebhookHandler } from "../webhooks/github";

const router = Router();

router.post(
  "/github",
  express.raw({ type: "application/json" }),
  githubWebhookHandler
);

export default router;
