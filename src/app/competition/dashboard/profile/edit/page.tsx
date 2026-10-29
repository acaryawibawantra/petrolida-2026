"use client";

import { ChevronDown, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import UploadFile from "@/app/competition/register/form/_components/upload-file";
import BreadcrumbGroup from "@/components/breadcrumb";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useGetMyTeam,
  useResubmitCompetition,
  useUpdateCompetition,
} from "@/hooks/use-competition";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type LeaderFormData = {
  id: string;
  name: string;
  gender: string;
  email: string;
  major: string;
  batch: string;
  phone_number: string;
  student_id_card: File | null;
  twibbon_ig: File | null;
  story_ig: File | null;
  follow_ig: File | null;
  follow_linkedin: File | null;
  follow_tiktok: File | null;
  repost_competition_ig: File | null;
  existingFiles: {
    student_id_card?: string;
    twibbon_ig?: string;
    story_ig?: string;
    follow_ig?: string;
    follow_linkedin?: string;
    follow_tiktok?: string;
    repost_competition_ig?: string;
  };
};

const emptyLeaderForm: LeaderFormData = {
  id: "",
  name: "",
  gender: "",
  email: "",
  major: "",
  batch: "",
  phone_number: "",
  student_id_card: null,
  twibbon_ig: null,
  story_ig: null,
  follow_ig: null,
  follow_linkedin: null,
  follow_tiktok: null,
  repost_competition_ig: null,
  existingFiles: {},
};

export default function EditProfilePage() {
  const router = useRouter();
  const { data: teamData, isLoading } = useGetMyTeam();
  const { mutate: updateCompetition, isPending: isUpdatingCompetition } =
    useUpdateCompetition();
  const { mutate: resubmitCompetition, isPending: isResubmittingCompetition } =
    useResubmitCompetition();

  const [teamLeaderOpen, setTeamLeaderOpen] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [university, setUniversity] = useState("");
  const [leaderData, setLeaderData] = useState<LeaderFormData>(emptyLeaderForm);

  const BREADCRUMBS = [
    { name: "My Profile", href: "/competition/dashboard/profile" },
    { name: "Edit", href: "/competition/dashboard/profile/edit" },
  ];

  const isPending = isUpdatingCompetition || isResubmittingCompetition;

  useEffect(() => {
    if (!teamData?.data) {
      return;
    }

    const team = teamData.data;
    const leader = team.participants?.find(
      (participant: any) => participant.type === "LEADER",
    );

    setTeamName(team.team_name || "");
    setUniversity(team.university || "");
    setLeaderData(
      leader
        ? {
            id: leader.id,
            name: leader.name || "",
            gender: leader.gender || "",
            email: leader.email || "",
            major: leader.major || "",
            batch: leader.batch || "",
            phone_number: leader.phone_number || "",
            student_id_card: null,
            twibbon_ig: null,
            story_ig: null,
            follow_ig: null,
            follow_linkedin: null,
            follow_tiktok: null,
            repost_competition_ig: null,
            existingFiles: {
              student_id_card: leader.student_id_card,
              twibbon_ig: leader.twibbon_ig,
              story_ig: leader.story_ig,
              follow_ig: leader.follow_ig,
              follow_linkedin: leader.follow_linkedin,
              follow_tiktok: leader.follow_tiktok,
              repost_competition_ig: leader.repost_competition_ig,
            },
          }
        : emptyLeaderForm,
    );
  }, [teamData]);

  const updateLeaderData = (
    field: keyof LeaderFormData,
    value: string | File | null,
  ) => {
    setLeaderData((current) => ({ ...current, [field]: value }));
  };

  const validateLeader = () => {
    if (!leaderData.id) {
      toast.error("Team leader data could not be loaded");
      return false;
    }

    if (
      !teamName.trim() ||
      !university.trim() ||
      !leaderData.name.trim() ||
      !leaderData.email.trim() ||
      !leaderData.major.trim() ||
      !leaderData.batch.trim() ||
      !leaderData.phone_number.trim()
    ) {
      toast.error("Team and leader data must be completed before saving");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!teamData?.data?.id) return;
    if (!validateLeader()) return;

    const formData = new FormData();
    formData.append("team_name", teamName.trim());
    formData.append("university", university.trim());
    formData.append("participants[0][id]", leaderData.id);
    formData.append("participants[0][name]", leaderData.name.trim());
    formData.append("participants[0][gender]", leaderData.gender.trim());
    formData.append("participants[0][email]", leaderData.email.trim());
    formData.append("participants[0][major]", leaderData.major.trim());
    formData.append("participants[0][batch]", leaderData.batch.trim());
    formData.append(
      "participants[0][phone_number]",
      leaderData.phone_number.trim(),
    );

    if (leaderData.student_id_card) {
      formData.append(
        "participants[0][student_id_card]",
        leaderData.student_id_card,
      );
    }
    if (leaderData.twibbon_ig) {
      formData.append("participants[0][twibbon_ig]", leaderData.twibbon_ig);
    }
    if (leaderData.story_ig) {
      formData.append("participants[0][story_ig]", leaderData.story_ig);
    }
    if (leaderData.follow_ig) {
      formData.append("participants[0][follow_ig]", leaderData.follow_ig);
    }
    if (leaderData.follow_linkedin) {
      formData.append(
        "participants[0][follow_linkedin]",
        leaderData.follow_linkedin,
      );
    }
    if (leaderData.follow_tiktok) {
      formData.append(
        "participants[0][follow_tiktok]",
        leaderData.follow_tiktok,
      );
    }
    if (leaderData.repost_competition_ig) {
      formData.append(
        "participants[0][repost_competition_ig]",
        leaderData.repost_competition_ig,
      );
    }

    const wasRejected = teamData.data.status === "rejected";

    const handleSuccess = () => {
      if (wasRejected) {
        setShowContactModal(true);
        return;
      }
      router.push("/competition/dashboard/profile");
    };

    if (wasRejected) {
      resubmitCompetition(
        { team_id: teamData.data.id, formData },
        { onSuccess: handleSuccess },
      );
      return;
    }

    updateCompetition(
      { team_id: teamData.data.id, formData },
      { onSuccess: handleSuccess },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Typography variant="h3" className="text-white">
          Loading...
        </Typography>
      </div>
    );
  }

  if (!teamData?.data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Typography variant="h3" className="text-white">
          No team data found
        </Typography>
      </div>
    );
  }

  const team = teamData.data;

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
        <Typography
          variant="h1"
          weight="bold"
          className="max-xl:!text-3xl text-white"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
        >
          Edit Profile
        </Typography>
        <BreadcrumbGroup
          items={BREADCRUMBS}
          textColor="text-white"
          activeColor="text-white"
          separatorColor="text-white"
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {team.status === "rejected" && (
          <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 shadow-lg sm:p-6">
            <Typography
              variant="h3"
              weight="bold"
              className="mb-3 text-red-900"
            >
              Registration Rejected - Action Required
            </Typography>
            <Typography variant="p" className="mb-4 text-red-800">
              Use this page to correct team data and the team leader only.
              Manage other participants from the profile page before you
              resubmit this registration.
            </Typography>
            {team.rejection_reason && (
              <div className="rounded-xl border border-red-200 bg-white p-4">
                <Typography
                  variant="p"
                  weight="semibold"
                  className="mb-2 text-gray-900"
                >
                  Rejection Reason:
                </Typography>
                <Typography variant="p" className="text-gray-800">
                  {team.rejection_reason}
                </Typography>
              </div>
            )}
          </div>
        )}

        <Collapsible open>
          <div className="rounded-2xl border border-primary-400 bg-primary-500 shadow-lg">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-6">
              <Typography variant="h3" weight="bold" className="text-white">
                Team Data Information
              </Typography>
              <ChevronDown className="text-white transition-all duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t border-primary-400/20 bg-white/95 p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <Field
                    label="Email"
                    value={team.email}
                    disabled
                    type="email"
                  />
                  <Field
                    label="Team Name"
                    value={teamName}
                    onChange={setTeamName}
                  />
                  <Field
                    label="University"
                    value={university}
                    onChange={setUniversity}
                  />
                  <Field label="Competition" value={team.event_name} disabled />
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {team.status === "rejected" && (
          <div className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-6">
            <Typography variant="h4" weight="bold" className="text-gray-900">
              Participant Management
            </Typography>
            <Typography variant="p" className="mt-1 text-gray-600">
              Add missing members and edit existing member data from the profile
              page. This keeps participant count and member cards in sync before
              you resubmit.
            </Typography>
            <Link
              href="/competition/dashboard/profile"
              className="mt-4 inline-flex rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Open Participant Management
            </Link>
          </div>
        )}

        <Collapsible open={teamLeaderOpen} onOpenChange={setTeamLeaderOpen}>
          <div className="rounded-2xl border border-primary-400 bg-primary-500 shadow-lg">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-6">
              <Typography variant="h3" weight="bold" className="text-white">
                Team Leader Information
              </Typography>
              <ChevronDown
                className={cn(
                  "text-white transition-all duration-200",
                  !teamLeaderOpen && "rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t border-primary-400/20 bg-white/95 p-6 backdrop-blur-sm">
                <LeaderForm
                  leader={leaderData}
                  updateLeaderData={updateLeaderData}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="mt-4 flex gap-4 max-md:flex-col">
          <button
            onClick={() => router.push("/competition/dashboard/profile")}
            disabled={isPending}
            className="flex-1 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Typography variant="p" weight="bold" className="text-white">
              Cancel
            </Typography>
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Typography variant="p" weight="bold" className="text-white">
              {isPending ? "Saving..." : "Save"}
            </Typography>
          </button>
        </div>
      </div>

      {isPending && (
        <div className="fixed left-0 top-0 z-50 h-screen w-screen bg-slate-500 bg-opacity-55">
          <div className="grid h-full place-items-center">
            <div className="flex animate-pulse flex-col items-center gap-6">
              <NextImage
                src="/logo-new.png"
                width={400}
                height={400}
                className="w-[250px]"
                alt="Loading"
              />
              <Typography
                variant="h3"
                weight="bold"
                className="text-primary-900"
              >
                Saving...
              </Typography>
            </div>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => {
                setShowContactModal(false);
                router.push("/competition/dashboard/profile");
              }}
              className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <Typography
                variant="h3"
                weight="bold"
                className="mb-2 text-gray-900"
              >
                Data Successfully Updated
              </Typography>
            </div>

            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <Typography variant="p" className="mb-3 text-gray-800">
                Your team and leader data have been updated successfully. Please
                make sure all member data is complete from the profile page,
                then contact the committee or your assigned Contact Person to
                inform them that your team has resubmitted its data.
              </Typography>
              <Typography
                variant="p"
                weight="semibold"
                className="mb-2 text-blue-900"
              >
                Next Steps:
              </Typography>
              <Typography variant="p" className="text-sm text-gray-700">
                Check your email or WhatsApp for your CP information, or reach
                out through official Petrolida communication channels for follow
                up.
              </Typography>
            </div>

            <button
              onClick={() => {
                setShowContactModal(false);
                router.push("/competition/dashboard/profile");
              }}
              className="w-full rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-700"
            >
              <Typography variant="p" weight="bold" className="text-white">
                Return to Profile
              </Typography>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div>
      <Typography variant="p" weight="semibold" className="mb-2 text-gray-900">
        {label}
      </Typography>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(
          "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none",
          disabled && "bg-gray-100",
        )}
        disabled={disabled}
      />
    </div>
  );
}

function LeaderForm({
  leader,
  updateLeaderData,
}: {
  leader: LeaderFormData;
  updateLeaderData: (
    field: keyof LeaderFormData,
    value: string | File | null,
  ) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.values(leader.existingFiles).some(Boolean) && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <Typography
            variant="p"
            weight="semibold"
            className="mb-3 text-blue-900"
          >
            Currently Uploaded Files
          </Typography>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <ExistingFileLink
              href={leader.existingFiles.student_id_card}
              label="Student ID Card"
            />
            <ExistingFileLink
              href={leader.existingFiles.twibbon_ig}
              label="Twibbon Instagram"
            />
            <ExistingFileLink
              href={leader.existingFiles.story_ig}
              label="Story Instagram"
            />
            <ExistingFileLink
              href={leader.existingFiles.follow_ig}
              label="Follow Instagram"
            />
            <ExistingFileLink
              href={leader.existingFiles.follow_linkedin}
              label="Follow LinkedIn"
            />
            <ExistingFileLink
              href={leader.existingFiles.follow_tiktok}
              label="Follow TikTok"
            />
            <ExistingFileLink
              href={leader.existingFiles.repost_competition_ig}
              label="Repost Competition IG"
            />
          </div>
          <Typography variant="p" className="mt-3 text-xs text-blue-700">
            Upload a new file below only if you want to replace the current one.
          </Typography>
        </div>
      )}

      <Field
        label="Full Name"
        value={leader.name}
        onChange={(value) => updateLeaderData("name", value)}
      />
      <div>
        <Typography
          variant="p"
          weight="semibold"
          className="mb-2 text-gray-700"
        >
          Gender
        </Typography>
        <select
          value={leader.gender}
          onChange={(event) => updateLeaderData("gender", event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <Field label="Email" value={leader.email} disabled type="email" />
      <Field
        label="Major"
        value={leader.major}
        onChange={(value) => updateLeaderData("major", value)}
      />
      <Field
        label="Batch"
        value={leader.batch}
        onChange={(value) => updateLeaderData("batch", value)}
      />
      <Field
        label="Whatsapp Number"
        value={leader.phone_number}
        onChange={(value) =>
          updateLeaderData("phone_number", value.replace(/\D/g, ""))
        }
      />

      <UploadField
        title="KTM/Student ID Card"
        value={leader.student_id_card}
        onChange={(file) => updateLeaderData("student_id_card", file)}
      />
      <UploadField
        title="Twibbon Instagram"
        value={leader.twibbon_ig}
        onChange={(file) => updateLeaderData("twibbon_ig", file)}
        description={
          <>
            Screenshot of your Instagram post with Petrolida twibbon.{" "}
            <a
              href="https://petrolida.com/link/CompetitionTwibbon2026"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-600 underline hover:text-primary-700"
            >
              Get twibbon template here
            </a>
          </>
        }
      />
      <UploadField
        title="Story Instagram"
        value={leader.story_ig}
        onChange={(file) => updateLeaderData("story_ig", file)}
        description="Screenshot of your Instagram story about Petrolida"
      />
      <UploadField
        title="Proof of Instagram Follow @petrolida2025"
        value={leader.follow_ig}
        onChange={(file) => updateLeaderData("follow_ig", file)}
        description="Screenshot showing you follow Petrolida's Instagram account"
      />
      <UploadField
        title="Proof of LinkedIn Follow"
        value={leader.follow_linkedin}
        onChange={(file) => updateLeaderData("follow_linkedin", file)}
        description="Screenshot showing you follow Petrolida's LinkedIn account"
      />
      <UploadField
        title="Proof of TikTok Follow"
        value={leader.follow_tiktok}
        onChange={(file) => updateLeaderData("follow_tiktok", file)}
        description="Screenshot showing you follow Petrolida's TikTok account"
      />
      <UploadField
        title="Proof of Repost Competition Instagram"
        value={leader.repost_competition_ig}
        onChange={(file) => updateLeaderData("repost_competition_ig", file)}
        description="Screenshot showing you reposted the competition on Instagram"
      />
    </div>
  );
}

function ExistingFileLink({
  href,
  label,
}: {
  href?: string;
  label: string;
}) {
  if (!href) return null;

  return (
    <Link href={href} target="_blank">
      <div className="flex cursor-pointer items-center gap-2 rounded-lg bg-white p-2 transition-colors hover:bg-gray-50">
        <Eye className="text-primary-600" size={18} />
        <Typography variant="p" className="text-sm text-gray-700">
          {label}
        </Typography>
      </div>
    </Link>
  );
}

function UploadField({
  title,
  value,
  onChange,
  description,
}: {
  title: string;
  value: File | null;
  onChange: (file: File | null) => void;
  description?: ReactNode;
}) {
  return (
    <UploadFile
      title={title}
      value={value}
      onChange={onChange}
      accept={{
        "image/*": [".jpg", ".jpeg", ".png"],
      }}
      supportFiles={["jpg", "jpeg", "png"]}
      description={description}
      isRequired={false}
      variant="md"
    />
  );
}
