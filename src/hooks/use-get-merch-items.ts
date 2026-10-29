"use client";

import api from "@/lib/api";
import { getAssetUrl } from "@/lib/asset-url";
import { useQuery } from "@tanstack/react-query";

export type MerchItem = {
  id: string;
  name: string;
  product_category: string;
  description: string;
  price: string; // API output shows string "150000"
  quantity_sold: number;
  stock: number;
  is_preorder: boolean;
  is_active: boolean;
  banner_asset: {
    id: string;
    name: string;
    link: string;
  } | null;
  variants: {
    id: string;
    value: string;
  }[];
  sizes: {
    id: string;
    value: string;
  }[];
};

type MerchItemsResponse = {
  data: MerchItem[];
  meta: {
    take: number;
    page: number;
    total: number;
    total_page: number;
    sort: string;
    filter: string;
    filter_by: string;
  };
};

type UseMerchItemsParams = {
  page?: number;
  take?: number;
  sort?: string;
  sort_by?: string;
  filter?: string;
  filter_by?: string;
  category?: string;
  status?: string;
};

export function useMerchItems(params?: UseMerchItemsParams) {
  return useQuery({
    queryKey: ["merch-items", params],
    queryFn: async (): Promise<MerchItemsResponse> => {
      const response = await api.get("/api/v1/product", {
        params: {
          page: params?.page || 1,
          limit: params?.take || 50,
          sort: params?.sort || "asc",
          sort_by: params?.sort_by || "name",
          filter: params?.filter || "true",
          filter_by: params?.filter_by || "is_active",
          category: params?.category,
          status: params?.status || "in_stock",
        },
      });

      // Transform asset URLs to use correct API base URL
      const transformedData =
        response.data.data?.map((item: MerchItem) => ({
          ...item,
          banner_asset: item.banner_asset
            ? {
                ...item.banner_asset,
                link: getAssetUrl(item.banner_asset.link),
              }
            : null,
        })) || [];

      return {
        ...response.data,
        data: transformedData,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
