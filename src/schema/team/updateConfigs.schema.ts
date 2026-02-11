import z from "zod";

export const updateConfigsSchema = z.object({
    configs: z.record(z.string(), z.unknown())
})