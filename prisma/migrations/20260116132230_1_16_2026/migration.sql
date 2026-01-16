-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "slackWebhookUrlEnc" DROP NOT NULL,
ALTER COLUMN "githubWebhookSecretEnc" DROP NOT NULL;
