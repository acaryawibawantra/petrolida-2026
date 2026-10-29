"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import Typography from "@/components/typography";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useGetMerchInsight from "@/hooks/use-get-merch-insight";

const chartConfig = {
  count: {
    label: "Count",
    color: "#000",
  },
} satisfies ChartConfig;

export default function InsightMerch() {
  const { dailyData: COUNT } = useGetMerchInsight();

  return (
    <div className="mt-6 flex flex-col gap-6 max-lg:mt-0">
      <div className="flex flex-col gap-4">
        <Typography variant="h3" weight="semibold">
          Daily Count Merch
        </Typography>
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
