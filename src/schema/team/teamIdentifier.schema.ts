import { z } from "zod";

export const teamIdentifierSchema = z.object({
  id: z.coerce.number(),
});