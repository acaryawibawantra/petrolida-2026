import { z } from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const merchFormSchema = z.object({
  name: z.string().min(3, "Item name is required (min 3 chars)"),
  status: z.enum(["preorder", "active"]),
  category: z.string().min(1, "Category must be selected"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  price: z.coerce.number().min(100, "Price must be at least 100"),
  description: z.string().min(1, "Description cannot be empty"),
  size: z.array(z.string()).min(1, "Please select at least one size"),
  variants: z.array(z.string()).optional(),
  image: z
    .any()
    .refine(
      (files) => files?.length > 0,
      "Image is required (upload at least 1 file)",
    )
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every((file: File) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      );
    }, "Only .jpg, .jpeg, and .png formats are supported.")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every((file: File) => file.size <= MAX_FILE_SIZE);
    }, "Max file size is 3MB per image."),
});

// Edit schema - all fields optional except validation rules when provided
export const merchEditSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 chars").optional(),
  status: z.enum(["preorder", "active"]).optional(),
  category: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative").optional(),
  price: z.coerce.number().min(100, "Price must be at least 100").optional(),
  description: z.string().optional(),
  size: z.array(z.string()).optional(),
  variants: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
  is_preorder: z.boolean().optional(),
  image: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every((file: File) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      );
    }, "Only .jpg, .jpeg, and .png formats are supported.")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every((file: File) => file.size <= MAX_FILE_SIZE);
    }, "Max file size is 3MB per image."),
});

export type MerchFormValues = z.infer<typeof merchFormSchema>;
export type MerchEditFormValues = z.infer<typeof merchEditSchema>;
