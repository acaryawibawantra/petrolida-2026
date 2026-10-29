"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import Typography from "@/components/typography";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetCompetitionAngkatanChart } from "@/hooks/use-competition";
import { CompetitionAngkatanChartItem } from "@/services/competition";

const chartConfig = {
  team_count: {
    label: "Teams",
    color: "#FE6622",
  },
} satisfies ChartConfig;

export default function InsightCompetitionAngkatanChart() {
  const { data } = useGetCompetitionAngkatanChart();
  const chartData: CompetitionAngkatanChartItem[] = data?.data ?? [];

  return (
    <div className="mt-6 flex flex-col gap-4 max-lg:mt-0">
      <div className="flex flex-col gap-2">
        <Typography variant="h3" weight="semibold">
          Competition Angkatan Chart
        </Typography>
        <Typography variant="p" className="text-sm text-gray-600">
          Team distribution by batch year across competitions
        </Typography>
      </div>

      <ChartContainer config={chartConfig} className="min-h-[320px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="angkatan" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="team_count" fill="#FE6622" radius={6} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
