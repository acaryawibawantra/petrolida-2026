"use client";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import Typography from "@/components/typography";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPbmBatch } from "@/hooks/use-master-data";
import { useGetPbmInsight } from "@/hooks/use-pbm";

const chartConfig = {
  count: {
    label: "Count",
    color: "#000",
  },
} satisfies ChartConfig;

export default function InsightPbm() {
  const { batchList, isLoading: isBatchLoading } = useGetPbmBatch();
  const [selectedBatchId, setSelectedBatchId] = useState<string>("all");

  const { dailyData: COUNT } = useGetPbmInsight(selectedBatchId);

  return (
    <div className="mt-6 flex flex-col gap-6 max-lg:mt-0">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
          <Typography variant="h3" weight="semibold">
            Daily Count PBM Registration
          </Typography>
          <div className="flex flex-col gap-2 max-md:w-full">
            <Typography variant="bt" className="!text-sm font-medium">
              Filter by Batch
            </Typography>
            <Select
              onValueChange={setSelectedBatchId}
              value={selectedBatchId}
              disabled={isBatchLoading}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batchList?.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={COUNT}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={20}
              angle={-15}
              height={100}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#FE6622" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
