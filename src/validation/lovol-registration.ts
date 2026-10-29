import { REG_PHONE } from "@/constants/regex";
import { z } from "zod";

const fileValidation = z
  .any()
  .optional()
  .transform((val) => val);

export const FormLovolRegistrationSchema = z.object({
  id: z.string().optional(),
  status: z.enum(["pending", "interviewed", "accepted", "rejected"]).optional(),

  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),

  major: z.string().min(1, { message: "Major is required." }),
  batch: z.string().min(1, { message: "Batch is required." }),

  student_id: z.string().min(1, {
    message: "Student ID is required.",
  }),

  practical_work: z.string().min(1, {
    message: "Practical work is required.",
  }),

  phone_number: z
    .string()
    .min(1, { message: "Phone number is required." })
    .refine(
      (value) => REG_PHONE.test(value),
      "Please enter a correct phone number",
    ),

  line_id: z.string().min(1, {
    message: "LINE ID is required.",
  }),

  information_from: z.string().min(1, {
    message: "Information source is required.",
  }),

  about_petrolida: z.string().min(1, {
    message: "This field is required.",
  }),

  primary_division: z.string().min(1, {
    message: "Primary division is required.",
  }),

  primary_motivation: z.string().min(1, {
    message: "Primary motivation is required.",
  }),

  secondary_division: z.string().min(1, {
    message: "Secondary division is required.",
  }),

  secondary_motivation: z.string().min(1, {
    message: "Secondary motivation is required.",
  }),

  english_proficiency: z
    .number()
    .min(1)
    .max(5, { message: "Value must be between 1 and 5." }),

  communication_skill: z
    .number()
    .min(1)
    .max(5, { message: "Value must be between 1 and 5." }),

  fast_response: z
    .number()
    .min(1)
    .max(5, { message: "Value must be between 1 and 5." }),

  time_management: z
    .number()
    .min(1)
    .max(5, { message: "Value must be between 1 and 5." }),

  willing_to_pay: z.boolean(),
  transfer_to_other_division: z.boolean(),

  cv_asset: fileValidation,
  follow_proof_asset: fileValidation,
});

export type TypeOprecLovol = z.infer<typeof FormLovolRegistrationSchema>;
