import z from "zod";
import { reviewSchema } from "./review.schema";
import { pullRequestSchema } from "./pr.schema";
import { repositorySchema } from "./repository.schema";
import { userSchema } from "./user.schema";

export const pullRequestReviewEventSchema = z.object({
  action: z.enum(["submitted", "edited", "dismissed"]),
  review: reviewSchema,
  pull_request: pullRequestSchema,
  repository: repositorySchema,
  sender: userSchema,
});

