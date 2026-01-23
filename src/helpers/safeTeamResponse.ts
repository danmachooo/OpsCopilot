import { Repository, TeamMember, Team, User } from "../generated/prisma/client";

/**
 * Team model shape including the relations needed for building a safe API response.
 *
 * This is typically used with Prisma `include`:
 * - repositories
 * - members (and each member's user subset)
 */
type TeamWithRelations = Team & {
  repositories: Repository[];
  members: (TeamMember & {
    user: Pick<User, "id" | "name" | "email" | "image">;
  })[];
};

/**
 * Safe, API-facing representation of a Team.
 *
 * This type is intentionally designed to:
 * - Include only fields safe to return to clients
 * - Exclude encrypted secrets (Slack webhook URL, GitHub webhook secret)
 * - Expose only boolean presence flags for secrets
 *
 * Notes:
 * - `configs` is cast to a JSON-like object shape for convenience.
 * - `members.user` is intentionally narrowed to a safe subset of fields.
 */
export type SafeTeamResponse = {
  /** Internal team ID */
  id: number;

  /** Human-readable team name */
  name: string;

  /** Owner user ID (auth provider/user table ID depending on your system) */
  ownerId: string;

  /** Team-level configuration blob */
  configs: Record<string, unknown>;

  /** Connected GitHub org ID (if linked) */
  githubOrgId: number | null;

  /** Connected GitHub org login (if linked) */
  githubOrgLogin: string | null;

  /** Timestamp of the most recent GitHub webhook event observed (if any) */
  lastGithubEventAt: Date | null;

  /** Timestamp of the most recent Slack alert sent (if any) */
  lastSlackSentAt: Date | null;

  /** When the team was created */
  createdAt: Date;

  /** When the team was last updated */
  updatedAt: Date;

  /** Repositories currently linked to this team */
  repositories: Repository[];

  /**
   * Team members including a safe subset of user data.
   *
   * User fields are intentionally restricted to avoid leaking sensitive fields.
   */
  members: (TeamMember & {
    user: Pick<User, "id" | "name" | "email" | "image">;
  })[];

  /**
   * Secret presence flags.
   *
   * These indicate whether secrets exist without exposing the secret values.
   */
  secrets: {
    /** True if the team has a stored Slack webhook (encrypted at rest) */
    hasSlackWebhook: boolean;

    /** True if the team has a stored GitHub webhook secret (encrypted at rest) */
    hasGithubWebhookSecret: boolean;
  };
};

/**
 * Converts a Team record (with relations) into a safe API response object.
 *
 * This function:
 * - Returns `null` if the input team is `null`
 * - Copies public fields directly
 * - Ensures relation arrays always exist
 * - Converts encrypted secret fields into boolean presence flags only
 *
 * Typical usage:
 * ```ts
 * const team = await prisma.team.findUnique({
 *   where: { id },
 *   include: { repositories: true, members: { include: { user: true } } },
 * });
 *
 * return safeTeamResponse(team);
 * ```
 *
 * @param team - Team model with required relations loaded, or null.
 * @returns Safe, client-facing Team response, or null if no team was provided.
 */
export function safeTeamResponse(
  team: TeamWithRelations | null,
): SafeTeamResponse | null {
  if (!team) return null;

  return {
    id: team.id,
    name: team.name,
    ownerId: team.ownerId,
    configs: team.configs as Record<string, unknown>,
    githubOrgId: team.githubOrgId,
    githubOrgLogin: team.githubOrgLogin,
    lastGithubEventAt: team.lastGithubEventAt,
    lastSlackSentAt: team.lastSlackSentAt,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    repositories: team.repositories ?? [],
    members: team.members ?? [],
    secrets: {
      hasSlackWebhook: Boolean(team.slackWebhookUrlEnc),
      hasGithubWebhookSecret: Boolean(team.githubWebhookSecretEnc),
    },
  };
}
