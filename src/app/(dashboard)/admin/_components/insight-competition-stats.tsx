"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import Typography from "@/components/typography";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import { useGetCompetitionStats } from "@/hooks/use-competition";
import { useState } from "react";

type CompetitionStatSeries = {
  sale_type: string;
  counts: number[];
};

type CompetitionStatItem = {
  event_id: string;
  event_name: string;
  statuses: string[];
  series: CompetitionStatSeries[];
};

const chartConfig = {
  early_bird: {
    label: "Early Bird",
    color: "#F59E0B",
  },
  normal: {
    label: "Normal",
    color: "#2563EB",
  },
  flash_sale: {
    label: "Flash Sale",
    color: "#10B981",
  },
  last_call_sale: {
    label: "Last Call Sale",
    color: "#DC2626",
  },
} satisfies ChartConfig;

const SALE_TYPES = [
  "early_bird",
  "normal",
  "flash_sale",
  "last_call_sale",
] as const;

export default function InsightCompetitionStats() {
  const { data } = useGetCompetitionStats();
  const stats: CompetitionStatItem[] = data?.data ?? [];

  const [selectedEventId, setSelectedEventId] = useState("all");
  const selectedEvent =
    selectedEventId === "all"
      ? null
      : stats.find((item) => item.event_id === selectedEventId);
  const baseStatuses = selectedEvent?.statuses ?? stats[0]?.statuses ?? [];

  const chartData = baseStatuses.map((status, index) => {
    const row: Record<string, number | string> = { status };

    SALE_TYPES.forEach((saleType) => {
      if (selectedEvent) {
        const series = selectedEvent.series.find(
          (s) => s.sale_type === saleType,
        );
        row[saleType] = series?.counts?.[index] ?? 0;
      } else {
        row[saleType] = stats.reduce((sum, item) => {
          const series = item.series.find((s) => s.sale_type === saleType);
          const value = series?.counts?.[index] ?? 0;
          return sum + value;
        }, 0);
      }
    });

    return row;
  });

  return (
    <div className="mt-6 flex flex-col gap-4 max-lg:mt-0">
      <div className="flex flex-col gap-2">
        <Typography variant="h3" weight="semibold">
          Competition Distribution
        </Typography>
        <Typography variant="p" className="text-sm text-gray-600">
          {selectedEvent
            ? `Team distribution for ${selectedEvent.event_name}`
            : "Team distribution aggregated across all competitions"}
        </Typography>
      </div>

      <div className="w-full max-w-md">
        <Select
          value={selectedEventId}
          onValueChange={(value) => setSelectedEventId(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select competition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All competitions</SelectItem>
            {stats.map((item) => (
              <SelectItem key={item.event_id} value={item.event_id}>
                {item.event_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="status" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="early_bird" stackId="total" fill="#F59E0B" radius={4} />
          <Bar dataKey="normal" stackId="total" fill="#2563EB" radius={4} />
          <Bar dataKey="flash_sale" stackId="total" fill="#10B981" radius={4} />
          <Bar
            dataKey="last_call_sale"
            stackId="total"
            fill="#DC2626"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
