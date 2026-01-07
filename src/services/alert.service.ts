import { getHoursAgo } from "../helpers/hoursAgo";
import { markStaleAlert, markUnreviewedAlert } from "./pullRequest.service";
import { sendSlackAlert } from "./slack.service";
import { PullRequestWithRepo } from "./types";

export async function alertOnStalePRs(stalePrs: PullRequestWithRepo[]) {
  for (const pr of stalePrs) {
    // If we've already alerted, skip
    if (pr.staleAlertAt) continue;

    const message =
      `*🚨 Stale Pull Request Detected*\n` +
      `*< Pull Request | #${pr.prNumber} – ${pr.title}>*\n` +
      `> *Repo:* ${pr.repository.name}\n` +
      `> *Opened:* ${pr.openedAt.toLocaleDateString()} (${getHoursAgo(
        pr.openedAt
      )})`;

    await sendSlackAlert(message);
    await markStaleAlert(pr.id);
  }
}

export async function alertOnUnreviewedPRs(prs: PullRequestWithRepo[]) {
  for (const pr of prs) {
    // Only alert if we haven't already
    if (pr.unreviewedAlertAt) continue;

    const message =
      `*👀 PR Needs Review*\n` +
      `*< Pull Request | #${pr.prNumber} – ${pr.title}>*\n` +
      `> *Repo:* ${pr.repository.name}\n` +
      `> *Status:* Awaiting first review`;

    await sendSlackAlert(message);
    await markUnreviewedAlert(pr.id);
  }
}

export async function alertOnStalledPRs(prs: PullRequestWithRepo[]) {
  for (const pr of prs) {
    // Fallback for lastReviewAt to prevent getHoursAgo from crashing
    const timeAgo = pr.lastReviewAt ? getHoursAgo(pr.lastReviewAt) : "Unknown";

    const message =
      `*🚧 PR is Stalled*\n` +
      `*< Pull Request | #${pr.prNumber} – ${pr.title}>*\n` +
      `> *Repo:* ${pr.repository.name}\n` +
      `> *Last Activity:* Reviewed ${timeAgo}\n` +
      `> *Action:* Author needs to address feedback.`;

    await sendSlackAlert(message);
    await markStaleAlert(pr.id);
  }
}
