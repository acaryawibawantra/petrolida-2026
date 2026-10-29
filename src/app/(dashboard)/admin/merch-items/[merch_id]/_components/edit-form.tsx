"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Plus, Trash2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef } from "react";
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

import { MerchDetail } from "@/hooks/use-get-detail-merch";
import { useGetProductCategories } from "@/hooks/use-master-data";
import { useMerchActions } from "@/hooks/use-merch-actions";
import {
  type MerchEditFormValues,
  merchEditSchema,
} from "@/validation/create-new-merch";
import { toast } from "sonner";

interface EditMerchFormProps {
  detail: MerchDetail;
  merchId: string;
  onCancel: () => void;
}

export default function EditMerchForm({
  detail,
  merchId,
  onCancel,
}: EditMerchFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [variantInput, setVariantInput] = React.useState("");

  // State for replacement file (via PUT)
  const [replacementFile, setReplacementFile] = React.useState<File | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MerchEditFormValues>({
    resolver: zodResolver(merchEditSchema) as any,
    defaultValues: {
      stock: undefined,
      price: undefined,
      category: undefined,
      size: undefined,
      description: undefined,
      image: [],
      variants: undefined,
      is_active: true,
      is_preorder: false,
    },
  });

  const files = watch("image") as File[]; // These are "Additional Images" (via POST)
  const currentVariants = watch("variants") || [];
  const { categories } = useGetProductCategories();

  // Initialize form with detail data
  useEffect(() => {
    if (detail && categories) {
      const matchingCategory = categories.find(
        (c) => c.value === detail.product_category,
      );
      const categoryId = matchingCategory ? matchingCategory.id : "";

      reset({
        name: detail.name || "",
        price: Number(detail.price) || 0,
        stock: detail.stock || 0,
        category: categoryId,
        description: detail.description || "",
        size: detail.sizes?.map((s) => s.value) || [],
        variants: detail.variants?.map((v) => v.value) || [],
        image: [], // Reset dropzone
        is_active: detail.is_active,
        is_preorder: detail.is_preorder,
      });
      setReplacementFile(null);
    }
  }, [detail, categories, reset]);

  const addVariant = () => {
    const trimmedVariant = variantInput.trim();

    if (!trimmedVariant) {
      toast.error("Variant name cannot be empty");
      return;
    }

    if (currentVariants?.includes(trimmedVariant)) {
      toast.error(`Variant "${trimmedVariant}" already exists`);
      return;
    }

    const newVariants = [...(currentVariants || []), trimmedVariant];
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

  const { updateMerch } = useMerchActions();

  // Handle clicking existing image to replace
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleReplacementSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("File is too large (max 3MB)");
        return;
      }
      setReplacementFile(file);
      toast.success("Image selected for replacement");
    }
  };

  const onSubmit = async (data: MerchEditFormValues) => {
    setIsSubmitting(true);
    try {
      // Resolve product_category
      const resolvedCategoryId =
        data.category ||
        categories?.find((c) => c.value === detail.product_category)?.id ||
        "";

      // Prepare assets (combine replacement + new uploads)
      const assetFiles: File[] = [];
      if (replacementFile) {
        assetFiles.push(replacementFile);
      }
      if (data.image && Array.isArray(data.image)) {
        assetFiles.push(...(data.image as File[]));
      }

      // Prepare sizes and variants as objects
      const newSizes = data.size?.map((s) => ({ value: s })) || [];
      const newVariants =
        data.variants
          ?.filter((v) => v.trim() !== "")
          .map((v) => ({ value: v })) || [];

      // Build payload
      const productPayload: any = {
        name: data.name || detail.name,
        description: data.description ?? detail.description ?? "",
        price:
          data.price !== undefined && data.price !== null
            ? Number(data.price)
            : Number(detail.price),
        stock:
          data.stock !== undefined && data.stock !== null
            ? Number(data.stock)
            : Number(detail.stock),
        product_category: resolvedCategoryId,
        is_active: data.is_active ?? detail.is_active ?? true,
        is_preorder: data.is_preorder ?? detail.is_preorder ?? false,
        sizes: newSizes,
        variants: newVariants,
      };

      if (assetFiles.length > 0) {
        productPayload.assets = assetFiles;
      }

      // Send Unified Update (PUT)
      await updateMerch.mutateAsync({ id: merchId, payload: productPayload });

      toast.success("Item updated successfully");
      router.push("/admin/merch-items");
    } catch (error) {
      console.error("Failed update flow:", error);
      toast.error("Failed to update item");
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
          Edit Item
        </Typography>
        <div className="flex w-full sm:w-auto gap-3">
          <Button
            variant="secondary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:w-[150px] bg-[#5B8C73] text-white hover:bg-[#4a725e]"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            type="button"
            className="flex-1 sm:flex-none sm:w-[150px] border-danger-500 text-danger-500 hover:bg-danger-600 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Typography variant="t" weight="medium" className="text-black">
              Item Name{" "}
              <span className="text-gray-400 text-sm">(Optional)</span>
            </Typography>
            <Input
              {...register("name")}
              placeholder={detail.name}
              className="focus-visible:ring-secondary-500/50"
            />
            {errors.name && (
              <Typography variant="bt" className="text-red-500 font-medium">
                {errors.name.message}
              </Typography>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Typography variant="t" weight="medium" className="text-black">
                Categories{" "}
                <span className="text-gray-400 text-sm">(Optional)</span>
              </Typography>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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

            <div className="space-y-2">
              <Typography
                variant="t"
                weight="medium"
                className="text-black mb-2 block"
              >
                Status & Visibility
              </Typography>
              <div className="flex gap-6 mt-3">
                <Controller
                  control={control}
                  name="is_active"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="is_active"
                        className="text-sm font-medium text-black cursor-pointer select-none"
                      >
                        Is Active
                      </label>
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="is_preorder"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_preorder"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="is_preorder"
                        className="text-sm font-medium text-black cursor-pointer select-none"
                      >
                        Is Pre-order
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Typography variant="t" weight="medium" className="text-black">
                Stock <span className="text-gray-400 text-sm">(Optional)</span>
              </Typography>
              <Input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                min={0}
                placeholder={String(detail.stock)}
                className="focus-visible:ring-secondary-500/50"
              />
              {errors.stock && (
                <Typography variant="bt" className="text-red-500 font-medium">
                  {errors.stock.message}
                </Typography>
              )}
            </div>

            <div className="space-y-2">
              <Typography variant="t" weight="medium" className="text-black">
                Price <span className="text-gray-400 text-sm">(Optional)</span>
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
                  placeholder={String(detail.price)}
                />
              </div>
              {errors.price && (
                <Typography variant="bt" className="text-red-500 font-medium">
                  {errors.price.message}
                </Typography>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="t" weight="medium" className="text-black">
              Description{" "}
              <span className="text-gray-400 text-sm">(Optional)</span>
            </Typography>
            <Textarea
              {...register("description")}
              rows={5}
              placeholder={detail.description}
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
          <div className="space-y-2">
            <Typography variant="t" weight="medium" className="text-black">
              Add New Images
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
                className={`w-8 h-8 mb-2 ${errors.image ? "text-red-400" : "text-gray-400"}`}
              />
              <Typography
                variant="p"
                className={`text-sm ${errors.image ? "text-red-500" : "text-gray-500"}`}
              >
                Drop files to <b>Add</b> <br />{" "}
                <span className="text-xs text-gray-400">
                  (JPG, PNG, max 3MB)
                </span>
              </Typography>
            </div>
            {errors.image && (
              <Typography variant="bt" className="text-red-500 font-medium">
                {errors.image.message as string}
              </Typography>
            )}

            {/* Preview Additional Files */}
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
                    <div className="absolute bottom-0 w-full bg-blue-500/80 text-white text-[10px] text-center p-0.5">
                      New
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden Input for Replacement */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleReplacementSelect}
            />

            {/* Current Images / Replacement UI */}
            {detail.assets && detail.assets.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <Typography
                  variant="bt"
                  className="text-gray-600 mb-2 font-semibold flex items-center justify-between"
                >
                  Current Images
                  <span className="text-xs font-normal text-gray-400">
                    First image is Banner
                  </span>
                </Typography>

                <div className="grid grid-cols-2 gap-2">
                  {detail.assets.map((asset, index) => {
                    // Only logic for Banner (first item) replacement
                    const isBanner = index === 0;
                    const currentSrc =
                      isBanner && replacementFile
                        ? URL.createObjectURL(replacementFile)
                        : asset.link;

                    return (
                      <div
                        key={asset.id}
                        className={`relative group rounded-lg transition-all overflow-hidden ${
                          isBanner
                            ? "cursor-pointer ring-2 ring-transparent hover:ring-primary-500"
                            : ""
                        }`}
                        onClick={isBanner ? handleImageClick : undefined}
                        title={
                          isBanner
                            ? "Click to replace banner"
                            : "Additional image"
                        }
                      >
                        <img
                          src={currentSrc}
                          alt={asset.name}
                          className="w-full rounded-lg border aspect-square object-cover"
                        />
                        {isBanner && (
                          <>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/90 p-1.5 rounded-full shadow-sm">
                                <Edit2 className="w-4 h-4 text-black" />
                              </div>
                            </div>
                            <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                              Banner
                            </div>
                          </>
                        )}
                        {!isBanner && (
                          <div className="absolute top-1 left-1 bg-gray-500/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                            #{index + 1}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Typography variant="t" weight="medium" className="text-black">
              Select Sizes{" "}
              <span className="text-gray-400 text-sm">(Optional)</span>
            </Typography>
            {detail.sizes && detail.sizes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Typography
                  variant="bt"
                  className="text-blue-700 font-medium mb-2"
                >
                  Current Sizes:
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {detail.sizes.map((size) => (
                    <span
                      key={size.id}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      {size.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Controller
              control={control}
              name="size"
              render={({ field }) => (
                <div className="flex flex-wrap gap-4">
                  {["S", "M", "L", "XL", "2XL"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={field.value?.includes(size)}
                        onCheckedChange={(checked) => {
                          const value = field.value || [];
                          if (checked) field.onChange([...value, size]);
                          else field.onChange(value.filter((v) => v !== size));
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

          <div className="space-y-3">
            <Typography variant="t" weight="medium" className="text-black">
              Variants <span className="text-gray-400 text-sm">(Optional)</span>
            </Typography>
            {detail.variants && detail.variants.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Typography
                  variant="bt"
                  className="text-blue-700 font-medium mb-2"
                >
                  Current Variants:
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {detail.variants.map((variant) => (
                    <span
                      key={variant.id}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      {variant.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
