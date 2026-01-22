import { env } from "./env";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const STALL_HOURS = 48;
const MAX_ALERTS_PER_TEAM = 20;

export const appConfig = {
  app: {
    port: env.PORT,
    url: env.BASE_URL,
    nodeEnv: env.NODE_ENV,
    msPerDay: MS_PER_DAY,
    maxAlertsPerTeam: MAX_ALERTS_PER_TEAM,
  },
  thresholds: {
    staleDays: env.STALE_DAYS_DEFAULT,
    stallHours: STALL_HOURS,
  },
  database: {
    url: env.DATABASE_URL,
  },
  integrations: {
    slackWebhookUrl: env.SLACK_WEBHOOK_URL,
  },
  auth: {
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL,
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  secrets: {
    key_hex: env.SECRET_KEYS_HEX,
  },
} as const;
