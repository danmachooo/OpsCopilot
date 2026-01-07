// --- Shared Types ---

import { PullRequest, Repository } from "../generated/prisma/client";
import { PRStatus } from "../generated/prisma/enums";

// Type definition for a PR that includes its parent Repository
export type PullRequestWithRepo = PullRequest & {
  repository: Repository;
};

/** * Represents the unique composite key used across most PR operations
 */
export type PullRequestIdentifier = {
  repoId: number;
  prNumber: number;
};

// --- Function Specific Types ---

export type UpsertPullRequest = PullRequestIdentifier & {
  repoName: string;
  title: string;
  status: PRStatus;
  openedAt: Date;
  closedAt?: Date | null;
  lastCommitAt?: Date | null;
};

export type ClosePullRequestInput = PullRequestIdentifier & {
  closedAt?: Date;
};
