"use client";
import { Users } from "lucide-react";

import Typography from "@/components/typography";
import { useGetPbmCount } from "@/hooks/use-pbm";

export default function CardInfoPbm() {
  const { countData: COUNT } = useGetPbmCount();

  return (
    <div className="mt-9 grid grid-cols-1 gap-6 max-lg:gap-2">
      <div className="flex w-full flex-col items-center gap-2 rounded-lg border bg-[#DDD] p-4 lg:w-[240px]">
        <Typography variant="p">Total Participant</Typography>
        <div className="flex items-center gap-2">
          <Users size={32} />
          <Typography variant="h2" weight="medium">
            {COUNT?.total_participant ?? 0}
          </Typography>
        </div>
      </div>
    </div>
  );
}
