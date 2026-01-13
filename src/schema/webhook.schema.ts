import { z } from "zod";

// Common schemas
const userSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
  type: z.enum(["User", "Team", "Bot", "Organization"]),
});

const requestedReviewerSchema = z.object({
  login: z.string(),
  id: z.number(),
  type: z.enum(["User", "Team"]).optional(),
  slug: z.string().optional(), // For teams
  submittedAt: z.string().nullable(),
  state: z.string().nullable(),
});

const repositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  owner: userSchema,
  html_url: z.string(),
  description: z.string().nullable(),
  private: z.boolean(),
});

const pullRequestSchema = z.object({
  id: z.number(),
  number: z.number(),
  state: z.enum(["open", "closed"]),
  title: z.string(),
  body: z.string().nullable(),
  html_url: z.string(),
  user: userSchema,
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().nullable(),
  merged_at: z.string().nullable(),
  draft: z.boolean().optional(),
  requested_reviewers: z.array(requestedReviewerSchema).default([]),
  head: z.object({
    ref: z.string(),
    sha: z.string(),
  }),
  base: z.object({
    ref: z.string(),
    sha: z.string(),
  }),
});

const reviewSchema = z.object({
  id: z.number(),
  user: userSchema,
  body: z.string().nullable(),
  state: z.enum(["approved", "changes_requested", "commented", "dismissed"]),
  submitted_at: z.string(),
});

// Pull Request Event Payload
export const pullRequestEventSchema = z.object({
  action: z.enum([
    "opened",
    "closed",
    "reopened",
    "synchronize",
    "edited",
    "assigned",
    "unassigned",
    "review_requested",
    "review_request_removed",
    "labeled",
    "unlabeled",
  ]),
  number: z.number(),
  pull_request: pullRequestSchema,
  repository: repositorySchema,
  sender: userSchema,
  requested_reviewer: userSchema.optional(),
});

// Pull Request Review Event Payload
export const pullRequestReviewEventSchema = z.object({
  action: z.enum(["submitted", "edited", "dismissed"]),
  review: reviewSchema,
  pull_request: pullRequestSchema,
  repository: repositorySchema,
  sender: userSchema,
});

// GitHub Event Header
export const githubEventHeaderSchema = z.enum([
  "pull_request",
  "pull_request_review",
  "push",
  "issues",
  "issue_comment",
  "ping",
]);

// Infer types from schemas
export type PullRequestEvent = z.infer<typeof pullRequestEventSchema>;
export type PullRequestReviewEvent = z.infer<
  typeof pullRequestReviewEventSchema
>;
export type GitHubEventType = z.infer<typeof githubEventHeaderSchema>;
export type RequestedReviewer = z.infer<typeof requestedReviewerSchema>;
