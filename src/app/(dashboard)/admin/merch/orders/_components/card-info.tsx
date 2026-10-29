"use client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Clock, Package, Truck, XCircle } from "lucide-react";

import Typography from "@/components/typography";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";

interface MerchStats {
  total_order: number;
  cancelled: number;
  shipped: number;
  delivered: number;
  pending?: number;
}

export default function CardInfoMerchOrders() {
  const { data: statsData } = useQuery<AxiosResponse<ApiResponse<MerchStats>>>({
    queryKey: ["merch-stats"],
    queryFn: async () => {
      const response = await api.get("/api/v1/merch/status/count");
      return response;
    },
    staleTime: Infinity,
  });

  const STATS = statsData?.data.data;

  // Assume pending is total_order - (cancelled + shipped + delivered) if not explicitly returned
  // But usually endpoint returns specific counts.
  // The user prompt showed counts for total_order, etc.
  // Let's rely on what the API return structure was:
  // "data": { "total_order": 10, "cancelled": 0, "shipped": 0, "delivered": 0 }
  // So pending calculation might be needed or it's implicitly part of what's left.
  // We'll calculate pending as diff for now if not present, or maybe API returns it.
  // User Prompt said:
  // "data": { "total_order": 10, "cancelled": 0, "shipped": 0, "delivered": 0 }
  // So pending = total_order - (cancelled + shipped + delivered)
  const pending =
    (STATS?.total_order ?? 0) -
    ((STATS?.cancelled ?? 0) + (STATS?.shipped ?? 0) + (STATS?.delivered ?? 0));

  return (
    <div className="mt-9 grid grid-cols-2 gap-6 max-lg:gap-2 xl:grid-cols-4">
      {/* Pending */}
      <div className="flex w-full flex-col items-center gap-2 rounded-lg border bg-[#FDECB6] p-4 lg:w-[240px]">
        <Typography variant="p" className="text-[#E3B111]">
          Pending
        </Typography>
        <div className="flex items-center gap-2">
          <Clock className="text-[#E3B111]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#E3B111]">
            {pending > 0 ? pending : 0}
          </Typography>
        </div>
      </div>

      {/* Shipped */}
      <div className="flex w-full flex-col items-center gap-2 rounded-lg border bg-[#82AACB]/20 p-4 lg:w-[240px]">
        <Typography variant="p" className="text-[#82AACB]">
          Shipped
        </Typography>
        <div className="flex items-center gap-2">
          <Truck className="text-4xl text-[#82AACB]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#82AACB]">
            {STATS?.shipped ?? 0}
          </Typography>
        </div>
      </div>

      {/* Delivered */}
      <div className="flex w-full flex-col items-center gap-2 rounded-lg border bg-[#C0CDC5] p-4 lg:w-[240px]">
        <Typography variant="p" className="text-[#335F43]">
          Delivered
        </Typography>
        <div className="flex items-center gap-2">
          <Package className="text-4xl text-[#335F43]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#335F43]">
            {STATS?.delivered ?? 0}
          </Typography>
        </div>
      </div>

      {/* Canceled */}
      <div className="flex w-full flex-col items-center gap-2 rounded-lg border bg-[#F8C6CC] p-4 lg:w-[240px]">
        <Typography variant="p" className="text-[#E94759]">
          Canceled
        </Typography>
        <div className="flex items-center gap-2">
          <XCircle className="text-4xl text-[#E94759]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#E94759]">
            {STATS?.cancelled ?? 0}
          </Typography>
        </div>
      </div>
    </div>
  );
}
