import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import api from "@/lib/api";
import { ApiResponse } from "@/types/api";

export interface MerchInsightItem {
  date: string;
  count: number;
}

export default function useGetMerchInsight() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<MerchInsightItem[]>>
  >({
    queryKey: ["countDailyMerch"],
    queryFn: async () => {
      const response = await api.get("/api/v1/merch/insight");
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
