import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";
import { CreateVoucherPayload, VoucherCreateResponse } from "@/types/voucher";

interface ErrorResponse {
  message: string;
}

export const useCreateVoucher = () => {
  return useMutation({
    mutationFn: async (payload: CreateVoucherPayload) => {
      // Ensure numeric values are sent as numbers
      const formattedPayload = {
        ...payload,
        amount: Number(payload.amount),
        quantity: Number(payload.quantity),
        usage_limit: Number(payload.usage_limit),
      };

      const response = await api.post<VoucherCreateResponse>(
        "/api/v1/voucher-code",
        formattedPayload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Voucher created successfully!");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || "Failed to create voucher";
      toast.error(message);
    },
  });
};
