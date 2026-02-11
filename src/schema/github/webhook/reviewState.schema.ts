import z from "zod";

export const reviewStateSchema = z.enum([
    "approved",
    "change_requested",
    "commented",
    "dismissed"
])