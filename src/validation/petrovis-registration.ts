import { REG_PHONE } from "@/constants/regex";
import { z } from "zod";

export const PetrovisRegistrationSchema = z.object({
  spe_id: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email" }),
  name: z.string().min(1, { message: "Name is required" }),
  institution: z.string().min(1, { message: "Institution is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  batch: z.string().min(1, { message: "Batch is required" }),
  student_id_number: z
    .string()
    .min(1, { message: "Student ID number is required" }),
  student_id_card: z
    .any()
    .refine((file) => file instanceof File, "Student ID card is required"),
  phone_number: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(
      (value) => REG_PHONE.test(value),
      "Please enter a correct phone number",
    ),
  motivation_joining_company_visit: z
    .string()
    .min(1, { message: "Motivation is required" }),
  have_you_ever_participated_company_visit: z.boolean({
    message: "This field is required",
  }),
  how_did_hear_this_event: z
    .string()
    .min(1, { message: "This field is required" }),
  payment_method: z.literal("QRIS"),
  voucher_code: z.string().optional(),
});

export type PetrovisRegistrationFormType = z.infer<
  typeof PetrovisRegistrationSchema
>;
