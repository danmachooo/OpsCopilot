import { appConfig } from "../../config/appConfig";
import { PRStatus } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
const HOURS_24 = appConfig.app._24hr;

export async function findUnreviewedPullRequests() {
  const cutoff = new Date(Date.now() - HOURS_24);
  console.log("Cutoff: ", cutoff);

  const prs = await prisma.pullRequest.findMany({
    where: {
      status: PRStatus.OPEN,
      reviewCount: 0,
    },
    include: { repository: true },
  });
  console.log("All open, unreviewed PRs: ", prs.length);

  const oldPRs = await prisma.pullRequest.findMany({
    where: {
      status: PRStatus.OPEN,
      reviewCount: 0,
      openedAt: { lte: cutoff },
    },
  });
  console.log("Old open PRs: ", oldPRs.length);

  return prs;
}
