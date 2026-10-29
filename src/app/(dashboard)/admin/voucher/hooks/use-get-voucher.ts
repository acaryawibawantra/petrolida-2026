import api from "@/lib/api";
import { VoucherDetailResponse } from "@/types/voucher";
import { useQuery } from "@tanstack/react-query";

export const useGetVoucher = (id: string) => {
  return useQuery({
    queryKey: ["voucher", id],
    queryFn: async () => {
      const response = await api.get<VoucherDetailResponse>(
        `/api/v1/voucher-code/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};
