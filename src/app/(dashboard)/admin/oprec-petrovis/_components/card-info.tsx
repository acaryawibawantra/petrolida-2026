"use client";
import { Users } from "lucide-react";

import Typography from "@/components/typography";
import { useGetPetrovisCount } from "../hooks/use-petrovis-admin";

export default function CardInfoPetrovis() {
  const { countData: COUNT } = useGetPetrovisCount();

  return (
    <div className="mt-9 grid grid-cols-2 gap-6 max-lg:gap-2 xl:grid-cols-4">
      <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 shadow-sm text-card-foreground transition-all hover:shadow-md">
        <Typography
          variant="p"
          className="text-muted-foreground font-medium uppercase tracking-wider text-xs"
        >
          Registrants
        </Typography>
        <div className="flex items-center gap-2">
          <Users size={28} className="text-primary" />
          <Typography variant="h2" weight="bold" className="text-3xl">
            {COUNT?.register ?? 0}
          </Typography>
        </div>
      </div>
    </div>
  );
}
