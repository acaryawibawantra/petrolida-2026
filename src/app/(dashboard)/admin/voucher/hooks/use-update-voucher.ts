import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";
import { UpdateVoucherPayload, VoucherUpdateResponse } from "@/types/voucher";

interface ErrorResponse {
  message: string;
}

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateVoucherPayload) => {
      // Ensure numeric values are sent as numbers
      const formattedPayload = {
        ...payload,
        amount: payload.amount ? Number(payload.amount) : undefined,
        quantity: payload.quantity ? Number(payload.quantity) : undefined,
        usage_limit: payload.usage_limit
          ? Number(payload.usage_limit)
          : undefined,
      };

      const { id, ...data } = formattedPayload;
      const response = await api.put<VoucherUpdateResponse>(
        `/api/v1/voucher-code/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Voucher updated successfully!");
      // Invalidate query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["voucher", variables.id] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || "Failed to update voucher";
      toast.error(message);
    },
  });
};
