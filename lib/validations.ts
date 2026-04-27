import { z } from "zod";

export const linkSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  url: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://",
    ),
  note: z.string().max(500, "Note must be less than 500 characters"),
});

export type LinkSchema = z.infer<typeof linkSchema>;
