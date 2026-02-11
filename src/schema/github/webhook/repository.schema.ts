import z from "zod";
import { userSchema } from "./user.schema";

export const repositorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  full_name: z.string(),
  owner: userSchema,
  html_url: z.string(),
  description: z.string().nullable(),
  private: z.boolean(),
});