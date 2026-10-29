import { z } from "zod";

export const FormOprecAnnounceSchema = z.object({
  nrp: z
    .string()
    .min(10, "NRP must be at least 10 characters long")
    .max(10, "NRP must be 10 characters long"),
});
