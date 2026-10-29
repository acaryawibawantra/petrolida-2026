"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import {
  useGetAllCompetitionNames,
  useGetMyTeam,
} from "@/hooks/use-competition";
import { getCompetitionSlugFromName } from "@/lib/competition-identity";
import { getStageColors, getStatusColors } from "@/lib/competition-utils";
import { cn } from "@/lib/utils";

const competitionColorBySlug: Record<string, string> = {
  "business-case": "bg-blue-600",
  "case-study": "bg-green-600",
  "fracturing-fluid-design": "bg-pink-400",
  "geothermal-case": "bg-red-500",
  "oil-rig-design": "bg-orange-500",
  "paper-and-poster": "bg-blue-500",
  petrosmart: "bg-pink-500",
  "plan-of-development": "bg-purple-500",
};

interface Competition {
  id: string;
  name: string;
  slug: string;
  color: string;
  max_member: number;
}

export default function CompetitionHomePage() {
  const BREADCRUMBS = [{ name: "Home", href: "/competition/dashboard/user" }];
  const { data, isLoading } = useGetMyTeam();
  const { data: competitionsData, isLoading: isLoadingCompetitions } =
    useGetAllCompetitionNames();
  const competitionData = data?.data;

  // Transform API data to match component structure
  const availableCompetitions: Competition[] =
    competitionsData?.data?.map((comp: any) => {
      const slug =
        getCompetitionSlugFromName(comp.name) ||
        comp.name.toLowerCase().replace(/\s+/g, "-");
      return {
        id: comp.id,
        name: comp.name,
        slug,
        color: competitionColorBySlug[slug] || "bg-gray-500",
        max_member: comp.max_member,
      };
    }) || [];

  // Show skeleton while loading competitions for better UX
  const showCompetitionSkeleton =
    isLoadingCompetitions && availableCompetitions.length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
        <Typography
          variant="h1"
          weight="bold"
          className="max-xl:!text-3xl text-white"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
        >
          Home
        </Typography>
        <BreadcrumbGroup
          items={BREADCRUMBS}
          textColor="text-white"
          activeColor="text-white"
          separatorColor="text-white"
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <div className="space-y-8">
          {/* Hero Banner with Background Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[200px]">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/competition/bg-banner.png')",
              }}
            />

            {/* Content */}
            <div className="relative z-10 px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex-1 text-white max-w-xl">
                <Typography
                  variant="h1"
                  weight="bold"
                  font="Melodrame"
                  className="text-white mb-4 italic leading-tight"
                >
                  Be Part of the Challenge!
                </Typography>
                <Typography
                  variant="h6"
                  className="text-white text-base leading-relaxed"
                >
                  {competitionData
                    ? "You're registered! Check your profile for details."
                    : "Let's choose the competition and register your team!"}
                </Typography>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto md:ml-4">
                {!competitionData && (
                  <Link
                    href="/competition/register"
                    className="w-full md:w-auto"
                  >
                    <Button
                      variant="secondary"
                      size="md"
                      className="bg-primary-700 text-white hover:bg-primary-800 px-6 py-3 font-semibold shadow-lg w-full md:w-[180px]"
                    >
                      Register Now
                    </Button>
                  </Link>
                )}
                <Link
                  href="https://petrolida.com/link/InvitationLetterComp2026"
                  target="_blank"
                  className="w-full md:w-auto"
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 font-semibold w-full md:w-[180px]"
                  >
                    Invitation Letter
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Competition Info Cards - Only show if registered */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skeleton Cards */}
              <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg border border-white/20">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="rounded-xl bg-gray-100 p-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="rounded-xl bg-gray-100 p-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg border border-white/20">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : competitionData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Activity Status Card */}
              <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg border border-white/20">
                <Typography
                  variant="h3"
                  weight="bold"
                  className="mb-4 text-gray-900"
                >
                  Activity Status
                </Typography>
                <div className="space-y-3">
                  <div
                    className={cn(
                      "rounded-xl p-4 border",
                      getStatusColors(competitionData.status).bg,
                      getStatusColors(competitionData.status).border,
                    )}
                  >
                    <Typography
                      variant="p"
                      className="text-sm text-gray-700 mb-1"
                    >
                      Registration Status
                    </Typography>
                    <Typography
                      variant="h4"
                      weight="bold"
                      className={cn(
                        "capitalize",
                        getStatusColors(competitionData.status).text,
                      )}
                    >
                      {competitionData.status}
                    </Typography>
                  </div>
                  <div
                    className={cn(
                      "rounded-xl p-4 border",
                      getStageColors(competitionData.stage).bg,
                      getStageColors(competitionData.stage).border,
                    )}
                  >
                    <Typography
                      variant="p"
                      className="text-sm text-gray-700 mb-1"
                    >
                      Current Stage
                    </Typography>
                    <Typography
                      variant="h4"
                      weight="bold"
                      className={cn(
                        "capitalize",
                        getStageColors(competitionData.stage).text,
                      )}
                    >
                      {competitionData.stage}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Team Info Card */}
              <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg border border-white/20">
                <Typography
                  variant="h3"
                  weight="bold"
                  className="mb-4 text-gray-900"
                >
                  Team Information
                </Typography>
                <div className="space-y-3">
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Team Name
                    </Typography>
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      {competitionData.team_name}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Competition
                    </Typography>
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      {competitionData.event_name}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      University
                    </Typography>
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      {competitionData.university}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Members
                    </Typography>
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      {competitionData.participants.length} Participant(s)
                    </Typography>
                  </div>
                </div>
              </div>

              {competitionData.whatsapp_group && (
                <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg border border-white/20">
                  <Typography
                    variant="h3"
                    weight="bold"
                    className="mb-4 text-gray-900"
                  >
                    WhatsApp Group
                  </Typography>
                  <Typography variant="p" className="text-gray-600 mb-4">
                    Join the official group to receive updates and announcements
                    for your competition.
                  </Typography>
                  <Link
                    href={competitionData.whatsapp_group}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full bg-green-500 hover:bg-green-600 text-white gap-2"
                      leftIcon={MessageCircle}
                    >
                      Join WhatsApp Group
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-lg border border-white/20 text-center">
                <Typography
                  variant="h3"
                  weight="bold"
                  className="mb-4 text-gray-900"
                >
                  No Competition Registered
                </Typography>
                <Typography variant="p" className="text-gray-600 mb-6">
                  You haven't registered for any competition yet. Choose one
                  below to get started!
                </Typography>
              </div>

              {/* Competition Cards Grid */}
              {showCompetitionSkeleton ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-gray-200 animate-pulse h-[220px]"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCompetitions.map((comp) => (
                    <Link
                      key={comp.id}
                      href={`/competition/register?comp=${comp.slug}`}
                    >
                      <div
                        className={cn(
                          "group relative rounded-2xl p-6 text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg h-[220px] flex flex-col justify-between overflow-hidden border border-white/20",
                          comp.color,
                        )}
                      >
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Content */}
                        <div className="relative z-10 flex-1 flex flex-col justify-between">
                          <div className="flex-1 flex items-start">
                            <Typography
                              variant="h4"
                              weight="bold"
                              className="text-white leading-tight line-clamp-3"
                            >
                              {comp.name}
                            </Typography>
                          </div>

                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                            >
                              Register Now
                            </Button>
                          </div>
                        </div>

                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
