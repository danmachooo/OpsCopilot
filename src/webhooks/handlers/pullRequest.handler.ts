import { PRStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  upsertPullRequest,
  resetPullRequestAlerts,
  closePullRequest,
  incrementReviewCount,
} from "../../services/pullRequest.service";
import { UpsertPullRequest } from "../../services/types";
import Logger from "../../utils/logger";
import {
  PullRequestReviewWebhookPayload,
  PullRequestWebhookPayload,
} from "./types";

export async function handlePullRequestEvent(
  payload: PullRequestWebhookPayload
) {
  const { action, pull_request, repository } = payload;

  // Basic guard
  if (!pull_request || !repository) return;

  const repoId = repository.id;
  const repoName = repository.name;
  const prNumber = pull_request.number;
  const prTitle = pull_request.title ?? "No title";

  // --- 1. Handle Open/Reopen ---
  if (action === "opened" || action === "reopened") {
    const upsertData: UpsertPullRequest = {
      repoId,
      repoName,
      prNumber,
      title: prTitle,
      status: PRStatus.OPEN,
      openedAt: pull_request.created_at
        ? new Date(pull_request.created_at)
        : new Date(),
      closedAt: pull_request.closed_at
        ? new Date(pull_request.closed_at)
        : null,
      lastCommitAt: new Date(),
    };

    await upsertPullRequest(upsertData);
  }

  // --- 2. Handle Code Updates (Synchronize) ---
  if (action === "synchronize") {
    await prisma.pullRequest.update({
      where: { repoId_prNumber: { repoId, prNumber } },
      data: {
        lastCommitAt: new Date(),
        stalledAlertAt: null,
      },
    });
  }

  // --- 3. Handle Closing ---
  if (action === "closed") {
    const existingPR = await prisma.pullRequest.findUnique({
      where: { repoId_prNumber: { repoId, prNumber } },
    });

    if (!existingPR) {
      Logger.error(`PR #${prNumber} in repo ${repoName} not found in DB.`);
      return;
    }

    await closePullRequest({ repoId, prNumber });
  }

  // --- 4. Global Alert Resets ---
  if (action === "reopened" || action === "synchronize") {
    await resetPullRequestAlerts({ repoId, prNumber });
  }
}

export async function handlePullRequestReviewEvent(
  payload: PullRequestReviewWebhookPayload
) {
  const { action, pull_request, repository } = payload;
  Logger.info("Review Action: " + action);

  if (action !== "submitted") return;

  await incrementReviewCount({
    repoId: repository.id,
    prNumber: pull_request.number,
  });
}
