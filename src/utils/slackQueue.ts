/**
 * Per-webhook promise chains used to serialize async tasks.
 *
 * Keyed by webhook URL to ensure that tasks targeting the same
 * webhook execute sequentially, while different webhooks can
 * execute concurrently.
 *
 * This prevents race conditions and rate-limit bursts when
 * sending messages to external services (e.g. Slack).
 */
const chains = new Map<string, Promise<unknown>>();

/**
 * Enqueues an asynchronous task to be executed sequentially
 * for a given webhook URL.
 *
 * Behavior:
 * - Tasks for the same `webhookUrl` are executed one after another
 *   in the order they were enqueued.
 * - Tasks for different webhook URLs run concurrently.
 * - Errors from previous tasks are swallowed to avoid breaking
 *   the execution chain.
 *
 * Typical use case:
 * - Serializing Slack webhook calls to prevent rate limiting
 *   and message ordering issues.
 *
 * Example:
 * ```ts
 * await enqueueWebhook(slackUrl, () => sendSlackMessage(payload));
 * ```
 *
 * @typeParam T - The resolved return type of the task.
 *
 * @param webhookUrl - Identifier used to group and serialize tasks
 *                     (typically a Slack webhook URL).
 * @param task - Async function representing the work to execute.
 *
 * @returns A promise that resolves or rejects with the result of `task`.
 */
export function enqueueWebhook<T>(
  webhookUrl: string,
  task: () => Promise<T>,
): Promise<T> {
  const prev = chains.get(webhookUrl) ?? Promise.resolve();

  // Ensure the chain continues even if the previous task failed
  const next = prev.catch(() => {}).then(task);

  chains.set(webhookUrl, next as Promise<unknown>);
  return next;
}
