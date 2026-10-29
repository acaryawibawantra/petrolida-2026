import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import type {
  PetrovisDetail,
  PetrovisListItem,
  PetrovisRegistrantCount,
} from "@/types/page/petrovis-registration";
import { useQuery } from "@tanstack/react-query";

type PetrovisListParams = {
  page?: number;
  limit?: number;
  name?: string;
  institution?: string;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
};

export function usePetrovisList(params: PetrovisListParams = {}) {
  const { page = 1, limit = 10, name = "", institution = "" } = params;

  return useQuery<PaginatedResponse<PetrovisListItem>>({
    queryKey: ["petrovis-list", page, limit, name, institution],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        name,
        institution,
      });

      const response = await api.get<
        ApiResponse<PaginatedResponse<PetrovisListItem>>
      >(`/api/v1/petrovis?${queryParams.toString()}`);
      return response.data.data;
    },
  });
}

export function usePetrovisDetail(id: string) {
  return useQuery<PetrovisDetail>({
    queryKey: ["petrovis-detail", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PetrovisDetail>>(
        `/api/v1/petrovis/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function usePetrovisRegistrantCount() {
  return useQuery<PetrovisRegistrantCount>({
    queryKey: ["petrovis-registrant-count"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PetrovisRegistrantCount>>(
        "/api/v1/petrovis/count",
      );
      return response.data.data;
    },
  });
}
