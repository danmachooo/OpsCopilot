/*
  Warnings:

  - A unique constraint covering the columns `[teamId,fullName]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('OWNER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "PullRequest" DROP CONSTRAINT "PullRequest_repoId_fkey";

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "teamId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slackWebhookUrlEnc" TEXT NOT NULL,
    "githubWebhookSecretEnc" TEXT NOT NULL,
    "configs" JSONB NOT NULL DEFAULT '{}',
    "lastGithubEventAt" TIMESTAMP(3),
    "lastSlackSentAt" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "githubOrgId" INTEGER,
    "githubOrgLogin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Team_ownerId_idx" ON "Team"("ownerId");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- CreateIndex
CREATE INDEX "PullRequest_repoId_idx" ON "PullRequest"("repoId");

-- CreateIndex
CREATE INDEX "Repository_teamId_idx" ON "Repository"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_teamId_fullName_key" ON "Repository"("teamId", "fullName");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
