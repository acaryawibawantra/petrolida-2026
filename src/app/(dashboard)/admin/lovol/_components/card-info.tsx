"use client";
import { CircleCheckBig, CircleX, Newspaper, Users } from "lucide-react";

import Typography from "@/components/typography";
import { useGetLovolCount } from "@/hooks/use-lovol";

export default function CardInfoLovol() {
  const { countData: COUNT } = useGetLovolCount();

  return (
    <div className="mt-9 grid grid-cols-2 gap-6 max-lg:gap-2 xl:grid-cols-4">
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#DDD] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p">Registrant</Typography>
        <div className="flex items-center gap-2">
          <Users size={32} />
          <Typography variant="h2" weight="medium">
            {COUNT?.register ?? 0}
          </Typography>
        </div>
      </div>
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#B0E3D1] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#00A56B]">
          Accepted
        </Typography>
        <div className="flex items-center gap-2">
          <CircleCheckBig className="text-[#00A56B]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#00A56B]">
            {COUNT?.accepted ?? 0}
          </Typography>
        </div>
      </div>
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#C5D8E7] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#4580B2]">
          Interviewed
        </Typography>
        <div className="flex items-center gap-2">
          <Newspaper className="text-4xl text-[#4580B2]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#4580B2]">
            {COUNT?.interviewed ?? 0}
          </Typography>
        </div>
      </div>
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#F8C6CC] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#E94759]">
          Rejected
        </Typography>
        <div className="flex items-center gap-2">
          <CircleX className="text-4xl text-[#E94759]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#E94759]">
            {COUNT?.rejected ?? 0}
          </Typography>
        </div>
      </div>
    </div>
  );
}
