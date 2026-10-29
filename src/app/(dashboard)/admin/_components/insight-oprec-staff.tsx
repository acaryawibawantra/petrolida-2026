"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import Typography from "@/components/typography";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  useGetOprecStaffDailyInsight,
  useGetOprecStaffDepartmentCount,
  useGetOprecStaffSubdivisionCount,
} from "@/hooks/use-oprec-staff";

const chartConfig = {
  count: {
    label: "Count",
    color: "#000",
  },
  data: {
    label: "Major",
    color: "#000",
  },
} satisfies ChartConfig;

export default function InsightOprecStaff() {
  const { dailyData: COUNT } = useGetOprecStaffDailyInsight();
  const { departmentData: DEPARTMENT } = useGetOprecStaffDepartmentCount();
  const { subdivisionData: DIVITION } = useGetOprecStaffSubdivisionCount();

  return (
    <div className="mt-6 flex flex-col gap-6 max-lg:mt-0">
      <div className="flex flex-col gap-4">
        <Typography variant="h3" weight="semibold">
          Daily Count Oprec Staff
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
      <div className="flex flex-col gap-4">
        <Typography variant="h3" weight="semibold">
          Count Department Registrant
        </Typography>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart layout="vertical" accessibilityLayer data={DEPARTMENT}>
            <CartesianGrid vertical={true} />
            <XAxis type="number" />
            <YAxis width={180} dataKey="department" type="category" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#FE6622" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="flex flex-col gap-4">
        <Typography variant="h3" weight="semibold">
          Count Subdivition Registrant
        </Typography>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart layout="vertical" accessibilityLayer data={DIVITION}>
            <CartesianGrid vertical={false} />
            <XAxis type="number" />
            <YAxis width={180} dataKey="subdivision" type="category" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#FE6622" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
