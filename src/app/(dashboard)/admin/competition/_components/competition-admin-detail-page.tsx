"use client";

import type { AxiosError } from "axios";
import { ArrowLeft, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import {
  useGetAllCompetitionNames,
  useGetCompetitionTeamDetail,
  useMarkTeamAsPaid,
  useRejectTeam,
  useUpdateTeamStage,
  useVerifyTeam,
} from "@/hooks/use-competition";
import {
  getCompetitionIdentityBySlug,
  resolveCompetitionEventBySlug,
} from "@/lib/competition-identity";
import { getSalesTypeLabel } from "@/lib/competition-utils";
import type { CompetitionTeamDetail } from "@/services/competition";

type Props = {
  slug: string;
  teamId: string;
};

type ModalType = "verify" | "paid" | "stage" | "reject" | null;

const participantDocuments = [
  { key: "student_id_card", label: "Student Card" },
  { key: "twibbon_ig", label: "Proof of Post Twibbon on Instagram" },
  { key: "story_ig", label: "Proof of Uploaded Twibbon on Story" },
  { key: "follow_ig", label: "Proof of Followed Official Instagram" },
  { key: "follow_linkedin", label: "Proof of Followed Official LinkedIn" },
  { key: "follow_tiktok", label: "Proof of Followed Official TikTok" },
  {
    key: "repost_competition_ig",
    label: "Proof of Repost Competition on Instagram",
  },
] as const;

const submissionDocuments = [
  { key: "submission_1", label: "Submission 1" },
  { key: "submission_2", label: "Submission 2" },
  { key: "submission_3", label: "Submission 3" },
  { key: "submission_4", label: "Submission 4" },
] as const;

function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
      <Typography variant="h3" weight="bold" className="text-gray-900">
        {title}
      </Typography>
      <Typography variant="p" className="max-w-xl text-gray-500">
        {description}
      </Typography>
      {onRetry ? (
        <Button
          variant="secondary"
          onClick={onRetry}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      ) : null}
    </div>
  );
}

function DocumentLink({
  href,
  label = "View document",
}: {
  href?: string;
  label?: string;
}) {
  if (!href) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400">
        <Eye className="h-4 w-4" />
        {label}
      </div>
    );
  }

  return (
    <Link href={href} target="_blank">
      <div className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100">
        <Eye className="h-4 w-4" />
        {label}
      </div>
    </Link>
  );
}

export default function CompetitionAdminDetailPage({ slug, teamId }: Props) {
  const [activeTab, setActiveTab] = useState("");
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedStage, setSelectedStage] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const router = useRouter();
  const identity = getCompetitionIdentityBySlug(slug);
  const {
    data: competitionNames,
    isLoading: isCompetitionNamesLoading,
    refetch: refetchCompetitionNames,
  } = useGetAllCompetitionNames();
  const {
    data: teamData,
    isLoading: isTeamLoading,
    error,
    refetch: refetchTeam,
  } = useGetCompetitionTeamDetail(teamId);
  const { mutate: verifyTeam, isPending: isVerifying } = useVerifyTeam();
  const { mutate: markAsPaid, isPending: isMarkingPaid } = useMarkTeamAsPaid();
  const { mutate: rejectTeam, isPending: isRejecting } = useRejectTeam();
  const { mutate: updateStage, isPending: isUpdatingStage } =
    useUpdateTeamStage();

  const expectedEvent = resolveCompetitionEventBySlug(
    competitionNames?.data,
    slug,
  );
  const expectedEventId = expectedEvent?.id;
  const team = teamData?.data as CompetitionTeamDetail | undefined;
  const statusCode = (error as AxiosError | undefined)?.response?.status;
  const canReject = team?.status === "paid" || team?.status === "verified";
  const isLoading = isCompetitionNamesLoading || isTeamLoading;

  useEffect(() => {
    if (team?.participants?.length && !activeTab) {
      setActiveTab(team.participants[0].id);
    }
  }, [team?.participants, activeTab]);

  const errorState = useMemo(() => {
    if (!identity) return "slug";
    if (!isCompetitionNamesLoading && !expectedEventId) return "event";
    if (statusCode === 404) return "not-found";
    if (error) return "request";
    if (team && expectedEventId && team.event_id !== expectedEventId) {
      return "mismatch";
    }
    return null;
  }, [
    identity,
    isCompetitionNamesLoading,
    expectedEventId,
    statusCode,
    error,
    team,
  ]);

  const handleRetry = () => {
    refetchCompetitionNames();
    refetchTeam();
    router.refresh();
  };

  if (errorState === "slug") {
    return (
      <ErrorState
        title="Competition not found"
        description="The selected competition slug is not registered in the admin competition mapping."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (errorState === "event") {
    return (
      <ErrorState
        title="Competition event not found"
        description={`The admin detail page could not resolve the event for ${identity?.displayName}. Please check the competition names API response.`}
        onRetry={handleRetry}
      />
    );
  }

  if (errorState === "not-found") {
    return (
      <ErrorState
        title="Team not found"
        description="This team ID does not exist anymore or has never been registered in competition data."
        onRetry={handleRetry}
      />
    );
  }

  if (errorState === "mismatch") {
    return (
      <ErrorState
        title="Team belongs to another competition"
        description={`This team exists, but it is not registered under ${identity?.displayName}. Please open the correct competition detail page.`}
      />
    );
  }

  if (errorState === "request") {
    return (
      <ErrorState
        title="Failed to load team detail"
        description="The request to competition detail failed. Please refresh and try again."
        onRetry={handleRetry}
      />
    );
  }

  if (!team || !identity) {
    return (
      <ErrorState
        title="Team data is unavailable"
        description="The detail response did not contain team data. Please refresh and try again."
        onRetry={handleRetry}
      />
    );
  }

  const activeParticipant =
    activeTab === "submission"
      ? null
      : team.participants?.find((participant) => participant.id === activeTab);

  const handleVerify = () => {
    if (!team.event_id) {
      toast.error("Event ID not found");
      return;
    }

    verifyTeam(
      { id: teamId, event_id: team.event_id },
      {
        onSuccess: () => {
          setModal(null);
          router.refresh();
        },
      },
    );
  };

  const handleMarkAsPaid = () => {
    markAsPaid(teamId, {
      onSuccess: () => {
        setModal(null);
        router.refresh();
      },
    });
  };

  const handleUpdateStage = () => {
    if (!selectedStage) return;

    updateStage(
      { id: teamId, stage: selectedStage },
      {
        onSuccess: () => {
          setModal(null);
          setSelectedStage("");
          router.refresh();
        },
      },
    );
  };

  const handleReject = () => {
    if (!canReject) {
      toast.error("Only paid or verified teams can be rejected");
      return;
    }

    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    rejectTeam(
      { id: teamId, reason: rejectReason },
      {
        onSuccess: () => {
          setModal(null);
          setRejectReason("");
          router.refresh();
        },
      },
    );
  };

  return (
    <>
      <div className="min-h-screen p-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-200"
            >
              <ArrowLeft className="text-gray-700" />
            </button>
            <div className="flex items-center gap-1">
              <Typography variant="l" weight="bold" className="text-[#7A7A7A]">
                Dashboard / {identity.displayName} /
              </Typography>
              <Typography variant="l" weight="bold" className="text-[#357182]">
                Details
              </Typography>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Typography variant="h3" weight="bold" className="text-gray-900">
              Registrant Details
            </Typography>
            <div className="flex items-center gap-3">
              {team.is_international &&
              team.status !== "paid" &&
              team.status !== "verified" &&
              team.payment_proof ? (
                <button
                  onClick={() => setModal("paid")}
                  className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Mark as Paid
                </button>
              ) : null}
              {((team.is_international && team.status === "paid") ||
                (!team.is_international &&
                  team.status !== "verified" &&
                  team.status !== "complete")) && (
                <button
                  onClick={() => setModal("verify")}
                  className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Verify Team
                </button>
              )}
              {canReject ? (
                <button
                  onClick={() => setModal("reject")}
                  className="rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Reject Team
                </button>
              ) : null}
              <button
                onClick={() => setModal("stage")}
                className="rounded-md bg-[#357182] px-5 py-2 text-sm font-medium text-white hover:bg-[#2d5f6d]"
              >
                Update Stage
              </button>
            </div>
          </div>

          <div className="rounded-[16px] bg-white p-6 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <div className="grid grid-cols-4 gap-x-12 gap-y-4">
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Team Name
                </Typography>
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-gray-900"
                >
                  {team.team_name}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Status
                </Typography>
                <Typography variant="p" className="capitalize text-gray-900">
                  {team.status}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  University
                </Typography>
                <Typography variant="p" className="text-gray-900">
                  {team.university}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Stage
                </Typography>
                <Typography variant="p" className="capitalize text-gray-900">
                  {team.stage}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  International Team
                </Typography>
                <Typography variant="p" className="text-gray-900">
                  {team.is_international ? "Yes" : "No"}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Sales Type
                </Typography>
                <Typography variant="p" className="text-gray-900">
                  {team.sale_type ? getSalesTypeLabel(team.sale_type) : "-"}
                </Typography>
              </div>
              <div className="col-span-4">
                <Typography variant="p" className="mb-2 text-sm text-gray-600">
                  {team.is_international
                    ? "PayPal Payment Proof"
                    : "Tripay Invoice (Payment Proof)"}
                </Typography>
                <DocumentLink
                  href={
                    team.is_international
                      ? team.payment_proof
                      : team.registration_invoice
                  }
                  label={
                    team.is_international
                      ? "View PayPal Proof"
                      : "View Tripay Invoice"
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-[16px] bg-white p-6 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <Typography
              variant="h4"
              weight="bold"
              className="mb-4 text-gray-900"
            >
              Semifinal Payment
            </Typography>
            {team.semifinal_payment ? (
              <div className="grid grid-cols-4 gap-x-12 gap-y-4">
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Status
                  </Typography>
                  <Typography variant="p" className="capitalize text-gray-900">
                    {team.semifinal_payment.status}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Amount
                  </Typography>
                  <Typography variant="p" className="text-gray-900">
                    Rp {team.semifinal_payment.amount.toLocaleString("id-ID")}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Payment Method
                  </Typography>
                  <Typography variant="p" className="text-gray-900">
                    {team.semifinal_payment.payment_method || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Order ID
                  </Typography>
                  <Typography variant="p" className="text-gray-900 break-all">
                    {team.semifinal_payment.order_id || "-"}
                  </Typography>
                </div>
                <div className="col-span-4">
                  <Typography variant="p" className="text-sm text-gray-600">
                    Invoice
                  </Typography>
                  <DocumentLink
                    href={team.semifinal_payment.invoice}
                    label="View Semifinal Invoice"
                  />
                </div>
                {team.semifinal_payment.updated_at ? (
                  <div className="col-span-4">
                    <Typography variant="p" className="text-sm text-gray-600">
                      Updated At
                    </Typography>
                    <Typography variant="p" className="text-gray-900">
                      {new Date(
                        team.semifinal_payment.updated_at,
                      ).toLocaleString("en-GB", {
                        timeZone: "Asia/Jakarta",
                      })}{" "}
                      WIB
                    </Typography>
                  </div>
                ) : null}
              </div>
            ) : (
              <Typography variant="p" className="text-gray-500">
                No semifinal payment record yet.
              </Typography>
            )}
          </div>

          <div className="rounded-[16px] bg-white p-6 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <Typography
              variant="h4"
              weight="bold"
              className="mb-4 text-gray-900"
            >
              Final Payment
            </Typography>
            {team.final_payment ? (
              <div className="grid grid-cols-4 gap-x-12 gap-y-4">
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Status
                  </Typography>
                  <Typography variant="p" className="capitalize text-gray-900">
                    {team.final_payment.status}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Accommodation
                  </Typography>
                  <Typography variant="p" className="text-gray-900">
                    Rp{" "}
                    {team.final_payment.accommodation_price.toLocaleString(
                      "id-ID",
                    )}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Accommodation Count
                  </Typography>
                  <Typography variant="p" className="text-gray-900">
                    {team.final_payment.accommodation_count}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Non Accommodation
                  </Typography>
                  <Typography variant="p" className="text-gray-900">
                    Rp{" "}
                    {team.final_payment.non_accommodation_price.toLocaleString(
                      "id-ID",
                    )}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Non Accommodation Count
                  </Typography>
                  <Typography variant="p" className="text-gray-900">
                    {team.final_payment.non_accommodation_count}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Total
                  </Typography>
                  <Typography variant="p" className="text-gray-900">
                    Rp {team.final_payment.total_fee.toLocaleString("id-ID")}
                  </Typography>
                </div>
                <div className="col-span-4">
                  <Typography variant="p" className="text-sm text-gray-600">
                    Invoice
                  </Typography>
                  <DocumentLink
                    href={team.final_payment.invoice}
                    label="View Final Invoice"
                  />
                </div>
                {team.final_payment.order_id ? (
                  <div className="col-span-4">
                    <Typography variant="p" className="text-sm text-gray-600">
                      Order ID
                    </Typography>
                    <Typography variant="p" className="text-gray-900 break-all">
                      {team.final_payment.order_id}
                    </Typography>
                  </div>
                ) : null}
              </div>
            ) : (
              <Typography variant="p" className="text-gray-500">
                No final payment record yet.
              </Typography>
            )}

            {team.stage === "final" &&
            (team.final_whatsapp_group || team.final_link_case) ? (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <Typography
                  variant="h4"
                  weight="bold"
                  className="mb-4 text-gray-900"
                >
                  Final Stage Resources
                </Typography>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Final WhatsApp Group
                    </Typography>
                    {team.final_whatsapp_group ? (
                      <Link
                        href={team.final_whatsapp_group}
                        target="_blank"
                        className="break-all text-sm text-[#357182] underline underline-offset-2"
                      >
                        {team.final_whatsapp_group}
                      </Link>
                    ) : (
                      <Typography variant="p" className="text-gray-500">
                        No final WhatsApp group set.
                      </Typography>
                    )}
                  </div>

                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Final Link Case
                    </Typography>
                    {team.final_link_case ? (
                      <Link
                        href={team.final_link_case}
                        target="_blank"
                        className="break-all text-sm text-[#357182] underline underline-offset-2"
                      >
                        {team.final_link_case}
                      </Link>
                    ) : (
                      <Typography variant="p" className="text-gray-500">
                        No final case link visible yet.
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            {team.participants?.map((participant, index) => (
              <button
                key={participant.id}
                onClick={() => setActiveTab(participant.id)}
                className={`rounded-md px-5 py-2 text-sm font-medium ${
                  activeTab === participant.id
                    ? "bg-[#357182] text-white"
                    : "bg-[#EFEFEF] text-[#231F20]"
                }`}
              >
                {participant.type === "LEADER"
                  ? "Leader"
                  : `${index}${index === 1 ? "st" : index === 2 ? "nd" : index === 3 ? "rd" : "th"} Member`}
              </button>
            ))}
            <button
              onClick={() => setActiveTab("submission")}
              className={`rounded-md px-5 py-2 text-sm font-medium ${
                activeTab === "submission"
                  ? "bg-[#357182] text-white"
                  : "bg-[#EFEFEF] text-[#231F20]"
              }`}
            >
              Submission
            </button>
          </div>

          <div className="rounded-[16px] bg-white p-6 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            {activeTab === "submission" ? (
              team.submission ? (
                <div className="space-y-6">
                  <Typography
                    variant="h4"
                    weight="bold"
                    className="text-gray-900"
                  >
                    Submission Files
                  </Typography>
                  {team.submission.is_late ? (
                    <div className="inline-flex rounded-full border border-red-200 bg-red-100 px-4 py-2 text-sm font-semibold text-red-800">
                      Late Submission
                    </div>
                  ) : null}
                  <div className="grid grid-cols-2 gap-4">
                    {submissionDocuments
                      .filter((item) => team.submission?.[item.key])
                      .map((item) => (
                        <div key={item.key}>
                          <Typography
                            variant="p"
                            weight="medium"
                            className="mb-3 text-gray-900"
                          >
                            {item.label}
                          </Typography>
                          <DocumentLink href={team.submission?.[item.key]} />
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <Typography
                  variant="p"
                  className="py-8 text-center text-gray-500"
                >
                  No submissions yet
                </Typography>
              )
            ) : activeParticipant ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Name
                    </Typography>
                    <Typography variant="p" className="text-gray-900">
                      {activeParticipant.name}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Email
                    </Typography>
                    <Typography variant="p" className="text-gray-900">
                      {activeParticipant.email}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Major
                    </Typography>
                    <Typography variant="p" className="text-gray-900">
                      {activeParticipant.major}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Phone Number
                    </Typography>
                    <Typography variant="p" className="text-gray-900">
                      {activeParticipant.phone_number}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Batch
                    </Typography>
                    <Typography variant="p" className="text-gray-900">
                      {activeParticipant.batch}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" className="text-sm text-gray-600">
                      Final Stay Option
                    </Typography>
                    <Typography
                      variant="p"
                      className="capitalize text-gray-900"
                    >
                      {activeParticipant.final_accommodation_type
                        ? activeParticipant.final_accommodation_type.replace(
                            "_",
                            " ",
                          )
                        : "-"}
                    </Typography>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-6">
                  {participantDocuments.map((item) => (
                    <div key={item.key}>
                      <Typography
                        variant="p"
                        weight="medium"
                        className="mb-3 text-gray-900"
                      >
                        {item.label}
                      </Typography>
                      <DocumentLink href={activeParticipant[item.key]} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Typography
                variant="p"
                className="py-8 text-center text-gray-500"
              >
                Select a participant tab to view details.
              </Typography>
            )}
          </div>
        </div>
      </div>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            {modal === "verify" ? (
              <>
                <Typography variant="h3" weight="bold" className="mb-4">
                  Verify Payment
                </Typography>
                <Typography variant="p" className="mb-6">
                  Verify this team and allow them to access competition
                  features.
                </Typography>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    {isVerifying ? "Verifying..." : "Verify Payment"}
                  </button>
                </div>
              </>
            ) : null}

            {modal === "paid" ? (
              <>
                <Typography variant="h3" weight="bold" className="mb-4">
                  Mark as Paid
                </Typography>
                <Typography variant="p" className="mb-6">
                  Mark this international team as paid after confirming the
                  PayPal transaction.
                </Typography>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMarkAsPaid}
                    disabled={isMarkingPaid}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    {isMarkingPaid ? "Processing..." : "Mark as Paid"}
                  </button>
                </div>
              </>
            ) : null}

            {modal === "stage" ? (
              <>
                <Typography variant="h3" weight="bold" className="mb-4">
                  Update Stage
                </Typography>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="mb-6 w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select stage...</option>
                  <option value="registration">Registration</option>
                  <option value="preliminary">Preliminary</option>
                  <option value="semifinal">Semifinal</option>
                  <option value="final">Final</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setModal(null);
                      setSelectedStage("");
                    }}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStage}
                    disabled={isUpdatingStage || !selectedStage}
                    className="rounded-md bg-[#357182] px-4 py-2 text-white hover:bg-[#2d5f6d]"
                  >
                    {isUpdatingStage ? "Updating..." : "Update"}
                  </button>
                </div>
              </>
            ) : null}

            {modal === "reject" ? (
              <>
                <Typography variant="h3" weight="bold" className="mb-4">
                  Reject Team
                </Typography>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  className="mb-4 min-h-[100px] w-full rounded-md border border-gray-300 p-3"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setModal(null);
                      setRejectReason("");
                    }}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isRejecting || !rejectReason.trim()}
                    className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    {isRejecting ? "Rejecting..." : "Reject Team"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
