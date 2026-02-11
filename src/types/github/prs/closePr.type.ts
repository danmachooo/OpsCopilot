import { PullRequestIdentifier } from "./prIdentifier.type";

export type ClosePullRequest = PullRequestIdentifier & {
  closedAt?: Date;
};