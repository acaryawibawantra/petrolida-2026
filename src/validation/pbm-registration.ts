import { REG_PHONE } from "@/constants/regex";
import z from "zod";

export const FormRegistrationPBM = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  phone_number: z
    .string()

    .min(1, {
      message: "Phone Number is required.",
    })
    .refine(
      (value) => REG_PHONE.test(value),
      "Please enter a correct phone number",
    ),
  institution: z.string().min(1, {
    message: "Institution is required.",
  }),
  email: z.string().email().min(1, {
    message: "Email is required.",
  }),
  follow_instagram: z
    .any()
    .refine((file) => file instanceof File, "Proof of follow must required"),
  follow_tiktok: z
    .any()
    .refine((file) => file instanceof File, "Proof of follow must required"),
  batch_id: z.string().min(1, {
    message: "Batch is required.",
  }),
  information_from: z.string().min(1, {
    message: "Please select where you heard us from.",
  }),
  major: z.string().optional(),
});
