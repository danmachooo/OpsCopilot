import { getHoursAgo } from "../helpers/hoursAgo";
import { RequestedReviewer } from "../schema/webhook.schema";
import { SlackAlertResult, sendSlackAlert } from "../services/slack.service";
import { enqueueWebhook } from "../utils/slackQueue";
import { sleep } from "./sleep";
/**
 * Safely parse reviewers from Json field
 */
export function parseReviewers(reviewers: unknown): RequestedReviewer[] {
  return (reviewers as RequestedReviewer[]) || [];
}

/**
 * Format reviewer names for Slack mention
 */
export function formatReviewerNames(reviewers: RequestedReviewer[]): string {
  if (reviewers.length === 0) return "_None assigned_";
  return reviewers.map((r) => `@${r.login}`).join(", ");
}

/**
 * Get the last reviewer from completed reviewers history
 */
export function getLastReviewer(completedReviewers: unknown): string {
  const history = parseReviewers(completedReviewers);
  return history.length > 0
    ? (history[history.length - 1].login ?? "N/A")
    : "N/A";
}
/**
 * Format the last activity message for stalled PRs
 */
export function formatLastActivity(
  lastReviewAt: Date | null,
  lastReviewer: string,
): string {
  if (lastReviewer === "N/A") {
    return "No one has reviewed this PR yet.";
  }

  const timeAgo = lastReviewAt ? getHoursAgo(lastReviewAt) : "Unknown";
  return `${timeAgo} ago by *${lastReviewer}`;
}

/**
 * Create a formatted Slack PR link
 */
export function formatPRLink(prNumber: number, title: string): string {
  return `*< Pull Request | #${prNumber} – ${title}>*`;
}

/**
 * Format opened date with hours ago
 */
export function formatOpenedDate(openedAt: Date): string {
  return `${openedAt.toLocaleDateString()} (${getHoursAgo(openedAt)})`;
}

/**
 *
 * @param slackWebhookUrl The decrypted webhook url
 * @param message The message to be dispatched
 * @returns Returns status and attempts
 */
export async function sendQueued(
  slackWebhookUrl: string,
  message: string,
): Promise<SlackAlertResult> {
  return enqueueWebhook(slackWebhookUrl, async () => {
    const res = await sendSlackAlert(message, { webhookUrl: slackWebhookUrl });
    await sleep(500); // pacing
    return res;
  });
}
