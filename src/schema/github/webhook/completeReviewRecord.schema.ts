import { z } from "zod";

export const completedReviewRecordSchema = z.object({
  reviewId: z.number(),
  reviewerId: z.number(),
  reviewerLogin: z.string(),
  state: z.enum(["approved", "changes_requested", "commented", "dismissed"]),
  submittedAt: z.string(),
});
