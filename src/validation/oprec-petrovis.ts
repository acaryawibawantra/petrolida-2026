import { REG_PHONE } from "@/constants/regex";
import { z } from "zod";

const fileValidation = z
  .any()
  .optional()
  .transform((val) => {
    return val;
  });

export const FormOprecPetrovisSchema = z.object({
  // Step 1 fields
  email: z.string().email().min(1, { message: "Email is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  institution: z
    .string()
    .min(1, { message: "Institution/Organization is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  batch: z.string().min(1, { message: "Batch is required." }),
  student_id_number: z
    .string()
    .min(1, { message: "Student ID Number is required." }),
  phone_number: z
    .string()
    .min(1, { message: "Phone Number is required." })
    .refine(
      (value) => REG_PHONE.test(value),
      "Please enter a correct phone number",
    ),

  // Step 2 fields
  motivation_joining_company_visit: z
    .string()
    .min(1, { message: "Motivation is required." }),
  have_you_ever_participated_company_visit: z
    .string()
    .min(1, { message: "This field is required." }), // Yes/No
  how_did_hear_this_event: z
    .string()
    .min(1, { message: "This field is required." }),

  // Files handled by store but we keep keys here for form state reference if needed or skip them
  // Unlike staff, we might want to ensure they are uploaded before submit.
  // Zod doesn't easily validate file presence if files are in Zustand.
  // logic will be in hook.

  // Placeholder keys to allow managing state if we mistakenly register them
  student_id_card: fileValidation,
  proof_of_payment: fileValidation,
});

export type TypeOprecPetrovis = z.infer<typeof FormOprecPetrovisSchema>;
