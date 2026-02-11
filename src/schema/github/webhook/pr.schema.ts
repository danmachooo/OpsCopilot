import z from "zod";
import { userSchema } from "./user.schema";
import { requestedReviewerSchema } from "./requestedReviewer.schema";

export const pullRequestSchema = z.object({
  id: z.coerce.number(),
  number: z.coerce.number(),
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
  requested_reviewers: z.array(requestedReviewerSchema).nullable().transform(v => v ?? []),
  head: z.object({
    ref: z.string(),
    sha: z.string(),
  }),
  base: z.object({
    ref: z.string(),
    sha: z.string(),
  }),
});