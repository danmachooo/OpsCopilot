import { PRStatus } from "../generated/prisma/enums";
import { PullRequestEvent } from "../schema/webhook.schema";

/**
 * Maps a GitHub Pull Request webhook payload into
 * the internal pull request representation used by the system.
 *
 * This function acts as a normalization layer between:
 * - GitHub webhook payloads (external, unstable shape)
 * - Internal database / domain models (stable shape)
 *
 * Design notes:
 * - Assumes the PR is OPEN at the time of this event
 * - Converts all GitHub timestamps into `Date` objects
 * - Normalizes reviewer identity across Users and Teams
 * - Safely handles optional and nullable GitHub fields
 *
 * Typical usage:
 * ```ts
 * const prData = mapGitHubPayload(payload);
 * await upsertPullRequest(prData);
 * ```
 *
 * @param payload - Raw GitHub pull request webhook event payload.
 *
 * @returns An object containing normalized pull request data
 *          ready for persistence or further processing.
 */
export function mapGitHubPayload(payload: PullRequestEvent) {
  const { pull_request, repository } = payload;

  return {
    /** GitHub repository ID */
    repoId: repository.id,

    /** Short repository name (e.g. "pr-daemon") */
    repoName: repository.name,

    /** Full repository name including owner (e.g. "org/pr-daemon") */
    repoFullName: repository.full_name,

    /**
     * Owning team identifier.
     *
     * NOTE:
     * This assumes `repository.owner.id` is used as the
     * team identifier in your system.
     */
    teamId: repository.owner.id,

    /** Pull request number */
    prNumber: pull_request.number,

    /** Pull request title */
    title: pull_request.title,

    /** Current PR status (defaulted to OPEN on webhook receipt) */
    status: PRStatus.OPEN,

    /**
     * Last update timestamp.
     *
     * Falls back to current time if GitHub does not provide `updated_at`.
     */
    updatedAt: pull_request.updated_at
      ? new Date(pull_request.updated_at)
      : new Date(),

    /**
     * Pull request creation timestamp.
     *
     * Only included if `created_at` exists in the payload.
     */
    ...(pull_request.created_at && {
      openedAt: new Date(pull_request.created_at),
    }),

    /**
     * Pull request close timestamp.
     *
     * Null if the PR is still open.
     */
    closedAt: pull_request.closed_at ? new Date(pull_request.closed_at) : null,

    /**
     * Timestamp of the most recent commit.
     *
     * Currently derived from `updated_at`.
     */
    lastCommitAt: new Date(pull_request.updated_at),

    /**
     * Requested reviewers for the pull request.
     *
     * Notes:
     * - Handles both User and Team reviewers
     * - Normalizes missing fields with safe defaults
     * - Requested reviewers have not submitted reviews yet
     */
    reviewers: (pull_request.requested_reviewers ?? []).map((r) => ({
      /** GitHub reviewer ID */
      id: r.id,

      /**
       * Reviewer identifier used for display and alerts.
       *
       * - Team reviewers use `slug`
       * - User reviewers use `login`
       */
      login:
        r.type === "Team"
          ? (r.slug ?? "unknown-team")
          : (r.login ?? "unknown-user"),

      /** Reviewer type ("User" | "Team") */
      type: r.type ?? "User",

      /** Review submission timestamp (null for requested reviewers) */
      submittedAt: null,

      /** Review state (null until a review is submitted) */
      state: null,

      /** Optional team slug (only present for team reviewers) */
      ...(r.slug && { slug: r.slug }),
    })),
  };
}
