import { z } from "zod";

export const FormOprecAnnounceSchema = z.object({
  nrp: z
    .string()
    .min(1, "Student ID is required")
    .min(8, "Student ID must be at least 8 characters")
    .regex(/^[0-9]+$/, "Student ID must contain only numbers"),
});
