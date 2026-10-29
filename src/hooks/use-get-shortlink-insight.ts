import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import api from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface ShortLinkInsightItem {
  date: string;
  count: number;
}

export default function useGetShortLinkInsight() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<ShortLinkInsightItem[]>>
  >({
    queryKey: ["countDailyLink"],
    queryFn: async () => {
      const response = await api.get("/api/v1/link/insight");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    dailyData: data?.data.data,
    isLoading,
    error,
  };
}
