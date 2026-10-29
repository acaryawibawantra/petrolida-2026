"use client";

import Typography from "@/components/typography";
import { useGetCompetitionOutcomeStats } from "@/hooks/use-competition";
import { Trophy, Users } from "lucide-react";

type CompetitionOutcomeStatsProps = {
  eventId: string;
};

function StatCard({
  label,
  value,
  description,
  className,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  className: string;
  icon: typeof Users;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Typography variant="p" className="text-sm font-medium opacity-80">
            {label}
          </Typography>
          <Typography variant="h2" weight="bold" className="mt-2">
            {value}
          </Typography>
          <Typography variant="p" className="mt-1 text-sm opacity-80">
            {description}
          </Typography>
        </div>
        <div className="rounded-full bg-white/30 p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function CompetitionOutcomeStats({
  eventId,
}: CompetitionOutcomeStatsProps) {
  const { data, isLoading } = useGetCompetitionOutcomeStats(eventId);
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[140px] animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      label: "Total Registrants",
      value: stats.total_registrants,
      description: "All teams registered for this competition.",
      className: "bg-[#DDD] text-[#1F2937] border-[#D1D5DB]",
      icon: Users,
    },
    {
      label: "Active Preliminary",
      value: stats.active_preliminary,
      description: "Teams currently in preliminary stage.",
      className: "bg-[#C5D8E7] text-[#4580B2] border-[#B7C8D6]",
      icon: Trophy,
    },
    {
      label: "Passed Preliminary",
      value: stats.passed_preliminary,
      description: "Teams that advanced beyond preliminary.",
      className: "bg-[#DDF3E8] text-[#15803D] border-[#BFE8CC]",
      icon: Trophy,
    },
    {
      label: "Failed Preliminary",
      value: stats.failed_preliminary,
      description: "Teams eliminated after preliminary.",
      className: "bg-[#FFE4E6] text-[#BE123C] border-[#F5C2CB]",
      icon: Trophy,
    },
    ...(stats.has_semifinal
      ? [
          {
            label: "Active Semifinal",
            value: stats.active_semifinal,
            description: "Teams currently in semifinal stage.",
            className: "bg-[#E6D5F5] text-[#9333EA] border-[#DAC2ED]",
            icon: Trophy,
          },
          {
            label: "Passed Semifinal",
            value: stats.passed_semifinal,
            description: "Teams that secured a final slot.",
            className: "bg-[#FFE5B4] text-[#B45309] border-[#FFD48A]",
            icon: Trophy,
          },
          {
            label: "Failed Semifinal",
            value: stats.failed_semifinal,
            description: "Teams eliminated after semifinal.",
            className: "bg-[#FEE2E2] text-[#B91C1C] border-[#F9C6C6]",
            icon: Trophy,
          },
        ]
      : []),
    {
      label: "Finalists",
      value: stats.finalists,
      description: "Teams currently competing in the final stage.",
      className: "bg-[#B0E3D1] text-[#047857] border-[#9ED8C0]",
      icon: Trophy,
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
