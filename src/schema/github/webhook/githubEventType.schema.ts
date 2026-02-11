import z from "zod";

export const githubEventTypeSchema = z.enum([
  "pull_request",
  "pull_request_review",
  "push",
  "issues",
  "issue_comment",
  "ping",
]);

