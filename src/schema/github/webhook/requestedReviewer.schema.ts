import z from "zod";

export const requestedReviewerSchema = z.object({
  login: z.string(),
  id: z.coerce.number(),
  type: z.enum(["User", "Team"]).optional(),
  slug: z.string().optional(), // For teams
});