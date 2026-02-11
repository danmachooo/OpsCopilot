import z from "zod";

export const updateSlackSchema = z.object({
    slackWebhookUrl: z.string().url("Invalid url").refine((u) => 
        u.startsWith("https://hooks.slack.com/services/"), "Invalid slack webhook url"
    ) 
}) 