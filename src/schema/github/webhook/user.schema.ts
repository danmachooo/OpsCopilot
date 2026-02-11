import { z } from "zod";

export const userSchema = z.object({
  login: z.string(),
  id: z.coerce.number(),
  avatar_url: z.string(),
  type: z.enum(["User", "Team", "Bot", "Organization"]),
});