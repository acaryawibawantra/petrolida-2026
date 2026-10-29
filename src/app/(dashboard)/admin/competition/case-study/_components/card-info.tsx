"use client";
import Typography from "@/components/typography";
import { useGetAllCompetitionTeams } from "@/hooks/use-competition";
import { CircleCheckBig, FileCheck, Users } from "lucide-react";
import { useMemo } from "react";

export default function CardInfoCompetition({
  stages,
  eventId,
}: { stages: number; eventId: string }) {
  const { data, isLoading } = useGetAllCompetitionTeams({
    page: 1,
    limit: 1000, // Get all teams
    event_id: eventId,
  });

  const COUNT = useMemo(() => {
    if (!data?.rows) {
      return {
        total_teams: 0,
        preliminary: 0,
        semifinal: 0,
        final: 0,
        completed: 0,
      };
    }

    const teams = data.rows;

    return {
      total_teams: teams.length,
      preliminary: teams.filter((team: any) => team.stage === "preliminary")
        .length,
      semifinal: teams.filter((team: any) => team.stage === "semifinal").length,
      final: teams.filter((team: any) => team.stage === "final").length,
      completed: teams.filter((team: any) => team.status === "complete").length,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="mt-9 grid grid-cols-2 gap-6 max-lg:gap-2 xl:grid-cols-4">
        <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-gray-100 p-4 max-lg:w-full lg:w-[240px] animate-pulse">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-8 w-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mt-9 grid grid-cols-2 gap-6 max-lg:gap-2 ${stages === 3 ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}
    >
      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#DDD] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p">Registrant</Typography>
        <div className="flex items-center gap-2">
          <Users size={32} />
          <Typography variant="h2" weight="medium">
            {COUNT.total_teams}
          </Typography>
        </div>
      </div>

      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#C5D8E7] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#4580B2]">
          Preliminary
        </Typography>
        <div className="flex items-center gap-2">
          <FileCheck className="text-[#4580B2]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#4580B2]">
            {COUNT.preliminary}
          </Typography>
        </div>
      </div>

      {stages === 3 && (
        <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#E6D5F5] p-4 max-lg:w-full lg:w-[240px]">
          <Typography variant="p" className="text-[#9333EA]">
            Semifinal
          </Typography>
          <div className="flex items-center gap-2">
            <FileCheck className="text-[#9333EA]" size={32} />
            <Typography variant="h2" weight="medium" className="text-[#9333EA]">
              {COUNT.semifinal}
            </Typography>
          </div>
        </div>
      )}

      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#FFE5B4] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#FF8C00]">
          Final
        </Typography>
        <div className="flex items-center gap-2">
          <FileCheck className="text-[#FF8C00]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#FF8C00]">
            {COUNT.final}
          </Typography>
        </div>
      </div>

      <div className="flex w-[150px] flex-col items-center gap-2 rounded-lg border bg-[#B0E3D1] p-4 max-lg:w-full lg:w-[240px]">
        <Typography variant="p" className="text-[#00A56B]">
          Completed
        </Typography>
        <div className="flex items-center gap-2">
          <CircleCheckBig className="text-[#00A56B]" size={32} />
          <Typography variant="h2" weight="medium" className="text-[#00A56B]">
            {COUNT.completed}
          </Typography>
        </div>
      </div>
    </div>
  );
}
