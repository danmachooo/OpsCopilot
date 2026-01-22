// slackQueue.ts
const chains = new Map<string, Promise<unknown>>();

export function enqueueWebhook<T>(
  webhookUrl: string,
  task: () => Promise<T>,
): Promise<T> {
  const prev = chains.get(webhookUrl) ?? Promise.resolve();
  const next = prev.catch(() => {}).then(task);
  chains.set(webhookUrl, next as Promise<unknown>);
  return next;
}
