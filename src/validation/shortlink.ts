import { z } from "zod";

export const FormShortLinkSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  original_link: z.string().min(1, {
    message: "Original Link is required.",
  }),
  shorten_link: z.string().min(1, {
    message: "Shorten Link is required.",
  }),
});
