"use client";

import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";
import { useGetAllCompetitionNames } from "@/hooks/use-competition";
import {
  getCompetitionIdentityBySlug,
  resolveCompetitionEventBySlug,
} from "@/lib/competition-identity";
import CompetitionOutcomeStats from "./competition-outcome-stats";
import CompetitionAdminTable from "./competition-table";

type CompetitionAdminPageProps = {
  slug: string;
};

export default function CompetitionAdminPage({
  slug,
}: CompetitionAdminPageProps) {
  const identity = getCompetitionIdentityBySlug(slug);
  const { data: competitionNames, isLoading } = useGetAllCompetitionNames();

  const event = resolveCompetitionEventBySlug(competitionNames?.data, slug);
  const eventId = event?.id;

  if (!identity) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Typography variant="h3" className="text-gray-500">
          Competition not found
        </Typography>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Dashboard", href: "/admin" },
    { name: identity.displayName, href: identity.adminPath },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          {identity.displayName}
        </Typography>
        <BreadcrumbGroup items={breadcrumbs} />
      </div>
      <div className="max-w-[90dvw]">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        ) : !eventId ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-center">
            <Typography variant="h3" className="text-gray-700">
              Competition event not found
            </Typography>
            <Typography variant="p" className="max-w-xl text-gray-500">
              The admin table could not resolve the event ID for{" "}
              {identity.displayName}. Please check the event name returned by
              the competition names API.
            </Typography>
          </div>
        ) : (
          <>
            <CompetitionOutcomeStats eventId={eventId} />
            <CompetitionAdminTable eventId={eventId} slug={slug} />
          </>
        )}
      </div>
    </div>
  );
}
