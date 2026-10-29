import api from "@/lib/api";
import { ApiResponse, PaginatedApiResponse } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
// Types
export interface MerchOrder {
  id: string;
  name: string; // Changed from user_name
  status:
    | "pending"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "success"; // Added success
  total_price: string; // Changed from price number to string
  item: string; // Changed from product_name
  order_id?: string;
  unique_code?: string;
}

export interface MerchStats {
  total_order: number;
  cancelled: number;
  shipped: number;
  delivered: number;
  pending?: number; // inferred, usually part of stats
}

export interface MerchTotalPayment {
  total_payment: number;
}

export interface MerchProductTransaction {
  id: string;
  product_name: string;
  asset_link: string;
  size: string;
  variant: string;
  amount: number;
}

export interface MerchOrderDetail {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  line_id: string;
  status:
    | "pending"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "success";
  delivery_address: string;
  is_delivery: boolean;
  total_price: string;
  invoice_url: string;
  shipping_price: string;
  order_id: string;
  unique_code: string;
  product_transactions: MerchProductTransaction[];
}

// Hooks

// Get All Orders
export function useGetMerchOrders(params?: any) {
  return useQuery<PaginatedApiResponse<MerchOrder[]>>({
    queryKey: ["merch-orders", params],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/transactions", { params });
      return data;
    },
  });
}

// Get Single Transaction Detail
export function useGetMerchTransaction(id: string) {
  return useQuery<ApiResponse<MerchOrderDetail>>({
    queryKey: ["merch-transaction", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/transactions/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// Get Order Stats
export function useGetMerchStats() {
  return useQuery<ApiResponse<MerchStats>>({
    queryKey: ["merch-stats"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/merch/status/count");
      return data;
    },
  });
}

// Get Total Payment
export function useGetMerchTotalPayment() {
  return useQuery<ApiResponse<MerchTotalPayment>>({
    queryKey: ["merch-total-payment"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/merch/payment/total");
      return data;
    },
  });
}

// Update Order Status
export function useMerchOrderActions() {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "cancelled" | "shipped" | "delivered";
    }) => {
      const { data } = await api.put(`/api/v1/merch/status/${status}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merch-orders"] });
      queryClient.invalidateQueries({ queryKey: ["merch-stats"] });
      queryClient.invalidateQueries({ queryKey: ["merch-transaction"] });
      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      console.error("Update status error:", error);
      toast.error("Failed to update order status");
    },
  });

  return {
    updateStatus,
  };
}
