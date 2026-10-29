import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// TYPES
interface CreateMerchPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  product_category: string; // Changed from category_id
  is_active?: boolean; // Not in screenshot explicitly but likely needed or default
  is_preorder: boolean; // In screenshot
  variants?: { value: string }[]; // In screenshot
  sizes?: { value: string }[]; // In screenshot
  assets?: File | File[]; // For unified creation flow
}

interface UpdateMerchPayload extends Partial<CreateMerchPayload> {}

interface CreateSizePayload {
  value: string;
  stock: number;
  price_adjustment?: number;
}

interface CreateVariantPayload {
  value: string;
  stock: number;
  price_adjustment?: number;
}

// HOOKS
export function useMerchActions() {
  const queryClient = useQueryClient();

  // Create Product
  const createMerchMutation = useMutation({
    mutationFn: async (payload: CreateMerchPayload) => {
      // Convert JSON payload to FormData to match "Multipart Form" request type
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("description", payload.description);
      formData.append("price", String(payload.price));
      formData.append("stock", String(payload.stock));
      formData.append("product_category", payload.product_category);
      formData.append("is_active", String(payload.is_active ?? true));
      formData.append("is_preorder", String(payload.is_preorder));

      // Sizes and variants as JSON string array: [{"value":"S"},{"value":"M"}]
      if (payload.sizes && payload.sizes.length > 0) {
        formData.append("sizes", JSON.stringify(payload.sizes));
      }
      if (payload.variants && payload.variants.length > 0) {
        formData.append("variants", JSON.stringify(payload.variants));
      }

      if (payload.assets) {
        if (Array.isArray(payload.assets)) {
          payload.assets.forEach((file) => formData.append("assets", file));
        } else {
          formData.append("assets", payload.assets);
        }
      }

      const { data } = await api.post("/api/v1/product", formData, {
        headers: { "Content-Type": undefined },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merch-items"] });
    },
    onError: (error) => {
      console.error("Create Merch Error:", error);
      if (error && (error as any).response) {
        console.error("Response data:", (error as any).response.data);
      }
      toast.error("Failed to create merch item");
    },
  });

  // Update Product
  const updateMerchMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: { id: string; payload: UpdateMerchPayload }) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle specific fields if needed
          if (key === "sizes" || key === "variants") {
            // If we ever send arrays here
            formData.append(key, JSON.stringify(value));
          } else if (key === "assets") {
            if (Array.isArray(value)) {
              value.forEach((file) => formData.append("assets", file));
            } else if (value instanceof File) {
              formData.append("assets", value);
            }
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const { data } = await api.put(`/api/v1/product/${id}`, formData, {
        headers: { "Content-Type": undefined },
      });
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["merch-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["merch-items"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update merch item");
    },
  });

  // Delete Product
  const deleteMerchMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/product/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merch-items"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete merch item");
    },
  });

  // Upload Asset
  const uploadMerchAssetMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("asset", file);
      const { data } = await api.post(`/api/v1/product/${id}/asset`, formData, {
        headers: { "Content-Type": undefined },
      });
      return data;
    },
    onSuccess: (_, { id }) => {
      // Invalidate detail to show new image
      queryClient.invalidateQueries({ queryKey: ["merch-detail", id] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to upload asset");
    },
  });

  // Create Size
  const createMerchSizeMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: { id: string; payload: CreateSizePayload }) => {
      const { data } = await api.post(`/api/v1/product/${id}/sizes`, payload);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["merch-detail", id] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create size");
    },
  });

  // Delete Size
  const deleteMerchSizeMutation = useMutation({
    mutationFn: async ({
      productId,
      sizeId,
    }: { productId: string; sizeId: string }) => {
      await api.delete(`/api/v1/product/${productId}/sizes/${sizeId}`);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["merch-detail", productId] });
    },
  });

  // Create Variant
  const createMerchVariantMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: { id: string; payload: CreateVariantPayload }) => {
      const { data } = await api.post(
        `/api/v1/product/${id}/variants`,
        payload,
      );
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["merch-detail", id] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create variant");
    },
  });

  // Delete Variant
  const deleteMerchVariantMutation = useMutation({
    mutationFn: async ({
      productId,
      variantId,
    }: { productId: string; variantId: string }) => {
      await api.delete(`/api/v1/product/${productId}/variants/${variantId}`);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["merch-detail", productId] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete variant");
    },
  });

  return {
    createMerch: createMerchMutation,
    updateMerch: updateMerchMutation,
    deleteMerch: deleteMerchMutation,
    uploadAsset: uploadMerchAssetMutation,
    createSize: createMerchSizeMutation,
    deleteSize: deleteMerchSizeMutation,
    createVariant: createMerchVariantMutation,
    deleteVariant: deleteMerchVariantMutation,
  };
}
