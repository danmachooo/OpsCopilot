import z from "zod";    

export const onboardTeamSchema = z.object({
  name: z.coerce.string().min(1, "Team name is required"),
  slackWebhookUrl: z.string()
    .trim()
    .url({ message: "Slack webhook must be a valid URL" }) 
    .optional()
    .or(z.literal("")),
  configs: z.record(z.string(), z.unknown()).optional().default({}),
  provisionGithub: z.boolean().optional().default(true),
});