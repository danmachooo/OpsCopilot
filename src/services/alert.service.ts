import { prisma } from "../lib/prisma";
import { sendSlackAlert } from "./slack.service";

export async function alertOnStalePRs(stalePrs: any[]) {
  for (const pr of stalePrs) {
    if (pr.alertedAt) continue;

    const message = `
🚨 *Stale Pull Request Detected*
• Repo: ${pr.repository.name}
• PR: #${pr.prNumber} – ${pr.title}
• Opened: ${pr.openedAt.toDateString()} 
`;

    await sendSlackAlert(message);

    await prisma.pullRequest.update({
      where: { id: pr.id },
      data: { staleAlertAt: new Date() },
    });
  }
}

export async function alertOnUnreviewedPRs(prs: any[]) {
  for (const pr of prs) {
    await sendSlackAlert(
      `👀 *Unreviewed PR*\n\n` +
        `PR #${pr.prNumber}: ${pr.title}\n` +
        `Repo: ${pr.repository.name}`
    );

    await prisma.pullRequest.update({
      where: {
        id: pr.id,
      },
      data: {
        unreviewedAlertAt: new Date(),
      },
    });
  }
}
