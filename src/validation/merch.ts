import { z } from "zod";

export const MerchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  item_code: z.string().min(1, "Item code is required"),
  stock: z.number().min(0, "Stock must be a positive number"),
  category: z.string().min(1, "Category is required").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .optional(),
  size: z.string().min(1, "Size is required"),
  status: z.string().min(1, "Status is required"),
});

export type MerchFormValues = z.infer<typeof MerchSchema>;
