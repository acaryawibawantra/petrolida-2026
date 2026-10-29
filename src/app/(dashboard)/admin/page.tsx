"use client";
import React, { useState } from "react";

import Typography from "@/components/typography";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import BreadcrumbGroup from "@/components/breadcrumb";
import InsightCompetitionAngkatanChart from "./_components/insight-competition-angkatan-chart";
import InsightCompetitionStats from "./_components/insight-competition-stats";
import InsightCompetitionUniversityChart from "./_components/insight-competition-university-chart";
import InsightMerch from "./_components/insight-non-competition-merch";
import InsightPbm from "./_components/insight-non-competition-pbm";
import InsightOprecLovol from "./_components/insight-oprec-lovol";
import InsightOprecStaff from "./_components/insight-oprec-staff";
import InsightShortLink from "./_components/insight-short-link";

interface InsightItem {
  name: string;
  component?: React.ReactElement;
}

interface InsightGroup {
  label: string;
  list: InsightItem[];
}

export default function DashboardAdmin() {
  const InsightList: InsightGroup[] = [
    {
      label: "General",
      list: [
        {
          name: "Oprec Staff",
          component: <InsightOprecStaff />,
        },
        {
          name: "Oprec LOVOL",
          component: <InsightOprecLovol />,
        },
        {
          name: "Short Link",
          component: <InsightShortLink />,
        },
        {
          name: "Merch",
          component: <InsightMerch />,
        },
      ],
    },
    {
      label: "Non-Competition",
      list: [
        {
          name: "PBM",
          component: <InsightPbm />,
        },
      ],
    },
    {
      label: "Competition",
      list: [
        {
          name: "Competition Stats",
          component: <InsightCompetitionStats />,
        },
        {
          name: "Competition University Chart",
          component: <InsightCompetitionUniversityChart />,
        },
        {
          name: "Competition Angkatan Chart",
          component: <InsightCompetitionAngkatanChart />,
        },
      ],
    },
  ];

  const [insight, setInsight] = useState("Competition Stats");

  const BREADCRUMBS = [{ name: "Dashboard", href: "/admin" }];

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Dashboard
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>
      <div className="mt-10 flex flex-col">
        <div className="flex flex-col gap-2">
          <Typography variant="bt" className="!text-base font-semibold">
            Select Insight
          </Typography>
          <Select
            onValueChange={(event) => {
              setInsight(event);
            }}
            defaultValue="Competition Stats"
          >
            <SelectTrigger className="w-full lg:w-1/4">
              <SelectValue placeholder="Select a Insight" />
            </SelectTrigger>
            <SelectContent>
              {InsightList.map((e, index) => (
                <SelectGroup key={index}>
                  <SelectLabel>{e.label}</SelectLabel>
                  {e.list.map((e, index) => (
                    <SelectItem key={index} value={e.name}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          {InsightList.map((group, groupIndex) => (
            <React.Fragment key={`insight-group-${groupIndex}`}>
              {group.list
                .filter((items) => items.component !== undefined)
                .map(
                  (items, itemIndex) =>
                    items.name === insight && (
                      <React.Fragment
                        key={`insight-${groupIndex}-${itemIndex}`}
                      >
                        {items.component}
                      </React.Fragment>
                    ),
                )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
