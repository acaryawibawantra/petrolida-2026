"use client";

import api from "@/lib/api";
import { getAssetUrl } from "@/lib/asset-url";
import { useQuery } from "@tanstack/react-query";

type MerchVariant = {
  id: string;
  value: string;
};

type MerchSize = {
  id: string;
  value: string;
  stock?: number;
};

type MerchAsset = {
  id: string;
  name: string;
  link: string;
};

export type MerchDetail = {
  id: string;
  item_code?: string;
  name: string;
  product_category: string;
  price: string;
  stock: number;
  quantity_sold: number;
  is_active: boolean;
  is_preorder: boolean;
  assets: MerchAsset[];
  description: string;
  variants: MerchVariant[];
  sizes: MerchSize[];
  // Computed property for backward compatibility
  banner_asset?: MerchAsset | null;
};

export function useMerchDetail(id: string) {
  return useQuery({
    queryKey: ["merch-detail", id],
    queryFn: async (): Promise<MerchDetail> => {
      const response = await api.get(`/api/v1/product/${id}`);
      const data = response.data.data;

      // Transform asset URLs to use correct API base URL
      const transformedAssets =
        data.assets?.map((asset: MerchAsset) => ({
          ...asset,
          link: getAssetUrl(asset.link),
        })) || [];

      const bannerAsset =
        transformedAssets.length > 0 ? transformedAssets[0] : null;

      return {
        ...data,
        assets: transformedAssets,
        banner_asset: bannerAsset,
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
