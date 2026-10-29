import { z } from "zod";

export const GalaDinnerRsvpSchema = z
  .object({
    category: z.enum(["delegates", "petrolida", "spe", "lovol"]),
    full_name: z.string().min(1, "Full name is required"),
    institution_or_university: z.string().optional(),
    competition: z.string().optional(),
    team_name: z.string().optional(),
    attendance_confirmation: z.enum(["attend", "unable_to_attend"]),
    petrolida_role: z.string().optional(),
    petrolida_division: z.string().optional(),
    spe_role: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.category === "delegates") {
      for (const field of [
        "institution_or_university",
        "competition",
        "team_name",
      ] as const) {
        if (!data[field]?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: "Required for delegates",
          });
        }
      }
    }

    if (data.category === "petrolida" && !data.petrolida_role?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["petrolida_role"],
        message: "Petrolida role is required",
      });
    }

    if (
      data.category === "petrolida" &&
      data.petrolida_role === "HoD" &&
      !data.petrolida_division?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["petrolida_division"],
        message: "Division is required for HoD",
      });
    }

    if (data.category === "spe" && !data.spe_role?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["spe_role"],
        message: "SPE role is required",
      });
    }
  });

export type GalaDinnerRsvpForm = z.infer<typeof GalaDinnerRsvpSchema>;
