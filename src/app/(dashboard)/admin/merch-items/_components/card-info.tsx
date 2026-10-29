"use client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { CircleX, Package, PackageCheck, PackageMinus } from "lucide-react";

import Typography from "@/components/typography";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";

interface CountList {
  total_item: number;
  instock: number;
  low_stock: number;
  out_of_stock: number;
}

export default function CardInfoMerchItems() {
  const { data: countMerch } = useQuery<AxiosResponse<ApiResponse<CountList>>>({
    queryKey: ["countMerch"],
    queryFn: async () => {
      const response = await api.get("/api/v1/merch/count");
      return response;
    },
    staleTime: Infinity,
  });
  const COUNT = countMerch?.data.data;

  return (
    <div className="mt-9 grid grid-cols-2 gap-6 max-lg:gap-2 xl:grid-cols-4">
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#DDD] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p">Total Item</Typography>
        <div className="flex items-center gap-2">
          <Package size={32} />
          <Typography variant="h2" weight="medium">
            {COUNT?.total_item ?? 0}
          </Typography>
        </div>
      </div>
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#C0CDC5] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#335F43]">
          In Stock
        </Typography>
        <div className="flex items-center gap-2">
          <PackageCheck className="text-4xl text-[#335F43]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#335F43]">
            {COUNT?.instock ?? 0}
          </Typography>
        </div>
      </div>
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#FDECB6] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#E3B111]">
          Low Stock
        </Typography>
        <div className="flex items-center gap-2">
          <PackageMinus className="text-[#E3B111]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#E3B111]">
            {COUNT?.low_stock ?? 0}
          </Typography>
        </div>
      </div>
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#F8C6CC] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#E94759]">
          Out Of Stock
        </Typography>
        <div className="flex items-center gap-2">
          <CircleX className="text-4xl text-[#E94759]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#E94759]">
            {COUNT?.out_of_stock ?? 0}
          </Typography>
        </div>
      </div>
    </div>
  );
}
