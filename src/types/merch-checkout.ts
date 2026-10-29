import { z } from "zod";

export const MerchCheckoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^62\d+$/,
      "Phone number must start with 62 and contain only numbers",
    ),
  line_id: z.string().min(1, "Line ID is required"),
  is_delivery: z.boolean().default(true),
  address: z.string().min(10, "Address must be at least 10 characters"),

  product: z
    .array(
      z.object({
        id: z.string().min(1, "Product id is required"),
        variant_id: z.string().min(1, "Variant id is required"),
        size_id: z.string().min(1, "Size id is required"),
        amount: z.number().min(1, "Amount must be at least 1"),
      }),
    )
    .min(1, "Product must not be empty"),
});

export type MerchCheckoutForm = z.infer<typeof MerchCheckoutSchema>;
