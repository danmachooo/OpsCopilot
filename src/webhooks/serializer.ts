// src/http/serializers/team.serializer.ts
export function toTeamSafe(team: any) {
  return {
    id: team.id,
    name: team.name,
    ownerId: team.ownerId,
    githubOrgId: team.githubOrgId,
    githubOrgLogin: team.githubOrgLogin,
    configs: team.configs,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,

    // health
    lastGithubEventAt: team.lastGithubEventAt,
    lastSlackSentAt: team.lastSlackSentAt,

    // members if you included them
    members: team.members,

    // secret presence flags only
    secrets: {
      hasSlackWebhook: Boolean(team.slackWebhookUrlEnc),
      hasGithubWebhookSecret: Boolean(team.githubWebhookSecretEnc),
    },
  };
}
