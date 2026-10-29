"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import Typography from "@/components/typography";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetCompetitionUniversityChart } from "@/hooks/use-competition";
import { CompetitionUniversityChartItem } from "@/services/competition";

const chartConfig = {
  team_count: {
    label: "Teams",
    color: "#357182",
  },
} satisfies ChartConfig;

export default function InsightCompetitionUniversityChart() {
  const { data } = useGetCompetitionUniversityChart();
  const chartData: CompetitionUniversityChartItem[] = data?.data ?? [];

  return (
    <div className="mt-6 flex flex-col gap-4 max-lg:mt-0">
      <div className="flex flex-col gap-2">
        <Typography variant="h3" weight="semibold">
          Competition University Chart
        </Typography>
        <Typography variant="p" className="text-sm text-gray-600">
          Team distribution by university across competitions
        </Typography>
      </div>

      <ChartContainer config={chartConfig} className="min-h-[360px] w-full">
        <BarChart
          layout="vertical"
          accessibilityLayer
          data={chartData}
          margin={{ left: 24, right: 24 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="university"
            width={220}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="team_count" fill="#357182" radius={6} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
