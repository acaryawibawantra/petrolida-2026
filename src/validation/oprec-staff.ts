import { REG_NRP, REG_PHONE } from "@/constants/regex";
import { z } from "zod";

const fileValidation = z
  .any()
  .optional()
  .transform((val) => {
    return val;
  });

export const FormOprecStaffSchema = z.object({
  // Form1 fields
  id: z.string().optional(),
  status: z.enum(["interviewed", "pending", "accepted", "rejected"]).optional(),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email().min(1, {
    message: "Email is required.",
  }),
  department: z.string().min(1, {
    message: "Department is required.",
  }),
  faculty: z.string().min(1, {
    message: "Faculty is required.",
  }),
  batch: z.string().min(1, {
    message: "Batch is required.",
  }),
  student_id: z
    .string()
    .min(1, {
      message: "Student ID is required.",
    })
    .refine(
      (value) => REG_NRP.test(value),
      "Please enter a correct Student ID",
    ),
  phone_number: z
    .string()

    .min(1, {
      message: "Phone Number is required.",
    })
    .refine(
      (value) => REG_PHONE.test(value),
      "Please enter a correct phone number",
    ),
  line_id: z.string().min(1, {
    message: "LINE ID is required.",
  }),
  about_petrolida: z.string().min(1, {
    message: "This field is required.",
  }),
  primary_division_id: z.string().min(1, {
    message: "Primary division is required.",
  }),
  secondary_division_id: z.string().min(1, {
    message: "Secondary division is required.",
  }),

  // Form2 fields
  about_primary_division: z.string().min(1, {
    message: "This field is required.",
  }),
  reason_join_primary_division: z.string().min(1, {
    message: "This field is required.",
  }),
  innovation_idea_primary_division: z.string().min(1, {
    message: "This field is required.",
  }),
  previous_experience_primary_division: z.string().optional(),

  // Form3 fields
  about_secondary_division: z.string().min(1, {
    message: "This field is required.",
  }),
  reason_join_secondary_division: z.string().min(1, {
    message: "This field is required.",
  }),
  innovation_idea_secondary_division: z.string().min(1, {
    message: "This field is required.",
  }),
  previous_experience_secondary_division: z.string().optional(),

  // Form4 fields
  required_document_link: z
    .string()
    .min(1, {
      message: "Required document link is required.",
    })
    .refine((value) => {
      // Basic URL validation - checks if it's a valid URL
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid URL for the document folder")
    .refine((value) => {
      // Optional: More specific validation for Google Drive links
      const googleDrivePattern = /^https:\/\/drive\.google\.com\/.*$/i;
      return googleDrivePattern.test(value);
    }, "Please provide a Google Drive folder link"),

  // Portfolio file - handled by file store (optional)
  portfolio_asset_link: fileValidation,
});

export type TypeOprecStaff = z.infer<typeof FormOprecStaffSchema>;
