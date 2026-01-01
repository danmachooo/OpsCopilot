-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN     "lastReviewAt" TIMESTAMP(3),
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unreviewedAlertAt" TIMESTAMP(3);
