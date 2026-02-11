import z from "zod";

import { userSchema } from "./user.schema";

export const reviewSchema = z.object({
  id: z.coerce.number(),
  user: userSchema,
  body: z.string().nullable(),
  state: z.enum(["approved", "changes_requested", "commented", "dismissed"]),
  submitted_at: z.string(),
});