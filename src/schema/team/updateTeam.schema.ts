import z from "zod";

export const updateTeamSchema = z.object({
    name: z.coerce.string().min(1, "Team name is required.")
})