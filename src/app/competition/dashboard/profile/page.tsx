"use client";

import UploadFile from "@/app/competition/register/form/_components/upload-file";
import { ChevronDown, Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Countdown from "@/components/countdown";
import Typography from "@/components/typography";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useAddCompetitionParticipant,
  useDeleteCompetitionParticipant,
  useEditCompetitionParticipant,
  useGetAllCompetitionNames,
  useGetMyTeam,
} from "@/hooks/use-competition";
import { getCompetitionStageDeadline } from "@/lib/competition-deadlines";
import { cn } from "@/lib/utils";
import type { Participant } from "@/services/competition";
import useAuthStore from "@/stores/use-auth-store";
import { toast } from "sonner";

type ParticipantFormState = {
  name: string;
  gender: string;
  major: string;
  batch: string;
  email: string;
  phone_number: string;
  student_id_card: File | null;
  twibbon_ig: File | null;
  story_ig: File | null;
  follow_ig: File | null;
  follow_linkedin: File | null;
  follow_tiktok: File | null;
  repost_competition_ig: File | null;
};

type EditParticipantMode = "full" | "gender";

const IMAGE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const IMAGE_SUPPORT_FILES = ["jpg", "jpeg", "png"];

const createEmptyParticipantForm = (): ParticipantFormState => ({
  name: "",
  gender: "",
  major: "",
  batch: "",
  email: "",
  phone_number: "",
  student_id_card: null,
  twibbon_ig: null,
  story_ig: null,
  follow_ig: null,
  follow_linkedin: null,
  follow_tiktok: null,
  repost_competition_ig: null,
});

export default function CompetitionProfilePage() {
  const BREADCRUMBS = [
    { name: "My Profile", href: "/competition/dashboard/profile" },
  ];

  const { data, isLoading } = useGetMyTeam();
  const { data: competitionNamesData } = useGetAllCompetitionNames();
  const { mutate: addParticipant, isPending: isAddingParticipant } =
    useAddCompetitionParticipant();
  const { mutate: deleteParticipant, isPending: isDeletingParticipant } =
    useDeleteCompetitionParticipant();
  const { mutate: editParticipant, isPending: isEditingParticipant } =
    useEditCompetitionParticipant();
  const competitionData = data?.data;
  const user = useAuthStore((state) => state.user);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [editParticipantMode, setEditParticipantMode] =
    useState<EditParticipantMode>("full");
  const [deletingParticipant, setDeletingParticipant] =
    useState<Participant | null>(null);
  const [addParticipantForm, setAddParticipantForm] =
    useState<ParticipantFormState>(createEmptyParticipantForm);
  const [editParticipantForm, setEditParticipantForm] =
    useState<ParticipantFormState>(createEmptyParticipantForm);

  const deadline = getCompetitionStageDeadline({
    stage: competitionData?.stage,
    competition: competitionData?.event_name,
  });

  const selectedCompetition = useMemo(
    () =>
      competitionNamesData?.data?.find(
        (competition: { id: string; max_member?: number }) =>
          competition.id === competitionData?.event_id,
      ),
    [competitionData?.event_id, competitionNamesData?.data],
  );

  const maxMember =
    typeof selectedCompetition?.max_member === "number"
      ? selectedCompetition.max_member
      : undefined;

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start mb-10">
          <div className="h-10 w-48 bg-white/20 rounded-lg animate-pulse" />
          <div className="h-6 w-32 bg-white/20 rounded-lg animate-pulse" />
        </div>

        <div className="space-y-6">
          {/* Skeleton for cards */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-lg border border-white/20">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 shadow-lg border border-primary-400">
            <div className="h-8 w-64 bg-white/20 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-4 w-96 bg-white/20 rounded-lg animate-pulse mx-auto mb-6" />
            <div className="h-12 w-48 bg-white/20 rounded-lg animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // If no competition data, show user profile only
  if (!competitionData) {
    return (
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
          <Typography
            variant="h1"
            weight="bold"
            className="max-xl:!text-3xl text-white"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            My Profile
          </Typography>
          <BreadcrumbGroup
            items={BREADCRUMBS}
            textColor="text-white"
            activeColor="text-white"
            separatorColor="text-white"
          />
        </div>

        <div className="mt-10 flex flex-col gap-6">
          {/* User Profile Card */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 sm:p-8 shadow-lg border border-white/20">
            <Typography
              variant="h2"
              weight="bold"
              className="mb-6 text-gray-900"
            >
              Personal Information
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="p" className="text-sm text-gray-600 mb-1">
                  Full Name
                </Typography>
                <Typography
                  variant="h4"
                  weight="semibold"
                  className="text-gray-900 break-words overflow-wrap-anywhere"
                >
                  {user?.name || "N/A"}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600 mb-1">
                  Email
                </Typography>
                <Typography
                  variant="h4"
                  weight="semibold"
                  className="text-gray-900 break-all overflow-wrap-anywhere"
                >
                  {user?.email || "N/A"}
                </Typography>
              </div>
            </div>
          </div>

          {/* No Competition Card */}
          <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-4 sm:p-8 shadow-lg border border-primary-400 text-center">
            <Typography variant="h2" weight="bold" className="mb-4 text-white">
              No Competition Registered
            </Typography>
            <Typography
              variant="p"
              className="text-white/90 mb-6 text-sm sm:text-base"
            >
              You haven't registered for any competition yet. Register now to
              see your team details here!
            </Typography>
            <Link href="/competition/register">
              <Button
                variant="secondary"
                size="md"
                className="bg-white text-primary-700 hover:bg-gray-100 px-6 sm:px-8 py-3 font-semibold shadow-lg"
              >
                Register Competition
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const leader = competitionData.participants.find(
    (p: Participant) => p.type === "LEADER",
  );
  const members = competitionData.participants.filter(
    (p: Participant) => p.type === "MEMBER",
  );
  const canManageParticipants =
    competitionData.status === "incomplete" ||
    competitionData.status === "rejected";
  const isFinalPaymentPaid = competitionData.final_payment?.status === "paid";
  const canRegisterCityTour =
    competitionData.stage === "final" && isFinalPaymentPaid;
  const canEditParticipantGender =
    competitionData.stage === "final" && isFinalPaymentPaid;
  const isMemberLimitReached =
    typeof maxMember === "number"
      ? competitionData.participants.length >= maxMember
      : false;

  const updateAddParticipantField = (
    field: keyof ParticipantFormState,
    value: string | File | null,
  ) => {
    setAddParticipantForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateEditParticipantField = (
    field: keyof ParticipantFormState,
    value: string | File | null,
  ) => {
    setEditParticipantForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddParticipantModal = () => {
    if (!canManageParticipants) return;
    setAddParticipantForm(createEmptyParticipantForm());
    setIsAddParticipantOpen(true);
  };

  const closeAddParticipantModal = () => {
    setIsAddParticipantOpen(false);
    setAddParticipantForm(createEmptyParticipantForm());
  };

  const openEditParticipantModal = (
    participant: Participant,
    mode: EditParticipantMode = "full",
  ) => {
    if (mode === "full" && !canManageParticipants) return;
    if (mode === "gender" && !canEditParticipantGender) return;

    setEditParticipantMode(mode);
    setEditingParticipant(participant);
    setEditParticipantForm({
      name: participant.name,
      gender: participant.gender || "",
      major: participant.major,
      batch: participant.batch,
      email: participant.email,
      phone_number: participant.phone_number,
      student_id_card: null,
      twibbon_ig: null,
      story_ig: null,
      follow_ig: null,
      follow_linkedin: null,
      follow_tiktok: null,
      repost_competition_ig: null,
    });
  };

  const closeEditParticipantModal = () => {
    setEditingParticipant(null);
    setEditParticipantMode("full");
    setEditParticipantForm(createEmptyParticipantForm());
  };

  const openDeleteParticipantModal = (participant: Participant) => {
    if (!canManageParticipants || participant.type !== "MEMBER") return;
    setDeletingParticipant(participant);
  };

  const closeDeleteParticipantModal = () => {
    setDeletingParticipant(null);
  };

  const buildAddParticipantFormData = () => {
    const formData = new FormData();

    formData.append("name", addParticipantForm.name.trim());
    formData.append("gender", addParticipantForm.gender.trim());
    formData.append("major", addParticipantForm.major.trim());
    formData.append("batch", addParticipantForm.batch.trim());
    formData.append("email", addParticipantForm.email.trim());
    formData.append("phone_number", addParticipantForm.phone_number.trim());
    formData.append(
      "student_id_card",
      addParticipantForm.student_id_card as File,
    );
    formData.append("twibbon_ig", addParticipantForm.twibbon_ig as File);
    formData.append("story_ig", addParticipantForm.story_ig as File);
    formData.append("follow_ig", addParticipantForm.follow_ig as File);
    formData.append(
      "follow_linkedin",
      addParticipantForm.follow_linkedin as File,
    );
    formData.append("follow_tiktok", addParticipantForm.follow_tiktok as File);
    formData.append(
      "repost_competition_ig",
      addParticipantForm.repost_competition_ig as File,
    );

    return formData;
  };

  const handleAddParticipant = () => {
    if (!canManageParticipants) {
      toast.error(
        "Participants can only be managed while the team is incomplete or rejected",
      );
      return;
    }

    if (isMemberLimitReached) {
      toast.error("This team has reached the maximum member limit");
      return;
    }

    if (!competitionData.id) return;

    const requiredTextFields = [
      addParticipantForm.name,
      addParticipantForm.gender,
      addParticipantForm.major,
      addParticipantForm.batch,
      addParticipantForm.email,
      addParticipantForm.phone_number,
    ];

    const requiredFiles = [
      addParticipantForm.student_id_card,
      addParticipantForm.twibbon_ig,
      addParticipantForm.story_ig,
      addParticipantForm.follow_ig,
      addParticipantForm.follow_linkedin,
      addParticipantForm.follow_tiktok,
      addParticipantForm.repost_competition_ig,
    ];

    if (
      requiredTextFields.some((value) => !value.trim()) ||
      requiredFiles.some((file) => !file)
    ) {
      toast.error(
        "Please complete all participant fields and upload all required files",
      );
      return;
    }

    addParticipant(
      {
        teamId: competitionData.id,
        formData: buildAddParticipantFormData(),
      },
      {
        onSuccess: () => {
          closeAddParticipantModal();
        },
      },
    );
  };

  const handleEditParticipant = () => {
    if (editParticipantMode === "gender") {
      if (!canEditParticipantGender) {
        toast.error("Gender can only be updated after final payment is paid");
        return;
      }
      if (!editingParticipant) return;
      if (!editParticipantForm.gender.trim()) {
        toast.error("Please select gender");
        return;
      }
      if (
        editParticipantForm.gender.trim() === (editingParticipant.gender || "")
      ) {
        toast.error("No participant changes to save");
        return;
      }

      const formData = new FormData();
      formData.append("gender", editParticipantForm.gender.trim());

      editParticipant(
        {
          participantId: editingParticipant.id,
          formData,
        },
        {
          onSuccess: () => {
            closeEditParticipantModal();
          },
        },
      );
      return;
    }

    if (!canManageParticipants) {
      toast.error(
        "Participants can only be managed while the team is incomplete or rejected",
      );
      return;
    }

    if (!editingParticipant) return;

    const formData = new FormData();
    let hasChanges = false;

    if (editParticipantForm.name.trim() !== editingParticipant.name) {
      formData.append("name", editParticipantForm.name.trim());
      hasChanges = true;
    }
    if (
      editParticipantForm.gender.trim() !== (editingParticipant.gender || "")
    ) {
      formData.append("gender", editParticipantForm.gender.trim());
      hasChanges = true;
    }
    if (editParticipantForm.major.trim() !== editingParticipant.major) {
      formData.append("major", editParticipantForm.major.trim());
      hasChanges = true;
    }
    if (editParticipantForm.batch.trim() !== editingParticipant.batch) {
      formData.append("batch", editParticipantForm.batch.trim());
      hasChanges = true;
    }
    if (editParticipantForm.email.trim() !== editingParticipant.email) {
      formData.append("email", editParticipantForm.email.trim());
      hasChanges = true;
    }
    if (
      editParticipantForm.phone_number.trim() !==
      editingParticipant.phone_number
    ) {
      formData.append("phone_number", editParticipantForm.phone_number.trim());
      hasChanges = true;
    }

    if (editParticipantForm.student_id_card) {
      formData.append("student_id_card", editParticipantForm.student_id_card);
      hasChanges = true;
    }
    if (editParticipantForm.twibbon_ig) {
      formData.append("twibbon_ig", editParticipantForm.twibbon_ig);
      hasChanges = true;
    }
    if (editParticipantForm.story_ig) {
      formData.append("story_ig", editParticipantForm.story_ig);
      hasChanges = true;
    }
    if (editParticipantForm.follow_ig) {
      formData.append("follow_ig", editParticipantForm.follow_ig);
      hasChanges = true;
    }
    if (editParticipantForm.follow_linkedin) {
      formData.append("follow_linkedin", editParticipantForm.follow_linkedin);
      hasChanges = true;
    }
    if (editParticipantForm.follow_tiktok) {
      formData.append("follow_tiktok", editParticipantForm.follow_tiktok);
      hasChanges = true;
    }
    if (editParticipantForm.repost_competition_ig) {
      formData.append(
        "repost_competition_ig",
        editParticipantForm.repost_competition_ig,
      );
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.error("No participant changes to save");
      return;
    }

    editParticipant(
      {
        participantId: editingParticipant.id,
        formData,
      },
      {
        onSuccess: () => {
          closeEditParticipantModal();
        },
      },
    );
  };

  const handleDeleteParticipant = () => {
    if (!canManageParticipants) {
      toast.error(
        "Participants can only be managed while the team is incomplete or rejected",
      );
      return;
    }

    if (!deletingParticipant || deletingParticipant.type !== "MEMBER") return;

    deleteParticipant(deletingParticipant.id, {
      onSuccess: () => {
        closeDeleteParticipantModal();
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
        <Typography
          variant="h1"
          weight="bold"
          className="max-xl:!text-3xl text-white"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
        >
          My Profile
        </Typography>
        <BreadcrumbGroup
          items={BREADCRUMBS}
          textColor="text-white"
          activeColor="text-white"
          separatorColor="text-white"
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {/* Activity Status */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 sm:p-6 shadow-lg border border-white/20">
          <Typography variant="h3" weight="bold" className="mb-4 text-gray-900">
            Activity Status
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={cn(
                "rounded-xl p-4 border",
                competitionData.status === "verified" ||
                  competitionData.status === "complete"
                  ? "bg-green-50 border-green-200"
                  : competitionData.status === "paid"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-red-50 border-red-200",
              )}
            >
              <Typography variant="p" className="text-sm text-gray-700 mb-1">
                Registration Status
              </Typography>
              <Typography
                variant="h4"
                weight="bold"
                className={cn(
                  "capitalize",
                  competitionData.status === "verified" ||
                    competitionData.status === "complete"
                    ? "text-green-600"
                    : competitionData.status === "paid"
                      ? "text-blue-600"
                      : "text-red-600",
                )}
              >
                {competitionData.status}
              </Typography>
            </div>
            <div
              className={cn(
                "rounded-xl p-4 border",
                competitionData.stage === "final"
                  ? "bg-purple-50 border-purple-200"
                  : competitionData.stage === "semifinal"
                    ? "bg-orange-50 border-orange-200"
                    : competitionData.stage === "preliminary"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200",
              )}
            >
              <Typography variant="p" className="text-sm text-gray-700 mb-1">
                Stage
              </Typography>
              <Typography
                variant="h4"
                weight="bold"
                className={cn(
                  "capitalize",
                  competitionData.stage === "final"
                    ? "text-purple-600"
                    : competitionData.stage === "semifinal"
                      ? "text-orange-600"
                      : competitionData.stage === "preliminary"
                        ? "text-blue-600"
                        : "text-gray-600",
                )}
              >
                {competitionData.stage}
              </Typography>
            </div>
          </div>
        </div>

        {/* Rejection Notice - Show if status is rejected */}
        {competitionData.status === "rejected" && (
          <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-4 sm:p-6 shadow-lg">
            <Typography
              variant="h3"
              weight="bold"
              className="mb-3 text-red-900"
            >
              Registration Rejected
            </Typography>
            <Typography variant="p" className="text-red-800 mb-4">
              Your registration has been rejected. Please review the reason
              below, make the necessary corrections, and resubmit.
            </Typography>
            {competitionData.rejection_reason && (
              <div className="bg-white rounded-xl p-4 border border-red-200">
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-gray-900 mb-2"
                >
                  Rejection Reason:
                </Typography>
                <Typography variant="p" className="text-gray-800">
                  {competitionData.rejection_reason}
                </Typography>
              </div>
            )}
          </div>
        )}

        {/* Edit Button - Show if status is rejected (user must edit first before finalizing) */}
        {competitionData.status === "rejected" && (
          <div className="flex gap-4 max-md:flex-col">
            <Link href="/competition/dashboard/profile/edit" className="flex-1">
              <button className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 transition-colors shadow-md">
                <Typography variant="p" weight="bold" className="text-white">
                  Edit Registration Data
                </Typography>
              </button>
            </Link>
          </div>
        )}

        {canRegisterCityTour && (
          <div className="flex gap-4 max-md:flex-col">
            <Link
              href="/competition/dashboard/profile/finalize"
              className="flex-1"
            >
              <button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 transition-colors shadow-md">
                <Typography variant="p" weight="bold" className="text-white">
                  City Tour Registration
                </Typography>
              </button>
            </Link>
          </div>
        )}

        {/* Participant management actions */}
        {canManageParticipants && (
          <div className="flex flex-col gap-4">
            {competitionData.status === "incomplete" && (
              <div className="flex gap-4 max-md:flex-col">
                <Link
                  href="/competition/dashboard/profile/edit"
                  className="flex-1"
                >
                  <button className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 transition-colors shadow-md">
                    <Typography
                      variant="p"
                      weight="bold"
                      className="text-white"
                    >
                      Edit
                    </Typography>
                  </button>
                </Link>
                <Link
                  href="/competition/dashboard/profile/finalize"
                  className="flex-1"
                >
                  <button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 transition-colors shadow-md">
                    <Typography
                      variant="p"
                      weight="bold"
                      className="text-white"
                    >
                      Finalize
                    </Typography>
                  </button>
                </Link>
              </div>
            )}
            <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 sm:p-6 shadow-lg border border-white/20">
              <div className="flex items-start justify-between gap-4 max-md:flex-col">
                <div>
                  <Typography
                    variant="h4"
                    weight="bold"
                    className="text-gray-900"
                  >
                    Participant Management
                  </Typography>
                  <Typography variant="p" className="mt-1 text-gray-600">
                    Add a new member, update participant details, or remove a
                    member before submitting or resubmitting your registration.
                  </Typography>
                  {typeof maxMember === "number" && (
                    <Typography
                      variant="p"
                      className="mt-2 text-sm text-gray-500"
                    >
                      Team members: {competitionData.participants.length} /{" "}
                      {maxMember}
                    </Typography>
                  )}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={openAddParticipantModal}
                  disabled={isMemberLimitReached}
                  leftIcon={Plus}
                  className="min-w-[190px]"
                >
                  Add Participant
                </Button>
              </div>
              {isMemberLimitReached && (
                <Typography variant="p" className="mt-3 text-sm text-red-600">
                  You have reached the maximum team member limit for this
                  competition.
                </Typography>
              )}
            </div>
          </div>
        )}

        {competitionData.status === "rejected" && (
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-start justify-between gap-4 max-md:flex-col">
              <div>
                <Typography
                  variant="h4"
                  weight="bold"
                  className="text-gray-900"
                >
                  Participant Management
                </Typography>
                <Typography variant="p" className="mt-1 text-gray-600">
                  Add missing members or correct participant data here. Team and
                  team leader corrections should be saved from the edit
                  registration page before you resubmit.
                </Typography>
                {typeof maxMember === "number" && (
                  <Typography
                    variant="p"
                    className="mt-2 text-sm text-gray-500"
                  >
                    Team members: {competitionData.participants.length} /{" "}
                    {maxMember}
                  </Typography>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={openAddParticipantModal}
                disabled={isMemberLimitReached}
                leftIcon={Plus}
                className="min-w-[190px]"
              >
                Add Participant
              </Button>
            </div>
            {isMemberLimitReached && (
              <Typography variant="p" className="mt-3 text-sm text-red-600">
                You have reached the maximum team member limit for this
                competition.
              </Typography>
            )}
          </div>
        )}

        {/* Countdown */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-4 sm:p-8 shadow-lg border border-primary-400">
          <Typography
            variant="h3"
            weight="bold"
            className="mb-4 sm:mb-6 text-center text-white"
          >
            COUNTDOWN
          </Typography>
          <Countdown deadline={deadline} variant="white" />
        </div>

        {/* Team Information */}
        <TeamInformationCard
          title={`${competitionData.team_name} Information`}
          teamInfo={{
            teamName: competitionData.team_name,
            email: competitionData.email,
            institution: competitionData.university,
            competition: competitionData.event_name,
            isInternational: competitionData.is_international,
          }}
        />

        {/* Team Leader Information */}
        {leader && (
          <MemberInformationCard
            title="Team Leader Information"
            member={leader}
            actions={
              canManageParticipants ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={Pencil}
                  onClick={() => openEditParticipantModal(leader)}
                >
                  Edit Participant
                </Button>
              ) : canEditParticipantGender ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={Pencil}
                  onClick={() => openEditParticipantModal(leader, "gender")}
                >
                  Edit Gender
                </Button>
              ) : undefined
            }
          />
        )}

        {/* Members Information */}
        {members.map((member: Participant, index: number) => (
          <MemberInformationCard
            key={member.id}
            title={`Member ${index + 1} Information`}
            member={member}
            actions={
              canManageParticipants ? (
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={Pencil}
                    onClick={() => openEditParticipantModal(member)}
                  >
                    Edit Participant
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    leftIcon={Trash2}
                    onClick={() => openDeleteParticipantModal(member)}
                  >
                    Delete Participant
                  </Button>
                </div>
              ) : canEditParticipantGender ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={Pencil}
                  onClick={() => openEditParticipantModal(member, "gender")}
                >
                  Edit Gender
                </Button>
              ) : undefined
            }
          />
        ))}

        {isAddParticipantOpen && (
          <ParticipantModal
            title="Add Participant"
            description="Add one new participant to your team. All fields and image proofs are required."
            submitLabel={isAddingParticipant ? "Adding..." : "Add Participant"}
            onClose={closeAddParticipantModal}
            onSubmit={handleAddParticipant}
            isSubmitting={isAddingParticipant}
          >
            <ParticipantFormFields
              form={addParticipantForm}
              onFieldChange={updateAddParticipantField}
              mode="add"
            />
          </ParticipantModal>
        )}

        {editingParticipant && (
          <ParticipantModal
            title={
              editParticipantMode === "gender"
                ? `Edit Gender - ${editingParticipant.name}`
                : `Edit ${editingParticipant.type === "LEADER" ? "Team Leader" : "Participant"}`
            }
            description={
              editParticipantMode === "gender"
                ? "Update gender for city tour registration. Other participant data is locked at this stage."
                : "Update only the participant fields that need correction. Upload a new file only when you want to replace the current one."
            }
            submitLabel={
              isEditingParticipant
                ? "Saving..."
                : editParticipantMode === "gender"
                  ? "Save Gender"
                  : "Save Participant Changes"
            }
            onClose={closeEditParticipantModal}
            onSubmit={handleEditParticipant}
            isSubmitting={isEditingParticipant}
          >
            <ParticipantFormFields
              form={editParticipantForm}
              onFieldChange={updateEditParticipantField}
              mode={editParticipantMode === "gender" ? "gender" : "edit"}
              existingParticipant={editingParticipant}
            />
          </ParticipantModal>
        )}

        {deletingParticipant && (
          <ParticipantModal
            title="Delete Participant"
            description={`Delete ${deletingParticipant.name} from your team. This only removes a member, not the team leader, and helps you update participant data before submit or resubmit. Team data will refresh after deletion.`}
            submitLabel={
              isDeletingParticipant ? "Deleting..." : "Delete Participant"
            }
            onClose={closeDeleteParticipantModal}
            onSubmit={handleDeleteParticipant}
            isSubmitting={isDeletingParticipant}
            submitVariant="danger"
          >
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <Typography
                variant="p"
                weight="semibold"
                className="text-red-900"
              >
                You are about to remove this team member:
              </Typography>
              <Typography variant="p" className="mt-2 text-red-800">
                {deletingParticipant.name} ({deletingParticipant.email})
              </Typography>
              <Typography variant="p" className="mt-4 text-sm text-red-800">
                This action is intended for correcting participant data before
                the team is submitted again. The member card and total
                participant count will update after the server confirms
                deletion.
              </Typography>
            </div>
          </ParticipantModal>
        )}
      </div>
    </div>
  );
}

function TeamInformationCard({
  title,
  teamInfo,
}: {
  title: string;
  teamInfo: {
    teamName: string;
    email: string;
    institution: string;
    competition: string;
    isInternational: boolean;
  };
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-2xl bg-primary-500 shadow-lg border border-primary-400">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 sm:p-6">
          <Typography
            variant="h3"
            weight="bold"
            className="text-white text-base sm:text-xl"
          >
            {title}
          </Typography>
          <ChevronDown
            className={cn(
              "text-white transition-all duration-200 flex-shrink-0",
              !isOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-t border-primary-400/20">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Team Name
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-words overflow-wrap-anywhere"
                >
                  {teamInfo.teamName}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Email
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-all overflow-wrap-anywhere"
                >
                  {teamInfo.email}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Institution
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-words overflow-wrap-anywhere"
                >
                  {teamInfo.institution}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Competition
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-words overflow-wrap-anywhere"
                >
                  {teamInfo.competition}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  International Team
                </Typography>
                <Typography variant="p" weight="medium">
                  {teamInfo.isInternational ? "Yes" : "No"}
                </Typography>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function MemberInformationCard({
  title,
  member,
  actions,
}: {
  title: string;
  member: Participant;
  actions?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-2xl bg-primary-500 shadow-lg border border-primary-400">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 sm:p-6">
          <Typography
            variant="h3"
            weight="bold"
            className="text-white text-base sm:text-xl"
          >
            {title}
          </Typography>
          <ChevronDown
            className={cn(
              "text-white transition-all duration-200 flex-shrink-0",
              !isOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-t border-primary-400/20">
            {actions && <div className="mb-4 flex justify-end">{actions}</div>}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Full Name
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-words overflow-wrap-anywhere"
                >
                  {member.name}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Major
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-words overflow-wrap-anywhere"
                >
                  {member.major}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Gender
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-words overflow-wrap-anywhere"
                >
                  {formatGender(member.gender)}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Batch
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-words overflow-wrap-anywhere"
                >
                  {member.batch}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Email
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-all overflow-wrap-anywhere"
                >
                  {member.email}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="text-sm text-gray-600">
                  Whatsapp Number
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className="break-all overflow-wrap-anywhere"
                >
                  {member.phone_number}
                </Typography>
              </div>
            </div>

            {/* Files Section */}
            <div className="mt-6">
              <Typography
                variant="h4"
                weight="bold"
                className="mb-4 text-gray-900"
              >
                Documents
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Student ID Card
                  </Typography>
                  <Link href={member.student_id_card} target="_blank">
                    <div className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-primary-100 py-3 transition-all duration-200 hover:bg-primary-200">
                      <Eye className="text-primary-800" />
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-primary-800"
                      >
                        View file
                      </Typography>
                    </div>
                  </Link>
                </div>
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Proof of Instagram Story
                  </Typography>
                  <Link href={member.story_ig} target="_blank">
                    <div className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-primary-100 py-3 transition-all duration-200 hover:bg-primary-200">
                      <Eye className="text-primary-800" />
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-primary-800"
                      >
                        View file
                      </Typography>
                    </div>
                  </Link>
                </div>
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Proof of Twibbon
                  </Typography>
                  <Link href={member.twibbon_ig} target="_blank">
                    <div className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-primary-100 py-3 transition-all duration-200 hover:bg-primary-200">
                      <Eye className="text-primary-800" />
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-primary-800"
                      >
                        View file
                      </Typography>
                    </div>
                  </Link>
                </div>
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Proof of Following Instagram
                  </Typography>
                  <Link href={member.follow_ig} target="_blank">
                    <div className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-primary-100 py-3 transition-all duration-200 hover:bg-primary-200">
                      <Eye className="text-primary-800" />
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-primary-800"
                      >
                        View file
                      </Typography>
                    </div>
                  </Link>
                </div>
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Proof of Following LinkedIn
                  </Typography>
                  <Link href={member.follow_linkedin} target="_blank">
                    <div className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-primary-100 py-3 transition-all duration-200 hover:bg-primary-200">
                      <Eye className="text-primary-800" />
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-primary-800"
                      >
                        View file
                      </Typography>
                    </div>
                  </Link>
                </div>
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Proof of Following TikTok
                  </Typography>
                  <Link href={member.follow_tiktok} target="_blank">
                    <div className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-primary-100 py-3 transition-all duration-200 hover:bg-primary-200">
                      <Eye className="text-primary-800" />
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-primary-800"
                      >
                        View file
                      </Typography>
                    </div>
                  </Link>
                </div>
                <div className="space-y-2">
                  <Typography
                    variant="p"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    Proof of Repost Competition Instagram
                  </Typography>
                  <Link href={member.repost_competition_ig} target="_blank">
                    <div className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-primary-100 py-3 transition-all duration-200 hover:bg-primary-200">
                      <Eye className="text-primary-800" />
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-primary-800"
                      >
                        View file
                      </Typography>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function formatGender(gender?: string) {
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  return "Unknown";
}

function ParticipantModal({
  title,
  description,
  submitLabel,
  isSubmitting,
  submitVariant = "secondary",
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  description: string;
  submitLabel: string;
  isSubmitting: boolean;
  submitVariant?: "secondary" | "danger";
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white px-6 py-5">
          <div>
            <Typography variant="h3" weight="bold" className="text-gray-900">
              {title}
            </Typography>
            <Typography variant="p" className="mt-1 text-gray-600">
              {description}
            </Typography>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-6 px-6 py-6">{children}</div>
        <div className="sticky bottom-0 z-10 flex justify-end gap-3 border-t bg-white px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={submitVariant}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ParticipantFormFields({
  form,
  onFieldChange,
  mode,
  existingParticipant,
}: {
  form: ParticipantFormState;
  onFieldChange: (
    field: keyof ParticipantFormState,
    value: string | File | null,
  ) => void;
  mode: "add" | "edit" | "gender";
  existingParticipant?: Participant;
}) {
  const fileDescription = (label: string, currentUrl?: string) =>
    mode === "edit" && currentUrl ? (
      <>
        Current file available.{" "}
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary-600 underline"
        >
          View {label.toLowerCase()}
        </a>
      </>
    ) : undefined;

  if (mode === "gender") {
    return (
      <div>
        <Typography
          variant="p"
          weight="semibold"
          className="mb-2 text-gray-700"
        >
          Gender <span className="text-red-500">*</span>
        </Typography>
        <select
          value={form.gender}
          onChange={(e) => onFieldChange("gender", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Typography
            variant="p"
            weight="semibold"
            className="mb-2 text-gray-700"
          >
            Full Name <span className="text-red-500">*</span>
          </Typography>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div>
          <Typography
            variant="p"
            weight="semibold"
            className="mb-2 text-gray-700"
          >
            Gender <span className="text-red-500">*</span>
          </Typography>
          <select
            value={form.gender}
            onChange={(e) => onFieldChange("gender", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <Typography
            variant="p"
            weight="semibold"
            className="mb-2 text-gray-700"
          >
            Email <span className="text-red-500">*</span>
          </Typography>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div>
          <Typography
            variant="p"
            weight="semibold"
            className="mb-2 text-gray-700"
          >
            Major <span className="text-red-500">*</span>
          </Typography>
          <input
            type="text"
            value={form.major}
            onChange={(e) => onFieldChange("major", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div>
          <Typography
            variant="p"
            weight="semibold"
            className="mb-2 text-gray-700"
          >
            Batch <span className="text-red-500">*</span>
          </Typography>
          <input
            type="text"
            value={form.batch}
            onChange={(e) => onFieldChange("batch", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <Typography
            variant="p"
            weight="semibold"
            className="mb-2 text-gray-700"
          >
            WhatsApp Number <span className="text-red-500">*</span>
          </Typography>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.phone_number}
            onChange={(e) =>
              onFieldChange("phone_number", e.target.value.replace(/\D/g, ""))
            }
            placeholder="Digits only, example 08123456789"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <UploadFile
          title="Student ID Card"
          value={form.student_id_card}
          onChange={(file) => onFieldChange("student_id_card", file)}
          accept={IMAGE_ACCEPT}
          supportFiles={IMAGE_SUPPORT_FILES}
          description={fileDescription(
            "Student ID Card",
            existingParticipant?.student_id_card,
          )}
          isRequired={mode === "add"}
          variant="md"
          maxSize={10_000_000}
        />
        <UploadFile
          title="Twibbon Instagram"
          value={form.twibbon_ig}
          onChange={(file) => onFieldChange("twibbon_ig", file)}
          accept={IMAGE_ACCEPT}
          supportFiles={IMAGE_SUPPORT_FILES}
          description={fileDescription(
            "Twibbon Instagram",
            existingParticipant?.twibbon_ig,
          )}
          isRequired={mode === "add"}
          variant="md"
          maxSize={10_000_000}
        />
        <UploadFile
          title="Story Instagram"
          value={form.story_ig}
          onChange={(file) => onFieldChange("story_ig", file)}
          accept={IMAGE_ACCEPT}
          supportFiles={IMAGE_SUPPORT_FILES}
          description={fileDescription(
            "Story Instagram",
            existingParticipant?.story_ig,
          )}
          isRequired={mode === "add"}
          variant="md"
          maxSize={10_000_000}
        />
        <UploadFile
          title="Follow Instagram Proof"
          value={form.follow_ig}
          onChange={(file) => onFieldChange("follow_ig", file)}
          accept={IMAGE_ACCEPT}
          supportFiles={IMAGE_SUPPORT_FILES}
          description={fileDescription(
            "Follow Instagram Proof",
            existingParticipant?.follow_ig,
          )}
          isRequired={mode === "add"}
          variant="md"
          maxSize={10_000_000}
        />
        <UploadFile
          title="Follow LinkedIn Proof"
          value={form.follow_linkedin}
          onChange={(file) => onFieldChange("follow_linkedin", file)}
          accept={IMAGE_ACCEPT}
          supportFiles={IMAGE_SUPPORT_FILES}
          description={fileDescription(
            "Follow LinkedIn Proof",
            existingParticipant?.follow_linkedin,
          )}
          isRequired={mode === "add"}
          variant="md"
          maxSize={10_000_000}
        />
        <UploadFile
          title="Follow TikTok Proof"
          value={form.follow_tiktok}
          onChange={(file) => onFieldChange("follow_tiktok", file)}
          accept={IMAGE_ACCEPT}
          supportFiles={IMAGE_SUPPORT_FILES}
          description={fileDescription(
            "Follow TikTok Proof",
            existingParticipant?.follow_tiktok,
          )}
          isRequired={mode === "add"}
          variant="md"
          maxSize={10_000_000}
        />
        <UploadFile
          title="Repost Competition Instagram Proof"
          value={form.repost_competition_ig}
          onChange={(file) => onFieldChange("repost_competition_ig", file)}
          accept={IMAGE_ACCEPT}
          supportFiles={IMAGE_SUPPORT_FILES}
          description={fileDescription(
            "Repost Competition Instagram Proof",
            existingParticipant?.repost_competition_ig,
          )}
          isRequired={mode === "add"}
          variant="md"
          maxSize={10_000_000}
        />
      </div>
    </>
  );
}
