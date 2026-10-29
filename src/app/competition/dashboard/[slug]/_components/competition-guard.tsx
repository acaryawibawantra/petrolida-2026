"use client";

import Typography from "@/components/typography";
import {
  useGetCompetitionNameById,
  useGetMyTeam,
} from "@/hooks/use-competition";
import { getCompetitionSlugFromName } from "@/lib/competition-identity";
import { getCompetitionSlug } from "@/lib/competition-utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface CompetitionGuardProps {
  children: React.ReactNode;
}

export default function CompetitionGuard({ children }: CompetitionGuardProps) {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: teamData, isLoading, isError } = useGetMyTeam();

  // Fetch competition name by event_id
  const { data: competitionNameData, isLoading: isLoadingCompetitionName } =
    useGetCompetitionNameById(teamData?.data?.event_id || "");

  useEffect(() => {
    if (
      !isLoading &&
      !isLoadingCompetitionName &&
      teamData?.data &&
      competitionNameData?.data
    ) {
      // Generate slug from fetched competition name
      const teamSlug =
        getCompetitionSlugFromName(competitionNameData.data.name) ||
        getCompetitionSlug(competitionNameData.data.name);

      // Check if user is trying to access a different competition
      if (teamSlug !== slug) {
        router.push(`/competition/dashboard/${teamSlug}`);
      }
    }

    // If no team data and not loading, redirect to user page
    if (!isLoading && (!teamData?.data || isError)) {
      router.push("/competition/dashboard/user");
    }
  }, [
    isLoading,
    isLoadingCompetitionName,
    teamData,
    competitionNameData,
    slug,
    router,
    isError,
  ]);

  if (isLoading || isLoadingCompetitionName) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Typography variant="h3" className="text-white">
          Loading...
        </Typography>
      </div>
    );
  }

  if (!teamData?.data || isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Typography variant="h3" className="text-white text-center">
          You are not registered in any competition
        </Typography>
        <Typography variant="p" className="text-gray-300 text-center">
          Redirecting to dashboard...
        </Typography>
      </div>
    );
  }

  // If user is accessing wrong competition, show loading while redirecting
  if (competitionNameData?.data) {
    const teamSlug =
      getCompetitionSlugFromName(competitionNameData.data.name) ||
      getCompetitionSlug(competitionNameData.data.name);
    if (teamSlug !== slug) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Typography variant="h3" className="text-white text-center">
            Redirecting to your competition...
          </Typography>
        </div>
      );
    }
  }

  return <>{children}</>;
}
