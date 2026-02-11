import z from "zod";

export const teamSchema = z.object({
  id: z.coerce.number(),
  slug: z.string(),
  name: z.string().optional(),
});