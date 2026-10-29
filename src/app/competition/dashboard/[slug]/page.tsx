"use client";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Countdown from "@/components/countdown";
import Typography from "@/components/typography";
import {
  useGetMyTeam,
  usePayCompetitionSemifinal,
  useSubmitFileSubmission,
  useUpdateFileSubmission,
} from "@/hooks/use-competition";
import {
  getCompetitionStageDeadline,
  isCompetitionDeadlinePassed,
} from "@/lib/competition-deadlines";
import { cn } from "@/lib/utils";
import { AlertCircle, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { Accept } from "react-dropzone";
import CompetitionGuard from "./_components/competition-guard";
import StageResultBanner from "./_components/stage-result-banner";
import UploadArea from "./_components/upload-area";

type SubmissionUploadOptions = {
  description: string;
  accept: Accept;
  supportFiles: string[];
  maxSize?: number;
};

const PDF_UPLOAD_OPTIONS: SubmissionUploadOptions = {
  description: "Upload your submission file (PDF only)",
  accept: { "application/pdf": [".pdf"] },
  supportFiles: ["pdf"],
};

const PPTX_UPLOAD_OPTIONS: SubmissionUploadOptions = {
  description: "Upload your PPT submission file (PPTX only)",
  accept: {
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
  },
  supportFiles: ["pptx"],
};

// Competition configuration
const competitionConfig: Record<
  string,
  {
    name: string;
    stages: Array<{ id: string; label: string }>;
    fileSubmissions: number;
  }
> = {
  "paper-and-poster": {
    name: "Paper and Poster",
    stages: [
      { id: "preliminary", label: "Preliminary" },
      { id: "semifinal", label: "Semifinal" },
      { id: "final", label: "Final" },
    ],
    fileSubmissions: 1,
  },
  "case-study": {
    name: "Case Study",
    stages: [
      { id: "preliminary", label: "Preliminary" },
      { id: "final", label: "Final" },
    ],
    fileSubmissions: 1,
  },
  "fracturing-fluid-design": {
    name: "Fracturing Fluid Design",
    stages: [
      { id: "preliminary", label: "Preliminary" },
      { id: "final", label: "Final" },
    ],
    fileSubmissions: 1,
  },
  "oil-rig-design": {
    name: "Oil Rig Design",
    stages: [
      { id: "preliminary", label: "Preliminary" },
      { id: "final", label: "Final" },
    ],
    fileSubmissions: 1,
  },
  petrosmart: {
    name: "Petrosmart",
    stages: [
      { id: "preliminary", label: "Preliminary" },
      { id: "final", label: "Final" },
    ],
    fileSubmissions: 1,
  },
  "business-case": {
    name: "Business Case",
    stages: [
      { id: "preliminary", label: "Preliminary" },
      { id: "semifinal", label: "Semifinal" },
      { id: "final", label: "Final" },
    ],
    fileSubmissions: 1,
  },
  "plan-of-development": {
    name: "Plan of Development",
    stages: [
      { id: "preliminary", label: "Preliminary" },
      { id: "final", label: "Final" },
    ],
    fileSubmissions: 1,
  },
  "geothermal-case": {
    name: "Geothermal Case",
    stages: [
      { id: "preliminary", label: "Preliminary" },
      { id: "semifinal", label: "Semifinal" },
      { id: "final", label: "Final" },
    ],
    fileSubmissions: 1,
  },
};

export default function CompetitionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: teamData, isLoading } = useGetMyTeam();
  const { mutate: submitFile, isPending: isSubmitting } =
    useSubmitFileSubmission();
  const { mutate: updateFile, isPending: isUpdating } =
    useUpdateFileSubmission();
  const { mutate: paySemifinal, isPending: isPayingSemifinal } =
    usePayCompetitionSemifinal();

  // File states
  const [submission1, setSubmission1] = useState<File | null>(null);
  const [submission2, setSubmission2] = useState<File | null>(null);
  const [submission3, setSubmission3] = useState<File | null>(null);
  const [submission4, setSubmission4] = useState<File | null>(null);

  // Final payment confirmation
  const [showFinalPaymentConfirm, setShowFinalPaymentConfirm] = useState(false);

  const config = competitionConfig[slug];

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Typography variant="h3" className="text-gray-500">
          Competition not found
        </Typography>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Typography variant="h3" className="text-white">
          Loading...
        </Typography>
      </div>
    );
  }

  if (!teamData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Typography variant="h3" className="text-white">
          No team data found
        </Typography>
      </div>
    );
  }

  const team = teamData.data;
  const lastStage = team.last_stage;

  const BREADCRUMBS = [
    { name: "Competition", href: "/competition/dashboard/user" },
    { name: config.name, href: `/competition/dashboard/${slug}` },
  ];

  // Get current stage index from team data
  const currentStageIndex = config.stages.findIndex(
    (stage) => stage.id === team.stage,
  );
  const isFinalStage = currentStageIndex === config.stages.length - 1;
  const isBCC = slug === "business-case";
  const isSemifinalStage = team.stage === "semifinal";
  const semifinalPayment = team.semifinal_payment;
  const finalPayment = team.final_payment;
  const isSemifinalPaymentPaid = semifinalPayment?.status === "paid";
  const isSemifinalPaymentRequired = isBCC && isSemifinalStage;
  const canSubmitSemifinal =
    !isSemifinalPaymentRequired || isSemifinalPaymentPaid;
  const isSemifinalLocked = isSemifinalPaymentRequired && !canSubmitSemifinal;
  const isFinalPaymentRequired = team.stage === "final";
  const isFinalPaymentPaid = finalPayment?.status === "paid";
  const canCreateFinalInvoice =
    team.stage === "final" &&
    (team.status === "verified" || team.status === "paid");
  const canSubmitFinal = !isFinalPaymentRequired || isFinalPaymentPaid;
  const isFinalLocked = isFinalPaymentRequired && !canSubmitFinal;
  const canAccessSubmission =
    !["incomplete", "complete", "rejected"].includes(team.status) &&
    team.stage !== "registration" &&
    team.stage !== "not passed" &&
    !isSemifinalLocked &&
    !isFinalLocked;
  const finalistGroupLabel =
    slug === "plan-of-development"
      ? "Grup Finalist POD"
      : "Finalist WhatsApp Group";
  const finalAccommodationPrice = finalPayment?.accommodation_price ?? 675000;
  const finalNonAccommodationPrice =
    finalPayment?.non_accommodation_price ?? 400000;
  const finalAccommodationCount =
    finalPayment?.accommodation_count ??
    team.participants?.filter(
      (participant: any) => participant.final_accommodation_type === "accom",
    ).length ??
    0;
  const finalNonAccommodationCount =
    finalPayment?.non_accommodation_count ??
    team.participants?.filter(
      (participant: any) =>
        participant.final_accommodation_type === "non_accom",
    ).length ??
    0;
  const finalTotalFee =
    finalPayment?.total_fee ??
    finalAccommodationCount * finalAccommodationPrice +
      finalNonAccommodationCount * finalNonAccommodationPrice;

  // Check if submissions exist
  const hasSubmission1 = !!team.submission?.submission_1;
  const hasSubmission2 = !!team.submission?.submission_2;
  const hasSubmission3 = !!team.submission?.submission_3;
  const hasSubmission4 = !!team.submission?.submission_4;
  const hasExistingSubmission =
    hasSubmission1 || hasSubmission2 || hasSubmission3 || hasSubmission4;

  // Check if new files are selected
  const hasNewFiles = submission1 || submission2 || submission3 || submission4;

  // Submit handler
  const handleSubmit = () => {
    if (!hasNewFiles) {
      return;
    }

    const formData = new FormData();
    if (submission1) formData.append("submission_1", submission1);
    if (submission2) formData.append("submission_2", submission2);
    if (submission3) formData.append("submission_3", submission3);
    if (submission4) formData.append("submission_4", submission4);

    // NOTE: Files are sent as-is without compression
    // If compression is happening, it's on the backend side

    const mutationFn = hasExistingSubmission ? updateFile : submitFile;
    mutationFn(formData, {
      onSuccess: () => {
        setSubmission1(null);
        setSubmission2(null);
        setSubmission3(null);
        setSubmission4(null);
      },
    });
  };

  const handleSemifinalPayment = () => {
    paySemifinal(
      { payment_method: "QRIS" },
      {
        onSuccess: (response: any) => {
          if (response?.data?.invoice_url) {
            window.open(response.data.invoice_url, "_blank");
          }
        },
      },
    );
  };

  const isPending = isSubmitting || isUpdating;

  const deadline = getCompetitionStageDeadline({
    stage: team.stage,
    competition: slug,
  });
  const isPastDeadline = isCompetitionDeadlinePassed(deadline);
  const isLateSubmission = !!team.submission?.is_late;

  const currentStageFileSubmissions = (() => {
    if (team.stage === "preliminary") {
      return 1;
    }
    if (slug === "business-case") {
      return isFinalStage ? 4 : 2;
    }
    if (isFinalStage && slug === "plan-of-development") {
      return 1;
    }
    if (isFinalStage && slug === "fracturing-fluid-design") {
      return 2;
    }
    if (isFinalStage && slug === "geothermal-case") {
      return 2;
    }
    if (isFinalStage) {
      return 3;
    }
    if (slug === "geothermal-case" && team.stage === "semifinal") {
      return 2;
    }
    return config.fileSubmissions;
  })();

  const finalSubmissionLabels = (() => {
    if (slug === "plan-of-development") {
      return ["ZIP FILE (Final Report, PPT, Dynamic Model, Excel perhitungan)"];
    }
    if (slug === "geothermal-case") {
      return ["Poster Submission (PDF Only)", "PPT Submission (PDF Only)"];
    }
    if (slug === "oil-rig-design") {
      return [
        "File Submission",
        "File Submission 2",
        "PPT Submission (PPTX only)",
      ];
    }
    if (slug === "fracturing-fluid-design") {
      return ["PPT", "Project Report"];
    }
    return ["File Submission", "Full Project Submission/Poster", "PPT"];
  })();

  const finalSubmissionFileOptions: SubmissionUploadOptions[] = (() => {
    if (slug === "geothermal-case") {
      return [
        {
          ...PDF_UPLOAD_OPTIONS,
          description: "Upload your poster submission file (PDF only)",
        },
        {
          ...PDF_UPLOAD_OPTIONS,
          description: "Upload your PPT submission file (PDF only)",
        },
      ];
    }

    if (slug === "oil-rig-design") {
      return [
        PDF_UPLOAD_OPTIONS,
        {
          ...PDF_UPLOAD_OPTIONS,
          description: "Upload your second submission file (PDF only)",
        },
        {
          ...PPTX_UPLOAD_OPTIONS,
          maxSize: 20_000_000,
        },
      ];
    }

    if (slug === "fracturing-fluid-design") {
      return [
        PPTX_UPLOAD_OPTIONS,
        {
          ...PDF_UPLOAD_OPTIONS,
          description: "Upload your project report file (PDF only)",
        },
      ];
    }

    return [];
  })();

  return (
    <CompetitionGuard>
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start gap-4">
          <Typography
            variant="h1"
            weight="bold"
            className="text-white uppercase"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            {config.name}
          </Typography>
          <BreadcrumbGroup
            items={BREADCRUMBS}
            textColor="text-white"
            activeColor="text-white"
            separatorColor="text-white"
          />
        </div>

        {/* Competition Stage */}
        <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
          <Typography
            variant="h3"
            weight="bold"
            className="text-primary-600 mb-8"
          >
            Competition Stage
          </Typography>

          {/* Stage Progress */}
          <div
            className={cn(
              "flex items-center justify-center mx-auto",
              config.stages.length === 2 ? "max-w-md" : "max-w-2xl",
            )}
          >
            {config.stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md",
                      index <= currentStageIndex
                        ? "bg-primary-500 text-white shadow-primary-200"
                        : "bg-gray-200 text-gray-400",
                    )}
                  >
                    {index === config.stages.length - 1 ? (
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <Typography
                    variant="p"
                    weight="medium"
                    className="mt-3 text-sm capitalize"
                  >
                    {stage.label}
                  </Typography>
                </div>
                {index < config.stages.length - 1 && (
                  <div
                    className={cn(
                      "h-1 mx-6 w-24 md:w-32 rounded-full transition-all duration-300",
                      index < currentStageIndex
                        ? "bg-primary-500"
                        : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <StageResultBanner
          competitionName={config.name}
          stage={team.stage}
          lastStage={lastStage}
        />

        {/* Countdown */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 p-8 shadow-sm">
          <Typography
            variant="h3"
            weight="bold"
            className="mb-6 text-center text-primary-600"
          >
            COUNTDOWN
          </Typography>
          <Countdown deadline={deadline} variant="primary" />
        </div>

        {(isPastDeadline || isLateSubmission) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <Typography variant="h4" weight="bold" className="text-red-900">
              {isLateSubmission
                ? "Late Submission Notice"
                : "Submission Period Closed"}
            </Typography>
            <Typography variant="p" className="mt-2 text-red-800">
              {isLateSubmission
                ? "Your latest saved submission was recorded after the deadline for this stage."
                : "The submission deadline for this stage has passed. Any new upload after this point will be recorded as a late submission."}
            </Typography>
            {team.submission?.submitted_at && (
              <Typography variant="p" className="mt-2 text-sm text-red-700">
                Latest submission time:{" "}
                {new Date(team.submission.submitted_at).toLocaleString(
                  "en-GB",
                  {
                    timeZone: "Asia/Jakarta",
                  },
                )}{" "}
                WIB
              </Typography>
            )}
          </div>
        )}

        {isSemifinalPaymentRequired && (
          <div
            className={cn(
              "rounded-2xl border p-6 shadow-sm",
              isSemifinalPaymentPaid
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50",
            )}
          >
            <Typography variant="h4" weight="bold" className="text-gray-900">
              Semifinal Payment
            </Typography>
            <Typography variant="p" className="mt-2 text-gray-700">
              BCC semifinal requires a payment of Rp 150.000 before submission
              is unlocked.
            </Typography>
            <div className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
              <div>
                <span className="font-semibold">Amount:</span> Rp 150.000
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {semifinalPayment?.status ?? "pending"}
              </div>
              {semifinalPayment?.order_id && (
                <div className="sm:col-span-2">
                  <span className="font-semibold">Order ID:</span>{" "}
                  {semifinalPayment.order_id}
                </div>
              )}
              {semifinalPayment?.updated_at && (
                <div className="sm:col-span-2">
                  <span className="font-semibold">Updated:</span>{" "}
                  {new Date(semifinalPayment.updated_at).toLocaleString(
                    "en-GB",
                    { timeZone: "Asia/Jakarta" },
                  )}{" "}
                  WIB
                </div>
              )}
            </div>
            {!isSemifinalPaymentPaid ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleSemifinalPayment}
                disabled={isPayingSemifinal}
                className="mt-5"
              >
                {isPayingSemifinal ? "Preparing invoice..." : "Pay Semifinal"}
              </Button>
            ) : (
              <Typography variant="p" className="mt-4 text-green-700">
                Payment confirmed. Submission is unlocked.
              </Typography>
            )}
          </div>
        )}

        {team.final_link_case && (
          <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 shadow-sm">
            <Typography variant="h3" weight="bold" className="mb-4 text-white">
              Final Stage Case / Guidelines
            </Typography>
            <div className="bg-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-white flex-shrink-0 mt-1"
                  size={24}
                />
                <Typography variant="p" className="text-white">
                  You have successfully paid the final stage fee. Access your
                  final case and guidelines below.
                </Typography>
              </div>
              <a
                href={team.final_link_case}
                target="_blank"
                rel="noreferrer"
                className="bg-white text-primary-700 hover:bg-gray-100 whitespace-nowrap flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-md transition-all duration-200"
              >
                Open Document
              </a>
            </div>
          </div>
        )}

        {/* Your Submission */}
        <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
          <Typography variant="h3" weight="bold" className="mb-6 text-gray-900">
            Your Submission
          </Typography>
          {team.submission?.is_late && (
            <div className="mb-6 inline-flex rounded-full border border-red-200 bg-red-100 px-4 py-2 text-sm font-semibold text-red-800">
              Late Submission
            </div>
          )}

          {isSemifinalLocked ? (
            <div className="bg-amber-50 rounded-xl p-8 border-2 border-amber-200">
              <div className="flex flex-col items-center text-center gap-4">
                <AlertCircle className="text-amber-600" size={48} />
                <div>
                  <Typography
                    variant="h4"
                    weight="bold"
                    className="text-gray-900 mb-2"
                  >
                    Submission Locked
                  </Typography>
                  <Typography variant="p" className="text-gray-700 mb-4">
                    BCC semifinal submission will open after the Rp 150.000
                    payment is completed.
                  </Typography>
                  <Typography variant="p" className="text-sm text-gray-600">
                    Current Payment Status:{" "}
                    <span className="font-semibold capitalize">
                      {semifinalPayment?.status ?? "pending"}
                    </span>
                  </Typography>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSemifinalPayment}
                  disabled={isPayingSemifinal}
                  className="mt-2"
                >
                  {isPayingSemifinal ? "Preparing invoice..." : "Pay Semifinal"}
                </Button>
              </div>
            </div>
          ) : !canAccessSubmission ? (
            <div className="bg-yellow-50 rounded-xl p-8 border-2 border-yellow-200">
              <div className="flex flex-col items-center text-center gap-4">
                <AlertCircle className="text-yellow-600" size={48} />
                <div>
                  <Typography
                    variant="h4"
                    weight="bold"
                    className="text-gray-900 mb-2"
                  >
                    Submission Not Available
                  </Typography>
                  <Typography variant="p" className="text-gray-700 mb-4">
                    {isFinalLocked
                      ? "Final submission will open after your final stage payment is confirmed."
                      : team.status === "paid"
                        ? "Your registration payment has been received. Once your team is verified for the final stage, you can create the final invoice."
                        : "You need to finalize your team data before you can access the submission form. Please complete your profile and wait for verification."}
                  </Typography>
                  {isFinalLocked ? (
                    <Typography variant="p" className="text-sm text-gray-600">
                      Final Payment Status:{" "}
                      <span className="font-semibold capitalize">
                        {finalPayment?.status ?? "pending"}
                      </span>
                    </Typography>
                  ) : (
                    <Typography variant="p" className="text-sm text-gray-600">
                      Current Status:{" "}
                      <span className="font-semibold capitalize">
                        {team.status}
                      </span>
                    </Typography>
                  )}
                </div>
                {isFinalLocked ? (
                  !showFinalPaymentConfirm ? (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setShowFinalPaymentConfirm(true)}
                      className="mt-2"
                    >
                      Pay Final Stage Fee
                    </Button>
                  ) : (
                    <div className="mt-2 rounded-xl border border-primary-200 bg-primary-50 p-4 text-center space-y-3">
                      <p className="text-sm font-semibold text-primary-800">
                        You will be redirected to the finalize page to choose
                        accommodation options and create the final invoice.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFinalPaymentConfirm(false)}
                          className="border-gray-400 text-gray-600"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            router.push(
                              "/competition/dashboard/profile/finalize",
                            )
                          }
                        >
                          Continue to Finalize
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() =>
                      router.push("/competition/dashboard/profile")
                    }
                    className="mt-2"
                  >
                    Go to Profile
                  </Button>
                )}
              </div>
            </div>
          ) : isFinalStage ? (
            // Final Stage - Show different submission layout
            <div className="space-y-6">
              {isBCC ? (
                // BCC Final Stage - 4 file submissions (2 view, 2 upload)
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* File Submission 1 */}
                    <div>
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="mb-3 text-gray-700"
                      >
                        {finalSubmissionLabels[0]}
                      </Typography>
                      {hasSubmission1 ? (
                        <Link
                          href={team.submission!.submission_1!}
                          target="_blank"
                        >
                          <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                              <Eye className="text-primary-600" size={20} />
                              <Typography
                                variant="p"
                                weight="semibold"
                                className="text-primary-600"
                              >
                                View file
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <UploadArea
                          value={submission1}
                          onChange={setSubmission1}
                        />
                      )}
                    </div>

                    {/* File Submission 2 */}
                    <div>
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="mb-3 text-gray-700"
                      >
                        File Submission 2
                      </Typography>
                      {hasSubmission2 ? (
                        <Link
                          href={team.submission!.submission_2!}
                          target="_blank"
                        >
                          <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                              <Eye className="text-primary-600" size={20} />
                              <Typography
                                variant="p"
                                weight="semibold"
                                className="text-primary-600"
                              >
                                View file
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <UploadArea
                          value={submission2}
                          onChange={setSubmission2}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Project Submission/Poster */}
                    <div>
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="mb-3 text-gray-700"
                      >
                        Full Project Submission/Poster
                      </Typography>
                      {hasSubmission3 ? (
                        <Link
                          href={team.submission!.submission_3!}
                          target="_blank"
                        >
                          <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                              <Eye className="text-primary-600" size={20} />
                              <Typography
                                variant="p"
                                weight="semibold"
                                className="text-primary-600"
                              >
                                View file
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <UploadArea
                          value={submission3}
                          onChange={setSubmission3}
                        />
                      )}
                    </div>

                    {/* PPT */}
                    <div>
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="mb-3 text-gray-700"
                      >
                        PPT
                      </Typography>
                      {hasSubmission4 ? (
                        <Link
                          href={team.submission!.submission_4!}
                          target="_blank"
                        >
                          <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                              <Eye className="text-primary-600" size={20} />
                              <Typography
                                variant="p"
                                weight="semibold"
                                className="text-primary-600"
                              >
                                View file
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <UploadArea
                          value={submission4}
                          onChange={setSubmission4}
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                // Non-BCC Final Stage
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* File Submission */}
                    <div>
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="mb-3 text-gray-700"
                      >
                        {finalSubmissionLabels[0]}
                      </Typography>
                      {hasSubmission1 ? (
                        <Link
                          href={team.submission!.submission_1!}
                          target="_blank"
                        >
                          <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                              <Eye className="text-primary-600" size={20} />
                              <Typography
                                variant="p"
                                weight="semibold"
                                className="text-primary-600"
                              >
                                View file
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <UploadArea
                          value={submission1}
                          onChange={setSubmission1}
                          {...(finalSubmissionFileOptions[0] ?? {})}
                        />
                      )}
                    </div>

                    {currentStageFileSubmissions >= 2 ? (
                      <div>
                        <Typography
                          variant="p"
                          weight="semibold"
                          className="mb-3 text-gray-700"
                        >
                          {finalSubmissionLabels[1]}
                        </Typography>
                        {hasSubmission2 ? (
                          <Link
                            href={team.submission!.submission_2!}
                            target="_blank"
                          >
                            <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center justify-center gap-3 cursor-pointer">
                                <Eye className="text-primary-600" size={20} />
                                <Typography
                                  variant="p"
                                  weight="semibold"
                                  className="text-primary-600"
                                >
                                  View file
                                </Typography>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <UploadArea
                            value={submission2}
                            onChange={setSubmission2}
                            {...(finalSubmissionFileOptions[1] ?? {})}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>

                  {currentStageFileSubmissions >= 3 ? (
                    <div>
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="mb-3 text-gray-700"
                      >
                        {finalSubmissionLabels[2]}
                      </Typography>
                      {hasSubmission3 ? (
                        <Link
                          href={team.submission!.submission_3!}
                          target="_blank"
                        >
                          <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                              <Eye className="text-primary-600" size={20} />
                              <Typography
                                variant="p"
                                weight="semibold"
                                className="text-primary-600"
                              >
                                View file
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <UploadArea
                          value={submission3}
                          onChange={setSubmission3}
                          {...(finalSubmissionFileOptions[2] ?? {})}
                        />
                      )}
                    </div>
                  ) : null}
                </>
              )}

              {/* Submit/Edit Button */}
              {hasNewFiles ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full"
                >
                  {isPending
                    ? hasExistingSubmission
                      ? "Updating..."
                      : "Submitting..."
                    : hasExistingSubmission
                      ? "Update Submission"
                      : "Submit"}
                </Button>
              ) : hasExistingSubmission ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() =>
                    router.push(`/competition/dashboard/${slug}/edit`)
                  }
                  className="w-full border-red-500 text-red-600 hover:bg-red-50"
                >
                  Edit
                </Button>
              ) : null}
            </div>
          ) : (
            // Preliminary/Semifinal Stage - Original layout
            <>
              {currentStageFileSubmissions === 1 ? (
                <div className="space-y-6">
                  <div>
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="mb-3 text-gray-700"
                    >
                      File Submission
                    </Typography>
                    {hasSubmission1 ? (
                      <Link
                        href={team.submission!.submission_1!}
                        target="_blank"
                      >
                        <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-center gap-3 cursor-pointer">
                            <Eye className="text-primary-600" size={20} />
                            <Typography
                              variant="p"
                              weight="semibold"
                              className="text-primary-600"
                            >
                              View file
                            </Typography>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <UploadArea
                        value={submission1}
                        onChange={setSubmission1}
                      />
                    )}
                  </div>

                  {/* Submit/Edit Button */}
                  {hasNewFiles ? (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending
                        ? hasExistingSubmission
                          ? "Updating..."
                          : "Submitting..."
                        : hasExistingSubmission
                          ? "Update Submission"
                          : "Submit"}
                    </Button>
                  ) : hasExistingSubmission ? (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() =>
                        router.push(`/competition/dashboard/${slug}/edit`)
                      }
                      className="w-full border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Edit
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* File Submission 1 */}
                    <div>
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="mb-3 text-gray-700"
                      >
                        File Submission
                      </Typography>
                      {hasSubmission1 ? (
                        <Link
                          href={team.submission!.submission_1!}
                          target="_blank"
                        >
                          <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                              <Eye className="text-primary-600" size={20} />
                              <Typography
                                variant="p"
                                weight="semibold"
                                className="text-primary-600"
                              >
                                View file
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <UploadArea
                          value={submission1}
                          onChange={setSubmission1}
                        />
                      )}
                    </div>

                    {/* File Submission 2 */}
                    <div>
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="mb-3 text-gray-700"
                      >
                        File Submission 2
                      </Typography>
                      {hasSubmission2 ? (
                        <Link
                          href={team.submission!.submission_2!}
                          target="_blank"
                        >
                          <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-center gap-3 cursor-pointer">
                              <Eye className="text-primary-600" size={20} />
                              <Typography
                                variant="p"
                                weight="semibold"
                                className="text-primary-600"
                              >
                                View file
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <UploadArea
                          value={submission2}
                          onChange={setSubmission2}
                        />
                      )}
                    </div>
                  </div>

                  {/* Submit/Edit Button */}
                  {hasNewFiles ? (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="w-full"
                    >
                      {isPending
                        ? hasExistingSubmission
                          ? "Updating..."
                          : "Submitting..."
                        : hasExistingSubmission
                          ? "Update Submission"
                          : "Submit"}
                    </Button>
                  ) : hasExistingSubmission ? (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() =>
                        router.push(`/competition/dashboard/${slug}/edit`)
                      }
                      className="w-full border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Edit
                    </Button>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
        {isFinalStage && (
          <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h3" weight="bold" className="text-gray-900">
                Final Stage Payment
              </Typography>
              {finalPayment?.invoice ? (
                <Link href={finalPayment.invoice} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                  >
                    View Invoice
                    <ExternalLink size={16} />
                  </Button>
                </Link>
              ) : null}
            </div>

            <div className="space-y-4">
              <div>
                <Typography variant="p" className="text-sm text-gray-600 mb-1">
                  Payment Status
                </Typography>
                <Typography
                  variant="h4"
                  weight="bold"
                  className={cn(
                    isFinalPaymentPaid ? "text-green-600" : "text-red-600",
                  )}
                >
                  {isFinalPaymentPaid ? "Paid" : "Unpaid"}
                </Typography>
              </div>

              <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                <div>
                  <span className="font-semibold">Accommodation:</span>{" "}
                  {finalAccommodationCount} x Rp{" "}
                  {finalAccommodationPrice.toLocaleString("id-ID")}
                </div>
                <div>
                  <span className="font-semibold">Non Accommodation:</span>{" "}
                  {finalNonAccommodationCount} x Rp{" "}
                  {finalNonAccommodationPrice.toLocaleString("id-ID")}
                </div>
                <div>
                  <span className="font-semibold">Total:</span> Rp{" "}
                  {finalTotalFee.toLocaleString("id-ID")}
                </div>
                {finalPayment?.order_id ? (
                  <div className="sm:col-span-2">
                    <span className="font-semibold">Order ID:</span>{" "}
                    {finalPayment.order_id}
                  </div>
                ) : null}
              </div>

              {!isFinalPaymentPaid && canCreateFinalInvoice ? (
                <div className="mt-6">
                  <Link href="/competition/dashboard/profile/finalize">
                    <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                      Choose Stay Option & Create Invoice
                    </Button>
                  </Link>
                </div>
              ) : null}

              {isFinalPaymentPaid ? (
                <div className="mt-6">
                  <Link href="/competition/dashboard/profile/finalize">
                    <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                      Register City Tour
                    </Button>
                  </Link>
                </div>
              ) : null}

              {!isFinalPaymentPaid && !canCreateFinalInvoice ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Final invoice can only be created after your team is marked as{" "}
                  <span className="font-semibold">verified</span> or{" "}
                  <span className="font-semibold">paid</span> in the final
                  stage.
                </div>
              ) : null}
            </div>
          </div>
        )}
        {team.stage === "final" &&
        (team.final_whatsapp_group ||
          (isFinalPaymentPaid && team.final_link_case)) ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
            <Typography variant="h3" weight="bold" className="text-gray-900">
              Final Stage Resources
            </Typography>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {team.final_whatsapp_group ? (
                <Link href={team.final_whatsapp_group} target="_blank">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-colors hover:bg-gray-100">
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      {finalistGroupLabel}
                    </Typography>
                    <Typography
                      variant="p"
                      className="mt-2 text-sm text-gray-600"
                    >
                      Join the finalist coordination group.
                    </Typography>
                  </div>
                </Link>
              ) : null}
              {isFinalPaymentPaid && team.final_link_case ? (
                <Link href={team.final_link_case} target="_blank">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-colors hover:bg-gray-100">
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      Link Case
                    </Typography>
                    <Typography
                      variant="p"
                      className="mt-2 text-sm text-gray-600"
                    >
                      Open the final case materials for your team.
                    </Typography>
                  </div>
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </CompetitionGuard>
  );
}
