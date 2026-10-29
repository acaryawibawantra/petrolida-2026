"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { Accept } from "react-dropzone";
import { toast } from "sonner";

import UploadFile from "@/app/competition/register/form/_components/upload-file";
import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
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
import CompetitionGuard from "../_components/competition-guard";
import StageResultBanner from "../_components/stage-result-banner";

// Competition configuration
const competitionConfig: Record<
  string,
  {
    name: string;
    fileSubmissions: number;
  }
> = {
  "paper-and-poster": { name: "Paper and Poster", fileSubmissions: 1 },
  "case-study": { name: "Case Study", fileSubmissions: 1 },
  "fracturing-fluid-design": {
    name: "Fracturing Fluid Design",
    fileSubmissions: 1,
  },
  "oil-rig-design": { name: "Oil Rig Design", fileSubmissions: 1 },
  petrosmart: { name: "Petrosmart", fileSubmissions: 1 },
  "business-case": { name: "Business Case", fileSubmissions: 1 },
  "plan-of-development": { name: "Plan of Development", fileSubmissions: 1 },
  "geothermal-case": { name: "Geothermal Case", fileSubmissions: 1 },
};

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

export default function EditSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: teamData, isLoading } = useGetMyTeam();
  const { mutate: paySemifinal, isPending: isPayingSemifinal } =
    usePayCompetitionSemifinal();
  const { mutate: submitFile, isPending: isSubmitting } =
    useSubmitFileSubmission();
  const { mutate: updateFile, isPending: isUpdating } =
    useUpdateFileSubmission();

  const config = competitionConfig[slug];
  const team = teamData?.data;
  const lastStage = team?.last_stage;

  const [submission1, setSubmission1] = useState<File | null>(null);
  const [submission2, setSubmission2] = useState<File | null>(null);
  const [submission3, setSubmission3] = useState<File | null>(null);
  const [submission4, setSubmission4] = useState<File | null>(null);

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

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Typography variant="h3" className="text-white">
          No team data found
        </Typography>
      </div>
    );
  }

  const hasExistingSubmission = !!team.submission;
  const isFinalStage = team.stage === "final";
  const isBCCSemifinal = slug === "business-case" && team.stage === "semifinal";
  const isSemifinalPaymentPaid = team.semifinal_payment?.status === "paid";
  const isFinalPaymentPaid = team.final_payment?.status === "paid";
  const isSubmissionLocked =
    (isBCCSemifinal && !isSemifinalPaymentPaid) ||
    (isFinalStage && !isFinalPaymentPaid);

  // Check which submissions exist
  const hasSubmission1 = !!team.submission?.submission_1;
  const hasSubmission2 = !!team.submission?.submission_2;
  const hasSubmission3 = !!team.submission?.submission_3;
  const hasSubmission4 = !!team.submission?.submission_4;

  // Determine how many files should be shown based on stage and competition
  const getMaxFileSubmissions = () => {
    if (team.stage === "preliminary") {
      return 1;
    }
    if (slug === "business-case") {
      return isFinalStage ? 4 : 2;
    }
    if (isFinalStage && slug === "plan-of-development") {
      return 1;
    }
    if (isFinalStage && slug === "geothermal-case") {
      return 2;
    }
    if (isFinalStage && slug === "oil-rig-design") {
      return 3;
    }
    if (isFinalStage && slug === "fracturing-fluid-design") {
      return 2;
    }
    if (slug === "geothermal-case" && team.stage === "semifinal") {
      return 2;
    }
    return config.fileSubmissions;
  };

  const maxFileSubmissions = getMaxFileSubmissions();
  const deadline = getCompetitionStageDeadline({
    stage: team.stage,
    competition: slug,
  });
  const isPastDeadline = isCompetitionDeadlinePassed(deadline);

  // Get submission labels based on competition and stage
  const getSubmissionLabels = () => {
    if (isFinalStage && slug === "plan-of-development") {
      return {
        submission1:
          "ZIP FILE (Final Report, PPT, Dynamic Model, Excel perhitungan)",
        submission2: "File Submission 2",
        submission3: "File Submission 3",
        submission4: "File Submission 4",
      };
    }
    if (isFinalStage && slug === "geothermal-case") {
      return {
        submission1: "Poster Submission (PDF Only)",
        submission2: "PPT Submission (PDF Only)",
        submission3: "File Submission 3",
        submission4: "File Submission 4",
      };
    }
    if (isFinalStage && slug === "oil-rig-design") {
      return {
        submission1: "File Submission",
        submission2: "File Submission 2",
        submission3: "PPT Submission (PPTX only)",
        submission4: "File Submission 4",
      };
    }
    if (isFinalStage && slug === "fracturing-fluid-design") {
      return {
        submission1: "PPT",
        submission2: "Project Report",
        submission3: "File Submission 3",
        submission4: "File Submission 4",
      };
    }
    if (slug === "business-case") {
      if (isFinalStage) {
        return {
          submission1: "File Submission",
          submission2: "File Submission 2",
          submission3: "Full Project Submission/Poster",
          submission4: "PPT",
        };
      }
    }
    return {
      submission1: "File Submission",
      submission2: "File Submission 2",
      submission3: "File Submission 3",
      submission4: "File Submission 4",
    };
  };

  const submissionLabels = getSubmissionLabels();
  const submissionUploadOptions: Partial<
    Record<
      "submission1" | "submission2" | "submission3" | "submission4",
      SubmissionUploadOptions
    >
  > = (() => {
    if (isFinalStage && slug === "geothermal-case") {
      return {
        submission1: {
          ...PDF_UPLOAD_OPTIONS,
          description: "Upload your poster submission file (PDF only)",
        },
        submission2: {
          ...PDF_UPLOAD_OPTIONS,
          description: "Upload your PPT submission file (PDF only)",
        },
      };
    }

    if (isFinalStage && slug === "oil-rig-design") {
      return {
        submission3: {
          ...PPTX_UPLOAD_OPTIONS,
          maxSize: 20_000_000,
        },
      };
    }

    if (isFinalStage && slug === "fracturing-fluid-design") {
      return {
        submission1: PPTX_UPLOAD_OPTIONS,
        submission2: {
          ...PDF_UPLOAD_OPTIONS,
          description: "Upload your project report file (PDF only)",
        },
      };
    }

    return {};
  })();
  const submission1UploadOptions =
    submissionUploadOptions.submission1 ?? PDF_UPLOAD_OPTIONS;
  const submission2UploadOptions = submissionUploadOptions.submission2 ?? {
    ...PDF_UPLOAD_OPTIONS,
    description: "Upload your second submission file (PDF only)",
  };
  const submission3UploadOptions = submissionUploadOptions.submission3 ?? {
    ...PDF_UPLOAD_OPTIONS,
    description: "Upload your third submission file (PDF only)",
  };

  const BREADCRUMBS = [
    { name: "Competition", href: "/competition/dashboard/user" },
    { name: config.name, href: `/competition/dashboard/${slug}` },
    { name: "Edit Submission", href: `/competition/dashboard/${slug}/edit` },
  ];

  const handlePaySemifinal = () => {
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

  const handleSubmit = () => {
    if (isSubmissionLocked) {
      return;
    }

    const formData = new FormData();

    if (submission1) {
      formData.append("submission_1", submission1);
    }
    if (submission2) {
      formData.append("submission_2", submission2);
    }
    if (submission3) {
      formData.append("submission_3", submission3);
    }
    if (submission4) {
      formData.append("submission_4", submission4);
    }

    // Check if at least one file is selected
    if (!submission1 && !submission2 && !submission3 && !submission4) {
      toast.error("Please upload at least one file");
      return;
    }

    const mutationFn = hasExistingSubmission ? updateFile : submitFile;

    mutationFn(formData, {
      onSuccess: () => {
        router.push(`/competition/dashboard/${slug}`);
      },
    });
  };

  const isPending = isSubmitting || isUpdating;

  return (
    <CompetitionGuard>
      <div className="flex flex-col space-y-8">
        {/* Loading Overlay */}
        {isPending && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <Typography variant="h3" weight="bold" className="text-gray-900">
                {hasExistingSubmission ? "Updating..." : "Submitting..."}
              </Typography>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start gap-4">
          <Typography
            variant="h1"
            weight="bold"
            className="text-white uppercase"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            Edit Submission
          </Typography>
          <BreadcrumbGroup
            items={BREADCRUMBS}
            textColor="text-white"
            activeColor="text-white"
            separatorColor="text-white"
          />
        </div>

        {/* Submission Form */}
        <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
          <Typography variant="h3" weight="bold" className="mb-6 text-gray-900">
            {config.name} Submission
          </Typography>
          <StageResultBanner
            competitionName={config.name}
            stage={team.stage}
            lastStage={lastStage}
          />
          {(isPastDeadline || team.submission?.is_late) && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <Typography variant="p" weight="bold" className="text-red-900">
                Late Submission Notice
              </Typography>
              <Typography variant="p" className="mt-1 text-red-800">
                The deadline for this stage has passed. Any new upload will be
                recorded as a late submission.
              </Typography>
            </div>
          )}

          {isSubmissionLocked ? (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <Typography variant="p" weight="bold" className="text-amber-900">
                Submission Locked
              </Typography>
              <Typography variant="p" className="mt-2 text-amber-800">
                {isBCCSemifinal
                  ? "BCC semifinal submission will open after the semifinal payment is confirmed."
                  : "Final submission will open after the final stage payment is confirmed."}
              </Typography>
              <Button
                variant="primary"
                size="md"
                onClick={
                  isBCCSemifinal
                    ? handlePaySemifinal
                    : () =>
                        router.push("/competition/dashboard/profile/finalize")
                }
                disabled={isPayingSemifinal}
                className="mt-4"
              >
                {isBCCSemifinal
                  ? isPayingSemifinal
                    ? "Preparing invoice..."
                    : "Pay Semifinal"
                  : "Choose Stay Option & Pay Final Stage Fee"}
              </Button>
            </div>
          ) : null}

          <div className="space-y-6">
            {/* File Submission 1 - Always show if exists or no submissions yet */}
            {(hasSubmission1 || !hasExistingSubmission) && (
              <UploadFile
                title={submissionLabels.submission1 || "File Submission 1"}
                value={submission1}
                onChange={setSubmission1}
                isRequired={false}
                description={submission1UploadOptions.description}
                accept={submission1UploadOptions.accept}
                supportFiles={submission1UploadOptions.supportFiles}
                maxSize={submission1UploadOptions.maxSize ?? 10_000_000}
              />
            )}

            {/* File Submission 2 - Show if exists OR if max files >= 2 */}
            {(hasSubmission2 ||
              (!hasExistingSubmission && maxFileSubmissions >= 2) ||
              (hasExistingSubmission && maxFileSubmissions >= 2)) && (
              <UploadFile
                title={submissionLabels.submission2 || "File Submission 2"}
                value={submission2}
                onChange={setSubmission2}
                isRequired={false}
                description={submission2UploadOptions.description}
                accept={submission2UploadOptions.accept}
                supportFiles={submission2UploadOptions.supportFiles}
                maxSize={submission2UploadOptions.maxSize ?? 10_000_000}
              />
            )}

            {/* File Submission 3 - Show if exists OR if max files >= 3 */}
            {(hasSubmission3 ||
              (!hasExistingSubmission && maxFileSubmissions >= 3) ||
              (hasExistingSubmission && maxFileSubmissions >= 3)) && (
              <UploadFile
                title={submissionLabels.submission3 || "File Submission 3"}
                value={submission3}
                onChange={setSubmission3}
                isRequired={false}
                description={submission3UploadOptions.description}
                accept={submission3UploadOptions.accept}
                supportFiles={submission3UploadOptions.supportFiles}
                maxSize={submission3UploadOptions.maxSize ?? 10_000_000}
              />
            )}

            {/* File Submission 4 - Show if exists OR if max files >= 4 */}
            {(hasSubmission4 ||
              (!hasExistingSubmission && maxFileSubmissions >= 4) ||
              (hasExistingSubmission && maxFileSubmissions >= 4)) && (
              <UploadFile
                title={submissionLabels.submission4 || "File Submission 4"}
                value={submission4}
                onChange={setSubmission4}
                isRequired={false}
                description="Upload your fourth submission file (PDF only)"
                accept={{ "application/pdf": [".pdf"] }}
                supportFiles={["pdf"]}
                maxSize={10_000_000}
              />
            )}

            {/* Existing Files Info */}
            {hasExistingSubmission && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <Typography variant="p" className="text-sm text-blue-800">
                  Note: Only upload files you want to update. Existing files
                  will remain unchanged if you don't upload new ones.
                </Typography>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => router.push(`/competition/dashboard/${slug}`)}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                className="flex-1"
                disabled={isPending || isSubmissionLocked}
              >
                {hasExistingSubmission ? "Update Submission" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CompetitionGuard>
  );
}
