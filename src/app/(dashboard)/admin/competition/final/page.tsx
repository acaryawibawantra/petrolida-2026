"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCompetitionFinalDashboard } from "@/hooks/use-competition";
import { getCompetitionSlugFromName } from "@/lib/competition-identity";
import type {
  CompetitionFinalDashboardResponse,
  CompetitionFinalDashboardTeam,
} from "@/services/competition";

const ALL_VALUE = "all";

export default function FinalCompetitionDashboardPage() {
  const { data, isLoading } = useGetCompetitionFinalDashboard();
  const dashboard = data?.data as CompetitionFinalDashboardResponse | undefined;
  const [search, setSearch] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState(ALL_VALUE);
  const [paymentFilter, setPaymentFilter] = useState(ALL_VALUE);
  const [submissionFilter, setSubmissionFilter] = useState(ALL_VALUE);
  const [lateFilter, setLateFilter] = useState(ALL_VALUE);

  const teams = dashboard?.teams ?? [];
  const summary = dashboard?.summary;
  const competitions = dashboard?.by_competition ?? [];
  const faTeams = teams.filter((team) => team.accommodation_count > 0);
  const naTeams = teams.filter((team) => team.non_accommodation_count > 0);
  const unpaidTeams = teams.filter(
    (team) => team.final_payment_status !== "paid",
  );

  const filteredTeams = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return teams.filter((team) => {
      const matchesSearch =
        !normalizedSearch ||
        team.team_name.toLowerCase().includes(normalizedSearch) ||
        team.leader_name.toLowerCase().includes(normalizedSearch) ||
        team.university.toLowerCase().includes(normalizedSearch);
      const matchesCompetition =
        competitionFilter === ALL_VALUE || team.event_id === competitionFilter;
      const matchesPayment =
        paymentFilter === ALL_VALUE ||
        team.final_payment_status === paymentFilter;
      const matchesSubmission =
        submissionFilter === ALL_VALUE ||
        team.submission_status === submissionFilter;
      const matchesLate =
        lateFilter === ALL_VALUE ||
        (lateFilter === "late" && team.is_late) ||
        (lateFilter === "on_time" &&
          team.submission_status === "submitted" &&
          !team.is_late) ||
        (lateFilter === "not_submitted" &&
          team.submission_status === "not_submitted");

      return (
        matchesSearch &&
        matchesCompetition &&
        matchesPayment &&
        matchesSubmission &&
        matchesLate
      );
    });
  }, [
    competitionFilter,
    lateFilter,
    paymentFilter,
    search,
    submissionFilter,
    teams,
  ]);

  const breadcrumbs = [
    { name: "Dashboard", href: "/admin" },
    { name: "Final Dashboard", href: "/admin/competition/final" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Final Dashboard
        </Typography>
        <BreadcrumbGroup items={breadcrumbs} />
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Typography variant="p" weight="medium" className="text-gray-400">
            Loading final dashboard...
          </Typography>
        </div>
      ) : !dashboard ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Finalists" value={summary?.total_finalists} />
            <SummaryCard label="Final Payment Paid" value={summary?.paid} />
            <SummaryCard
              label="Awaiting Payment"
              value={summary?.awaiting_payment}
            />
            <SummaryCard label="Submitted" value={summary?.submitted} />
            <SummaryCard
              label="Late Submissions"
              value={summary?.late_submissions}
            />
            <SummaryCard
              label="Accommodation"
              value={summary?.total_accommodation}
            />
            <SummaryCard
              label="Non Accommodation"
              value={summary?.total_non_accommodation}
            />
            <SummaryCard
              label="Not Attending"
              value={summary?.total_not_attending}
            />
            <SummaryCard
              label="Total Final Fee"
              value={formatCurrency(summary?.total_final_fee ?? 0)}
            />
            <SummaryCard label="FA Teams" value={summary?.fa_team_count} />
            <SummaryCard label="NA Teams" value={summary?.na_team_count} />
            <SummaryCard
              label="Unpaid Teams"
              value={summary?.unpaid_team_count}
            />
            <SummaryCard
              label="Paid Final Fee"
              value={formatCurrency(summary?.paid_final_fee ?? 0)}
            />
            <SummaryCard
              label="Unpaid Final Fee"
              value={formatCurrency(summary?.unpaid_final_fee ?? 0)}
            />
            <SummaryCard
              label="Male Members"
              value={summary?.male_member_count}
            />
            <SummaryCard
              label="Female Members"
              value={summary?.female_member_count}
            />
            <SummaryCard
              label="Unknown Gender"
              value={summary?.unknown_gender_member_count}
            />
          </div>

          <section className="grid gap-4 xl:grid-cols-3">
            <TeamListCard
              title={`FA Teams (${faTeams.length})`}
              teams={faTeams}
              emptyText="No FA team found."
            />
            <TeamListCard
              title={`NA Teams (${naTeams.length})`}
              teams={naTeams}
              emptyText="No NA team found."
            />
            <TeamListCard
              title={`Unpaid Teams (${unpaidTeams.length})`}
              teams={unpaidTeams}
              emptyText="No unpaid team found."
            />
          </section>

          <section className="space-y-4">
            <Typography variant="h3" weight="bold" className="text-gray-900">
              Competition Summary
            </Typography>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader className="bg-[#357182]">
                  <TableRow>
                    <TableHead className="whitespace-nowrap text-white">
                      Competition
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Finalists
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Paid
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Awaiting Payment
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Submitted
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Late
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Accommodation
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Non Accommodation
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Paid Fee
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-white">
                      Unpaid Fee
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitions.length > 0 ? (
                    competitions.map((competition) => (
                      <TableRow key={competition.event_id}>
                        <TableCell className="font-semibold">
                          {competition.event_name}
                        </TableCell>
                        <TableCell>{competition.total_finalists}</TableCell>
                        <TableCell>{competition.paid}</TableCell>
                        <TableCell>{competition.awaiting_payment}</TableCell>
                        <TableCell>{competition.submitted}</TableCell>
                        <TableCell>{competition.late_submissions}</TableCell>
                        <TableCell>{competition.total_accommodation}</TableCell>
                        <TableCell>
                          {competition.total_non_accommodation}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatCurrency(competition.paid_final_fee)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatCurrency(competition.unpaid_final_fee)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        No final-stage teams found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 xl:flex-row">
              <Input
                placeholder="Search team, leader, or university..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="xl:max-w-sm"
              />
              <FilterSelect
                value={competitionFilter}
                onChange={setCompetitionFilter}
                placeholder="Competition"
                options={[
                  { label: "All Competitions", value: ALL_VALUE },
                  ...competitions.map((competition) => ({
                    label: competition.event_name,
                    value: competition.event_id,
                  })),
                ]}
              />
              <FilterSelect
                value={paymentFilter}
                onChange={setPaymentFilter}
                placeholder="Payment"
                options={[
                  { label: "All Payments", value: ALL_VALUE },
                  { label: "Paid", value: "paid" },
                  { label: "Pending", value: "pending" },
                  { label: "Unpaid", value: "unpaid" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
              />
              <FilterSelect
                value={submissionFilter}
                onChange={setSubmissionFilter}
                placeholder="Submission"
                options={[
                  { label: "All Submissions", value: ALL_VALUE },
                  { label: "Submitted", value: "submitted" },
                  { label: "Not Submitted", value: "not_submitted" },
                ]}
              />
              <FilterSelect
                value={lateFilter}
                onChange={setLateFilter}
                placeholder="Late Status"
                options={[
                  { label: "All Late Status", value: ALL_VALUE },
                  { label: "Late", value: "late" },
                  { label: "On Time", value: "on_time" },
                  { label: "Not Submitted", value: "not_submitted" },
                ]}
              />
            </div>

            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader className="bg-[#357182]">
                  <TableRow>
                    {[
                      "Competition",
                      "Team",
                      "Leader",
                      "University",
                      "Payment",
                      "Submission",
                      "Late Duration",
                      "Accommodation",
                      "Non Accommodation",
                      "Members",
                      "Gender",
                      "Total Fee",
                      "Detail",
                    ].map((label) => (
                      <TableHead
                        key={label}
                        className="whitespace-nowrap text-white"
                      >
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                      <TeamRow key={team.team_id} team={team} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} className="h-24 text-center">
                        No final-stage teams found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value?: number | string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Typography variant="p" className="text-sm text-gray-600">
        {label}
      </Typography>
      <Typography variant="h3" weight="bold" className="mt-2 text-primary-700">
        {value ?? 0}
      </Typography>
    </div>
  );
}

function TeamListCard({
  title,
  teams,
  emptyText,
}: {
  title: string;
  teams: CompetitionFinalDashboardTeam[];
  emptyText: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Typography variant="p" weight="bold" className="text-gray-900">
        {title}
      </Typography>
      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div
              key={`${title}-${team.team_id}`}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div className="font-semibold text-gray-900">
                {team.team_name}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {team.event_name} - {team.university}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                FA {team.accommodation_count} / NA{" "}
                {team.non_accommodation_count} / Fee{" "}
                {formatCurrency(team.total_fee)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">{emptyText}</p>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="xl:w-[190px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TeamRow({ team }: { team: CompetitionFinalDashboardTeam }) {
  const slug = getCompetitionSlugFromName(team.event_name);
  const detailHref = slug
    ? `/admin/competition/${slug}/${team.team_id}`
    : undefined;

  return (
    <TableRow>
      <TableCell className="min-w-[160px]">{team.event_name}</TableCell>
      <TableCell className="min-w-[160px] font-semibold">
        {team.team_name}
      </TableCell>
      <TableCell className="min-w-[150px]">{team.leader_name}</TableCell>
      <TableCell className="min-w-[180px]">{team.university}</TableCell>
      <TableCell>
        <PaymentBadge status={team.final_payment_status} />
      </TableCell>
      <TableCell>
        <SubmissionBadge team={team} />
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {team.is_late ? team.late_duration_text : "-"}
      </TableCell>
      <TableCell>{team.accommodation_count}</TableCell>
      <TableCell>{team.non_accommodation_count}</TableCell>
      <TableCell className="min-w-[260px]">
        <div className="font-semibold">{team.member_count} member(s)</div>
        <div className="mt-1 space-y-1 text-sm text-gray-600">
          {team.participants?.map((participant) => (
            <div key={`${team.team_id}-${participant.name}`}>
              {participant.name} -{" "}
              {participant.final_accommodation_type?.replace("_", " ") ||
                "not attending"}{" "}
              - {toTitle(participant.gender || "unknown")}
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        M {team.male_count} / F {team.female_count} / U{" "}
        {team.unknown_gender_count}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {formatCurrency(team.total_fee)}
      </TableCell>
      <TableCell>
        {detailHref ? (
          <Link href={detailHref}>
            <Button variant="ghost" size="sm" className="!text-sm">
              View Detail
            </Button>
          </Link>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const normalizedStatus = status || "unpaid";
  const variant =
    normalizedStatus === "paid"
      ? "success"
      : normalizedStatus === "pending"
        ? "warning"
        : normalizedStatus === "unpaid"
          ? "destructive"
          : "secondary";

  return <Badge variant={variant}>{toTitle(normalizedStatus)}</Badge>;
}

function SubmissionBadge({
  team,
}: {
  team: CompetitionFinalDashboardTeam;
}) {
  if (team.submission_status !== "submitted") {
    return <Badge variant="secondary">Not Submitted</Badge>;
  }

  return team.is_late ? (
    <Badge variant="destructive">Late</Badge>
  ) : (
    <Badge variant="success">Submitted</Badge>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-white">
      <Typography variant="p" className="text-gray-500">
        No final-stage teams found.
      </Typography>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function toTitle(value: string) {
  return value
    .replace("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
