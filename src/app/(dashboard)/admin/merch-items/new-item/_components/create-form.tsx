"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useGetProductCategories } from "@/hooks/use-master-data";
import { useMerchActions } from "@/hooks/use-merch-actions";
import {
  type MerchFormValues,
  merchFormSchema,
} from "@/validation/create-new-merch";
import { toast } from "sonner";

export default function CreateMerchForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [variantInput, setVariantInput] = React.useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MerchFormValues>({
    resolver: zodResolver(merchFormSchema) as any,
    defaultValues: {
      status: "preorder",
      stock: 0,
      price: 0,
      category: "",
      size: [],
      description: "",
      image: [],
      variants: [],
    },
  });

  const files = watch("image") as File[];
  const currentVariants = watch("variants") || [];

  const addVariant = () => {
    if (!variantInput.trim()) return;
    const newVariants = [...(currentVariants || []), variantInput.trim()];
    setValue("variants", newVariants);
    setVariantInput("");
  };

  const removeVariant = (index: number) => {
    const newVariants = (currentVariants || []).filter((_, i) => i !== index);
    setValue("variants", newVariants);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...(files || []), ...acceptedFiles];
      setValue("image", newFiles, { shouldValidate: true });
    },
    [files, setValue],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxSize: 3 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setValue("image", newFiles, { shouldValidate: true });
  };

  const { createMerch } = useMerchActions();
  const { categories } = useGetProductCategories();

  const onSubmit = async (data: MerchFormValues) => {
    setIsSubmitting(true);
    try {
      // Create Product with sizes and variants included
      const productPayload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        product_category: data.category,
        is_preorder: data.status === "preorder",
        is_active: true,
        // Sizes format: [{"value":"S"},{"value":"M"},{"value":"L"}]
        sizes: data.size?.map((s) => ({ value: s })) || [],
        // Variants format: [{"value":"Merah"},{"value":"Biru"}]
        variants: data.variants?.map((v) => ({ value: v })) || [],
        assets: data.image?.[0],
      };

      await createMerch.mutateAsync(productPayload);

      toast.success("Item created successfully", {
        description: `${data.name} has been added.`,
      });

      router.push("/admin/merch-items");
    } catch (error) {
      console.error("Failed create flow:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 border-y border-gray-200 mb-8">
        <Typography
          variant="h2"
          weight="bold"
          className="hidden sm:block text-2xl text-black"
        >
          New Item
        </Typography>

        <div className="flex w-full sm:w-auto gap-3">
          <Button
            variant="secondary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:w-[150px] bg-[#5B8C73] text-white hover:bg-[#4a725e]"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => router.back()}
            type="button"
            className="flex-1 sm:flex-none sm:w-[150px] border-danger-500 text-danger-500 hover:bg-danger-600 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-6">
          {/* Item Name */}
          <div className="space-y-2">
            <Typography variant="t" weight="medium" className="text-black">
              Item Name
            </Typography>
            <Input
              {...register("name")}
              placeholder="Enter item name"
              className="focus-visible:ring-secondary-500/50"
            />
            {errors.name && (
              <Typography variant="bt" className="text-red-500 font-medium">
                {errors.name.message}
              </Typography>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="space-y-2">
              <Typography variant="t" weight="medium" className="text-black">
                Categories
              </Typography>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full focus:ring-secondary-500/50 focus:ring-2 focus:ring-offset-0">
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <Typography variant="bt" className="text-red-500 font-medium">
                  {errors.category.message}
                </Typography>
              )}
            </div>

            {/* Preorder Status */}
            <div className="space-y-2">
              <Typography variant="t" weight="medium" className="text-black">
                Status
              </Typography>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <div className="flex items-center space-x-2 h-10">
                    <Checkbox
                      id="is_preorder"
                      checked={field.value === "preorder"}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? "preorder" : "active");
                      }}
                    />
                    <label
                      htmlFor="is_preorder"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black cursor-pointer select-none"
                    >
                      Set as Pre-order Item
                    </label>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stock */}
            <div className="space-y-2">
              <Typography variant="t" weight="medium" className="text-black">
                Stock
              </Typography>
              <Input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                min={0}
                className="focus-visible:ring-secondary-500/50"
              />
              {errors.stock && (
                <Typography variant="bt" className="text-red-500 font-medium">
                  {errors.stock.message}
                </Typography>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Typography variant="t" weight="medium" className="text-black">
                Price
              </Typography>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-black font-medium text-sm">
                  Rp
                </span>
                <Input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  className="pl-10 focus-visible:ring-secondary-500/50"
                />
              </div>
              {errors.price && (
                <Typography variant="bt" className="text-red-500 font-medium">
                  {errors.price.message}
                </Typography>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Typography variant="t" weight="medium" className="text-black">
              Description
            </Typography>
            <Textarea
              {...register("description")}
              rows={5}
              placeholder="Enter item description here..."
              className="resize-none focus-visible:ring-secondary-500/50 focus-visible:ring-2 focus-visible:ring-offset-0"
            />
            {errors.description && (
              <Typography variant="bt" className="text-red-500 font-medium">
                {errors.description.message}
              </Typography>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          {/* Upload File */}
          <div className="space-y-2">
            <Typography variant="t" weight="medium" className="text-black">
              Upload File
            </Typography>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-secondary-500 bg-secondary-500/10"
                  : errors.image
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input {...getInputProps()} />
              <Upload
                className={`w-8 h-8 mb-2 ${
                  errors.image ? "text-red-400" : "text-gray-400"
                }`}
              />
              <Typography
                variant="p"
                className={`text-sm ${
                  errors.image ? "text-red-500" : "text-gray-500"
                }`}
              >
                Upload files here <br />
                <span className="text-xs text-gray-400">
                  (JPG, PNG, JPEG max 3MB)
                </span>
              </Typography>
            </div>

            {errors.image && (
              <Typography variant="bt" className="text-red-500 font-medium">
                {errors.image.message as string}
              </Typography>
            )}

            {files && files.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square bg-gray-200 rounded-md overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <Typography variant="t" weight="medium" className="text-black">
              Select Sizes
            </Typography>
            <Controller
              control={control}
              name="size"
              render={({ field }) => (
                <div className="flex flex-wrap gap-4">
                  {["Default", "S", "M", "L", "XL", "2XL"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={field.value?.includes(size)}
                        onCheckedChange={(checked) => {
                          const value = field.value || [];
                          if (checked) {
                            field.onChange([...value, size]);
                          } else {
                            field.onChange(value.filter((v) => v !== size));
                          }
                        }}
                      />
                      <label
                        htmlFor={`size-${size}`}
                        className="cursor-pointer select-none"
                      >
                        <Typography
                          variant="t"
                          className="text-black font-medium hover:text-neutral-600 transition-colors"
                        >
                          {size}
                        </Typography>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.size && (
              <Typography variant="bt" className="text-red-500 font-medium">
                {errors.size.message}
              </Typography>
            )}
          </div>

          {/* Variants */}
          <div className="space-y-3">
            <Typography variant="t" weight="medium" className="text-black">
              Variants
            </Typography>
            <div className="flex gap-2">
              <Input
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                placeholder="Add variant (e.g. Red, Blue)"
                className="focus-visible:ring-secondary-500/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addVariant();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addVariant}
                variant="secondary"
                className="bg-[#5B8C73] text-white hover:bg-[#4a725e]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {currentVariants.length > 0 && (
              <div className="space-y-2">
                {currentVariants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100"
                  >
                    <Typography variant="bt" className="text-black">
                      {variant}
                    </Typography>
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
