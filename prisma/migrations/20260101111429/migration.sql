/*
  Warnings:

  - You are about to drop the column `alertedAt` on the `PullRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PullRequest" DROP COLUMN "alertedAt",
ADD COLUMN     "staleAlertAt" TIMESTAMP(3);
