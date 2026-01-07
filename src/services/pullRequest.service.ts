import { prisma } from "../lib/prisma";
import { PRStatus } from "../generated/prisma/enums";
import {
  PullRequestIdentifier,
  ClosePullRequestInput,
  UpsertPullRequest,
} from "./types";

// --- Service Functions ---

export async function prAlreadyExist(data: PullRequestIdentifier) {
  // Added return so the function is actually useful!
  return await prisma.pullRequest.findUnique({
    where: {
      repoId_prNumber: { repoId: data.repoId, prNumber: data.prNumber },
    },
  });
}

export async function closePullRequest(data: ClosePullRequestInput) {
  if (data.repoId === undefined || data.prNumber === undefined) {
    throw new Error(
      "repoId and prNumber are required to close a Pull Request."
    );
  }

  await prisma.pullRequest.update({
    where: {
      repoId_prNumber: {
        repoId: data.repoId,
        prNumber: data.prNumber,
      },
    },
    data: {
      status: PRStatus.CLOSED,
      closedAt: data.closedAt ?? new Date(),
      staleAlertAt: null,
      unreviewedAlertAt: null,
    },
  });
}

export async function resetPullRequestAlerts(data: PullRequestIdentifier) {
  await prisma.pullRequest.update({
    where: {
      repoId_prNumber: data,
    },
    data: {
      staleAlertAt: null,
      unreviewedAlertAt: null,
    },
  });
}

export async function upsertPullRequest(data: UpsertPullRequest) {
  // 1️⃣ Upsert repository
  await prisma.repository.upsert({
    where: { id: data.repoId },
    update: { name: data.repoName },
    create: { id: data.repoId, name: data.repoName },
  });

  // 2️⃣ Upsert pull request
  return await prisma.pullRequest.upsert({
    where: {
      repoId_prNumber: { repoId: data.repoId, prNumber: data.prNumber },
    },
    update: {
      status: data.status,
      closedAt: data.closedAt,
    },
    create: {
      repoId: data.repoId,
      prNumber: data.prNumber,
      title: data.title,
      status: data.status,
      openedAt: data.openedAt,
      closedAt: data.closedAt ?? null,
      lastCommitAt: data.lastCommitAt ?? null,
    },
  });
}

export async function incrementReviewCount(data: PullRequestIdentifier) {
  await prisma.pullRequest.update({
    where: {
      repoId_prNumber: data,
    },
    data: {
      reviewCount: { increment: 1 },
      lastReviewAt: new Date(),
    },
  });
}

export async function markUnreviewedAlert(id: number) {
  await prisma.pullRequest.update({
    where: { id },
    data: { unreviewedAlertAt: new Date() },
  });
}

export async function markStaleAlert(id: number) {
  await prisma.pullRequest.update({
    where: { id },
    data: { staleAlertAt: new Date() },
  });
}
