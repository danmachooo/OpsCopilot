import z from "zod";

export const createTeamSchema = z.object({
  name: z.coerce.string().min(1, "Team name is required"),
});
