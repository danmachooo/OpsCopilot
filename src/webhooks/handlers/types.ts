// Define the shape of the GitHub objects we care about
type GitHubRepository = {
  id: number;
  name: string;
};

type GitHubPullRequest = {
  number: number;
  title?: string;
  created_at?: string;
  closed_at?: string | null;
};

// The actual payload types
export type PullRequestWebhookPayload = {
  action: "opened" | "reopened" | "synchronize" | "closed" | string;
  pull_request: GitHubPullRequest;
  repository: GitHubRepository;
};

export type PullRequestReviewWebhookPayload = {
  action: "submitted" | string;
  pull_request: GitHubPullRequest;
  repository: GitHubRepository;
};
