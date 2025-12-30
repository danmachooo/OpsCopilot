// src/webhooks/github.ts
import { Request, Response } from "express";

export const githubWebhookHandler = async (req: Request, res: Response) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  // We only care about pull_request events
  if (event !== "pull_request") {
    return res.status(200).json({ message: "Event ignored" });
  }

  const action = payload.action;
  const pr = payload.pull_request;
  const repo = payload.repository;

  if (!pr || !repo) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const prData = {
    repoId: repo.id,
    repoName: repo.name,
    prNumber: pr.number,
    title: pr.title,
    status: pr.state.toUpperCase(), // open | closed
    openedAt: pr.created_at,
    closedAt: pr.closed_at,
  };

  if (action === "opened") {
    console.log("🆕 PR OPENED:", prData);
  }

  if (action === "closed") {
    console.log("✅ PR CLOSED:", prData);
  }

  // Always respond 200 so GitHub doesn't retry
  return res.status(200).json({ received: true });
};
