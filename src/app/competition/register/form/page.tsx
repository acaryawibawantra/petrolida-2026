"use client";
import Button from "@/components/buttons/button";
import withAuth from "@/components/hoc/with-auth";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetMe } from "@/hooks/use-auth";
import {
  useGetAllCompetitionNames,
  useGetMyTeam,
  useRegisterCompetition,
} from "@/hooks/use-competition";
import { cn } from "@/lib/utils";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import UploadFile from "./_components/upload-file";

interface Participant {
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
}

type TeamFieldKey = "team_name" | "university" | "event_id";

type ParticipantFieldKey =
  | "name"
  | "gender"
  | "major"
  | "batch"
  | "email"
  | "phone_number"
  | "student_id_card"
  | "twibbon_ig"
  | "story_ig"
  | "follow_ig"
  | "follow_linkedin"
  | "follow_tiktok"
  | "repost_competition_ig";

type ValidationResult = {
  teamMissingFields: TeamFieldKey[];
  participantMissingFields: Record<number, ParticipantFieldKey[]>;
  teamStepReason: string;
  participantStepReason: string;
};

const TEAM_FIELD_LABELS: Record<TeamFieldKey, string> = {
  team_name: "Team Name",
  university: "University",
  event_id: "Competition",
};

const PARTICIPANT_FIELD_LABELS: Record<ParticipantFieldKey, string> = {
  name: "Full Name",
  gender: "Gender",
  major: "Major",
  batch: "Batch",
  email: "Email",
  phone_number: "WhatsApp Number",
  student_id_card: "Student ID Card",
  twibbon_ig: "Twibbon Instagram",
  story_ig: "Story Repost Instagram",
  follow_ig: "Follow Instagram Proof",
  follow_linkedin: "Follow LinkedIn Proof",
  follow_tiktok: "Follow TikTok Proof",
  repost_competition_ig: "Repost Competition Instagram Proof",
};

const PARTICIPANT_REQUIRED_FIELDS: ParticipantFieldKey[] = [
  "name",
  "gender",
  "major",
  "batch",
  "email",
  "phone_number",
  "student_id_card",
  "twibbon_ig",
  "story_ig",
  "follow_ig",
  "follow_linkedin",
  "follow_tiktok",
  "repost_competition_ig",
];

const FILE_FIELD_KEYS: ParticipantFieldKey[] = [
  "student_id_card",
  "twibbon_ig",
  "story_ig",
  "follow_ig",
  "follow_linkedin",
  "follow_tiktok",
  "repost_competition_ig",
];

const formatMissingList = (items: string[]) => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

const getParticipantLabel = (index: number) =>
  index === 0 ? "Team Leader" : `Member ${index}`;
function CompetitionRegisterFormPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { mutate: registerCompetition, isPending } = useRegisterCompetition();
  const { data: competitionNamesData, isLoading: isLoadingNames } =
    useGetAllCompetitionNames();
  const { data: myTeamData, isLoading: isLoadingTeam } = useGetMyTeam();
  const { data: meData } = useGetMe();

  const [formData, setFormData] = useState({
    team_name: "",
    university: "",
    event_id: "",
    is_international: false,
  });
  const [participants, setParticipants] = useState<Participant[]>([
    {
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
    },
  ]);

  useEffect(() => {
    const accountEmail = meData?.data?.email;
    if (accountEmail && !participants[0].email) {
      updateParticipant(0, "email", accountEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meData]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    if (isPending) {
      window.addEventListener("beforeunload", handler);
    }
    return () => window.removeEventListener("beforeunload", handler);
  }, [isPending]);

  const selectedCompetition = competitionNamesData?.data?.find(
    (comp: { id: string; max_member?: number }) =>
      comp.id === formData.event_id,
  );
  const maxMember: number | undefined = selectedCompetition?.max_member;
  const slotsLeft =
    typeof maxMember === "number"
      ? Math.max(maxMember - participants.length, 0)
      : null;
  const validation = useMemo<ValidationResult>(() => {
    const teamMissingFields: TeamFieldKey[] = [];

    if (!formData.team_name.trim()) teamMissingFields.push("team_name");
    if (!formData.university.trim()) teamMissingFields.push("university");
    if (!formData.event_id) teamMissingFields.push("event_id");

    const participantMissingFields = participants.reduce<
      Record<number, ParticipantFieldKey[]>
    >((acc, participant, index) => {
      const missingFields = PARTICIPANT_REQUIRED_FIELDS.filter((field) => {
        const value = participant[field];

        if (typeof value === "string") {
          return !value.trim();
        }

        return !value;
      });

      acc[index] = missingFields;
      return acc;
    }, {});

    const firstMissingTeamLabel = teamMissingFields.map(
      (field) => TEAM_FIELD_LABELS[field],
    );
    const teamStepReason =
      teamMissingFields.length > 0
        ? `Go to Next Section is disabled because ${formatMissingList(firstMissingTeamLabel)} ${
            teamMissingFields.length === 1 ? "is" : "are"
          } still required.`
        : "";

    const firstIncompleteParticipant = participants.findIndex(
      (_, index) => participantMissingFields[index]?.length > 0,
    );

    let participantStepReason = "";
    if (firstIncompleteParticipant !== -1) {
      const missingLabels = participantMissingFields[
        firstIncompleteParticipant
      ].map((field) => PARTICIPANT_FIELD_LABELS[field]);
      participantStepReason = `Submit is disabled because ${getParticipantLabel(
        firstIncompleteParticipant,
      )} is missing ${formatMissingList(missingLabels)}.`;
    }

    return {
      teamMissingFields,
      participantMissingFields,
      teamStepReason,
      participantStepReason,
    };
  }, [
    formData.event_id,
    formData.team_name,
    formData.university,
    participants,
  ]);
  const addParticipant = () => {
    if (typeof maxMember === "number" && participants.length >= maxMember) {
      return;
    }
    setParticipants([
      ...participants,
      {
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
      },
    ]);
  };
  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };
  const updateParticipant = (
    index: number,
    field: keyof Participant,
    value: any,
  ) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };
  const isStepValid = () => {
    if (page === 0) {
      return validation.teamMissingFields.length === 0;
    }
    if (page === 1) {
      return Object.values(validation.participantMissingFields).every(
        (missingFields) => missingFields.length === 0,
      );
    }
    return false;
  };
  const handleNextStep = () => {
    if (isStepValid()) {
      setPage(page + 1);
      setHasAttemptedNext(false); // reset so step 2 starts clean
    } else {
      setHasAttemptedNext(true); // reveal step 1 errors
    }
  };
  const handleBack = () => {
    setPage(page - 1);
    setHasAttemptedSubmit(false); // reset step 2 errors when going back
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const FILE_KEYS: (keyof Participant)[] = [
      "student_id_card",
      "twibbon_ig",
      "story_ig",
      "follow_ig",
      "follow_linkedin",
      "follow_tiktok",
      "repost_competition_ig",
    ];
    const totalBytes = participants.reduce(
      (acc, p) =>
        acc +
        FILE_KEYS.reduce((s, k) => s + ((p[k] as File | null)?.size ?? 0), 0),
      0,
    );
    const MAX_TOTAL_MB = 200;
    if (totalBytes > MAX_TOTAL_MB * 1_000_000) {
      const totalMB = Math.round(totalBytes / 1_000_000);
      const { toast } = await import("sonner");
      toast.error(
        `Total file size is too large (${totalMB}MB). Please reduce your image sizes before submitting.`,
      );
      return;
    }
    const submitData = new FormData();
    submitData.append("team_name", formData.team_name);
    submitData.append("university", formData.university);
    submitData.append("event_id", formData.event_id);
    submitData.append("is_international", formData.is_international.toString());
    // Add participants data
    participants.forEach((participant, index) => {
      submitData.append(`participants[${index}][name]`, participant.name);
      submitData.append(`participants[${index}][gender]`, participant.gender);
      submitData.append(`participants[${index}][major]`, participant.major);
      submitData.append(`participants[${index}][batch]`, participant.batch);
      submitData.append(`participants[${index}][email]`, participant.email);
      submitData.append(
        `participants[${index}][phone_number]`,
        participant.phone_number,
      );
      if (participant.student_id_card) {
        submitData.append(
          `participants[${index}][student_id_card]`,
          participant.student_id_card,
        );
      }
      if (participant.twibbon_ig) {
        submitData.append(
          `participants[${index}][twibbon_ig]`,
          participant.twibbon_ig,
        );
      }
      if (participant.story_ig) {
        submitData.append(
          `participants[${index}][story_ig]`,
          participant.story_ig,
        );
      }
      if (participant.follow_ig) {
        submitData.append(
          `participants[${index}][follow_ig]`,
          participant.follow_ig,
        );
      }
      if (participant.follow_linkedin) {
        submitData.append(
          `participants[${index}][follow_linkedin]`,
          participant.follow_linkedin,
        );
      }
      if (participant.follow_tiktok) {
        submitData.append(
          `participants[${index}][follow_tiktok]`,
          participant.follow_tiktok,
        );
      }
      if (participant.repost_competition_ig) {
        submitData.append(
          `participants[${index}][repost_competition_ig]`,
          participant.repost_competition_ig,
        );
      }
    });
    // start at 5% so the progress bar feels alive immediately (not frozen at 0)
    setUploadProgress(5);
    registerCompetition(
      {
        formData: submitData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && progressEvent.total > 0) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            setUploadProgress(percent);
          }
        },
      },
      {
        onSuccess: () => {
          router.push(
            `/competition/register/success?event=${formData.event_id}`,
          );
        },
      },
    );
  };
  // guard: show spinner while team check is loading, redirect if already registered
  if (isLoadingTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg
          className="h-10 w-10 animate-spin text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }
  if (myTeamData?.data) {
    router.replace("/competition/dashboard/user");
    return null;
  }
  return (
    <section className="grid min-h-screen lg:grid-cols-2">
      <div className="col-span-1 overflow-hidden lg:h-screen">
        {/* Desktop Background */}
        <NextImage
          src={"/competition/form-kiri.png"}
          width={720}
          height={1024}
          imgClassName="object-cover w-full h-full object-top"
          className="hidden lg:block lg:h-screen w-full"
          alt="Competition Registration"
          quality={100}
        />
        {/* Mobile Background */}
        <NextImage
          src={"/competition/form-mobile.png"}
          width={500}
          height={312}
          imgClassName="object-cover w-full h-full"
          className="block lg:hidden max-lg:h-[500px] max-md:!h-[302px] w-full"
          alt="Competition Registration Mobile"
          quality={100}
        />
      </div>
      <div className="relative col-span-1">
        <div className="relative lg:h-screen lg:overflow-y-scroll">
          <div className="flex flex-col gap-9 px-6 py-12 pb-[100px]">
            {/* Progress Header */}
            <div className="flex w-full justify-between max-md:flex-col max-md:gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold text-[#7A7A7A]">
                  Step: {page + 1} of 2
                </p>
                <p className="text-xl font-bold">
                  {page === 0 ? "Team Information" : "Participants Information"}
                </p>
              </div>
              <div className="flex items-center gap-3 md:w-1/2">
                <Progress value={((page + 1) / 2) * 100} className="h-3" />
                <p className="text-xl font-semibold text-[#7A7A7A]">
                  {Math.round(((page + 1) / 2) * 100)}%
                </p>
              </div>
            </div>
            <Separator />
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Team Information */}
              {page === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2">
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-gray-700 text-base"
                      >
                        Team Name <span className="text-red-500">*</span>
                      </Typography>
                    </label>
                    <Input
                      required
                      placeholder="Enter your team name"
                      value={formData.team_name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, team_name: e.target.value })
                      }
                      className={cn(
                        "w-full",
                        hasAttemptedNext &&
                          validation.teamMissingFields.includes("team_name") &&
                          "border-red-500 focus-visible:ring-red-200",
                      )}
                    />
                    {hasAttemptedNext &&
                      validation.teamMissingFields.includes("team_name") && (
                        <Typography
                          variant="p"
                          className="mt-2 text-sm text-red-600"
                        >
                          Team Name is required.
                        </Typography>
                      )}
                  </div>
                  <div>
                    <label className="block mb-2">
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-gray-700 text-base"
                      >
                        University <span className="text-red-500">*</span>
                      </Typography>
                    </label>
                    <Input
                      required
                      placeholder="Your university name"
                      value={formData.university || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          university: e.target.value,
                        })
                      }
                      className={cn(
                        "w-full",
                        hasAttemptedNext &&
                          validation.teamMissingFields.includes("university") &&
                          "border-red-500 focus-visible:ring-red-200",
                      )}
                    />
                    {hasAttemptedNext &&
                      validation.teamMissingFields.includes("university") && (
                        <Typography
                          variant="p"
                          className="mt-2 text-sm text-red-600"
                        >
                          University is required.
                        </Typography>
                      )}
                  </div>
                  <div>
                    <label className="block mb-2">
                      <Typography
                        variant="p"
                        weight="semibold"
                        className="text-gray-700 text-base"
                      >
                        Competition <span className="text-red-500">*</span>
                      </Typography>
                    </label>
                    <Select
                      required
                      value={formData.event_id || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, event_id: value })
                      }
                      disabled={isLoadingNames}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          hasAttemptedNext &&
                            validation.teamMissingFields.includes("event_id") &&
                            "border-red-500 focus:ring-red-200",
                        )}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingNames
                              ? "Loading competitions..."
                              : "Select competition"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {competitionNamesData?.data?.map(
                          (comp: { id: string; name: string }) => (
                            <SelectItem key={comp.id} value={comp.id}>
                              {comp.name}
                            </SelectItem>
                          ),
                        )}
                        {!competitionNamesData?.data?.length &&
                          !isLoadingNames && (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No competitions available
                            </div>
                          )}
                      </SelectContent>
                    </Select>
                    {hasAttemptedNext &&
                      validation.teamMissingFields.includes("event_id") && (
                        <Typography
                          variant="p"
                          className="mt-2 text-sm text-red-600"
                        >
                          Competition is required.
                        </Typography>
                      )}
                    {typeof maxMember === "number" && (
                      <Typography
                        variant="p"
                        className="mt-2 text-sm text-gray-600"
                      >
                        Max members: {maxMember} (including leader)
                      </Typography>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_international"
                        checked={formData.is_international}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            is_international: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="is_international"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <Typography
                          variant="p"
                          weight="semibold"
                          className="text-gray-700 text-base"
                        >
                          International Team
                        </Typography>
                      </label>
                    </div>
                    <Typography variant="p" className="text-gray-600 ml-6">
                      Check this if you will use international payment methods
                      (bank transfer, PayPal, etc.) instead of QRIS
                    </Typography>
                  </div>
                </div>
              )}
              {/* Step 2: Participants Information */}
              {page === 1 && (
                <div className="space-y-8">
                  {participants.map((participant, index) => {
                    const missingFields =
                      validation.participantMissingFields[index] ?? [];
                    const missingFileFields = missingFields.filter((field) =>
                      FILE_FIELD_KEYS.includes(field),
                    );

                    return (
                      <div
                        key={index}
                        className={cn(
                          "relative space-y-6 rounded-lg border p-6",
                          hasAttemptedSubmit && missingFields.length > 0
                            ? "border-red-300 bg-red-50/40"
                            : "border-gray-200",
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Typography variant="h3" weight="bold">
                            {index === 0 ? "Team Leader" : `Member ${index}`}
                          </Typography>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeParticipant(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                        {hasAttemptedSubmit && missingFields.length > 0 && (
                          <div className="rounded-lg border border-red-200 bg-white px-4 py-3">
                            <Typography
                              variant="p"
                              weight="semibold"
                              className="text-sm text-red-700"
                            >
                              {missingFields.length} required item
                              {missingFields.length > 1 ? "s" : ""} missing
                            </Typography>
                            <Typography
                              variant="p"
                              className="mt-1 text-sm text-red-600"
                            >
                              {formatMissingList(
                                missingFields.map(
                                  (field) => PARTICIPANT_FIELD_LABELS[field],
                                ),
                              )}
                            </Typography>
                          </div>
                        )}
                        <div>
                          <label className="block mb-2">
                            <Typography
                              variant="p"
                              weight="semibold"
                              className="text-gray-700 text-base"
                            >
                              Full Name <span className="text-red-500">*</span>
                            </Typography>
                          </label>
                          <Input
                            required
                            placeholder="Enter full name"
                            value={participant.name || ""}
                            onChange={(e) =>
                              updateParticipant(index, "name", e.target.value)
                            }
                            className={cn(
                              "w-full",
                              hasAttemptedSubmit &&
                                missingFields.includes("name") &&
                                "border-red-500 focus-visible:ring-red-200",
                            )}
                          />
                          {hasAttemptedSubmit &&
                            missingFields.includes("name") && (
                              <Typography
                                variant="p"
                                className="mt-2 text-sm text-red-600"
                              >
                                Full Name is required.
                              </Typography>
                            )}
                        </div>
                        <div>
                          <label className="block mb-2">
                            <Typography
                              variant="p"
                              weight="semibold"
                              className="text-gray-700 text-base"
                            >
                              Gender <span className="text-red-500">*</span>
                            </Typography>
                          </label>
                          <select
                            required
                            value={participant.gender || ""}
                            onChange={(e) =>
                              updateParticipant(index, "gender", e.target.value)
                            }
                            className={cn(
                              "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                              hasAttemptedSubmit &&
                                missingFields.includes("gender") &&
                                "border-red-500 focus-visible:ring-red-200",
                            )}
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          {hasAttemptedSubmit &&
                            missingFields.includes("gender") && (
                              <Typography
                                variant="p"
                                className="mt-2 text-sm text-red-600"
                              >
                                Gender is required.
                              </Typography>
                            )}
                        </div>
                        <div>
                          <label className="block mb-2">
                            <Typography
                              variant="p"
                              weight="semibold"
                              className="text-gray-700 text-base"
                            >
                              Major <span className="text-red-500">*</span>
                            </Typography>
                          </label>
                          <Input
                            required
                            placeholder="Your major"
                            value={participant.major || ""}
                            onChange={(e) =>
                              updateParticipant(index, "major", e.target.value)
                            }
                            className={cn(
                              "w-full",
                              hasAttemptedSubmit &&
                                missingFields.includes("major") &&
                                "border-red-500 focus-visible:ring-red-200",
                            )}
                          />
                          {hasAttemptedSubmit &&
                            missingFields.includes("major") && (
                              <Typography
                                variant="p"
                                className="mt-2 text-sm text-red-600"
                              >
                                Major is required.
                              </Typography>
                            )}
                        </div>
                        <div>
                          <label className="block mb-2">
                            <Typography
                              variant="p"
                              weight="semibold"
                              className="text-gray-700 text-base"
                            >
                              Batch <span className="text-red-500">*</span>
                            </Typography>
                          </label>
                          <Input
                            required
                            placeholder="e.g., 2023"
                            value={participant.batch || ""}
                            onChange={(e) =>
                              updateParticipant(index, "batch", e.target.value)
                            }
                            className={cn(
                              "w-full",
                              hasAttemptedSubmit &&
                                missingFields.includes("batch") &&
                                "border-red-500 focus-visible:ring-red-200",
                            )}
                          />
                          {hasAttemptedSubmit &&
                            missingFields.includes("batch") && (
                              <Typography
                                variant="p"
                                className="mt-2 text-sm text-red-600"
                              >
                                Batch is required.
                              </Typography>
                            )}
                        </div>
                        <div>
                          <label className="block mb-2">
                            <Typography
                              variant="p"
                              weight="semibold"
                              className="text-gray-700 text-base"
                            >
                              Email <span className="text-red-500">*</span>
                            </Typography>
                          </label>
                          {index === 0 ? (
                            <>
                              <Input
                                readOnly
                                type="email"
                                value={participant.email || ""}
                                className={cn(
                                  "w-full bg-gray-50 text-gray-700 cursor-not-allowed",
                                  hasAttemptedSubmit &&
                                    missingFields.includes("email") &&
                                    "border-red-500 focus-visible:ring-red-200",
                                )}
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Automatically filled from your account email and
                                cannot be changed.
                              </p>
                              {hasAttemptedSubmit &&
                                missingFields.includes("email") && (
                                  <Typography
                                    variant="p"
                                    className="mt-2 text-sm text-red-600"
                                  >
                                    Account email is required before you can
                                    submit.
                                  </Typography>
                                )}
                            </>
                          ) : (
                            <>
                              <Input
                                required
                                type="email"
                                placeholder="email@example.com"
                                value={participant.email || ""}
                                onChange={(e) =>
                                  updateParticipant(
                                    index,
                                    "email",
                                    e.target.value,
                                  )
                                }
                                className={cn(
                                  "w-full",
                                  hasAttemptedSubmit &&
                                    missingFields.includes("email") &&
                                    "border-red-500 focus-visible:ring-red-200",
                                )}
                              />
                              {hasAttemptedSubmit &&
                                missingFields.includes("email") && (
                                  <Typography
                                    variant="p"
                                    className="mt-2 text-sm text-red-600"
                                  >
                                    Email is required.
                                  </Typography>
                                )}
                            </>
                          )}
                        </div>
                        <div>
                          <label className="block mb-2">
                            <Typography
                              variant="p"
                              weight="semibold"
                              className="text-gray-700 text-base"
                            >
                              WhatsApp Number{" "}
                              <span className="text-red-500">*</span>
                            </Typography>
                          </label>
                          <Input
                            required
                            type="tel"
                            placeholder="08123456789"
                            value={participant.phone_number || ""}
                            onChange={(e) =>
                              updateParticipant(
                                index,
                                "phone_number",
                                e.target.value,
                              )
                            }
                            className={cn(
                              "w-full",
                              hasAttemptedSubmit &&
                                missingFields.includes("phone_number") &&
                                "border-red-500 focus-visible:ring-red-200",
                            )}
                          />
                          {hasAttemptedSubmit &&
                            missingFields.includes("phone_number") && (
                              <Typography
                                variant="p"
                                className="mt-2 text-sm text-red-600"
                              >
                                WhatsApp Number is required.
                              </Typography>
                            )}
                        </div>
                        <Separator />
                        <Typography
                          variant="p"
                          weight="bold"
                          className="text-gray-700 text-lg mt-4"
                        >
                          Required Files
                        </Typography>
                        {hasAttemptedSubmit && missingFileFields.length > 0 && (
                          <Typography
                            variant="p"
                            className="text-sm text-red-600"
                          >
                            Missing uploads:{" "}
                            {formatMissingList(
                              missingFileFields.map(
                                (field) => PARTICIPANT_FIELD_LABELS[field],
                              ),
                            )}
                          </Typography>
                        )}
                        <UploadFile
                          title="Student ID Card"
                          value={participant.student_id_card}
                          onChange={(file) =>
                            updateParticipant(index, "student_id_card", file)
                          }
                          accept={{
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                          supportFiles={["jpg", "jpeg", "png"]}
                          isRequired={true}
                          variant="md"
                        />
                        {hasAttemptedSubmit &&
                          missingFields.includes("student_id_card") && (
                            <Typography
                              variant="p"
                              className="-mt-3 text-sm text-red-600"
                            >
                              Student ID Card upload is required.
                            </Typography>
                          )}
                        <UploadFile
                          title="Twibbon Instagram"
                          value={participant.twibbon_ig}
                          onChange={(file) =>
                            updateParticipant(index, "twibbon_ig", file)
                          }
                          accept={{
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                          supportFiles={["jpg", "jpeg", "png"]}
                          description={
                            <>
                              Screenshot of your Instagram post with Petrolida
                              twibbon.{" "}
                              <a
                                href="https://petrolida.com/link/CompetitionTwibbon2026"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 font-semibold underline"
                              >
                                Get twibbon template here
                              </a>
                            </>
                          }
                          isRequired={true}
                          variant="md"
                        />
                        {hasAttemptedSubmit &&
                          missingFields.includes("twibbon_ig") && (
                            <Typography
                              variant="p"
                              className="-mt-3 text-sm text-red-600"
                            >
                              Twibbon Instagram upload is required.
                            </Typography>
                          )}
                        <UploadFile
                          title="Story Repost Instagram"
                          value={participant.story_ig}
                          onChange={(file) =>
                            updateParticipant(index, "story_ig", file)
                          }
                          accept={{
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                          supportFiles={["jpg", "jpeg", "png"]}
                          description="Screenshot of your Instagram story about Petrolida"
                          isRequired={true}
                          variant="md"
                        />
                        {hasAttemptedSubmit &&
                          missingFields.includes("story_ig") && (
                            <Typography
                              variant="p"
                              className="-mt-3 text-sm text-red-600"
                            >
                              Story Repost Instagram upload is required.
                            </Typography>
                          )}
                        <UploadFile
                          title="Follow Instagram Proof"
                          value={participant.follow_ig}
                          onChange={(file) =>
                            updateParticipant(index, "follow_ig", file)
                          }
                          accept={{
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                          supportFiles={["jpg", "jpeg", "png"]}
                          description="Screenshot showing you follow Petrolida's Instagram account"
                          isRequired={true}
                          variant="md"
                        />
                        {hasAttemptedSubmit &&
                          missingFields.includes("follow_ig") && (
                            <Typography
                              variant="p"
                              className="-mt-3 text-sm text-red-600"
                            >
                              Follow Instagram Proof upload is required.
                            </Typography>
                          )}
                        <UploadFile
                          title="Follow LinkedIn Proof"
                          value={participant.follow_linkedin}
                          onChange={(file) =>
                            updateParticipant(index, "follow_linkedin", file)
                          }
                          accept={{
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                          supportFiles={["jpg", "jpeg", "png"]}
                          description="Screenshot showing you follow Petrolida's LinkedIn account"
                          isRequired={true}
                          variant="md"
                        />
                        {hasAttemptedSubmit &&
                          missingFields.includes("follow_linkedin") && (
                            <Typography
                              variant="p"
                              className="-mt-3 text-sm text-red-600"
                            >
                              Follow LinkedIn Proof upload is required.
                            </Typography>
                          )}
                        <UploadFile
                          title="Follow TikTok Proof"
                          value={participant.follow_tiktok}
                          onChange={(file) =>
                            updateParticipant(index, "follow_tiktok", file)
                          }
                          accept={{
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                          supportFiles={["jpg", "jpeg", "png"]}
                          description="Screenshot showing you follow Petrolida's TikTok account"
                          isRequired={true}
                          variant="md"
                        />
                        {hasAttemptedSubmit &&
                          missingFields.includes("follow_tiktok") && (
                            <Typography
                              variant="p"
                              className="-mt-3 text-sm text-red-600"
                            >
                              Follow TikTok Proof upload is required.
                            </Typography>
                          )}
                        <UploadFile
                          title="Repost Competition Instagram Proof"
                          value={participant.repost_competition_ig}
                          onChange={(file) =>
                            updateParticipant(
                              index,
                              "repost_competition_ig",
                              file,
                            )
                          }
                          accept={{
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                          supportFiles={["jpg", "jpeg", "png"]}
                          description="Screenshot of your Instagram repost about the competition"
                          isRequired={true}
                          variant="md"
                        />
                        {hasAttemptedSubmit &&
                          missingFields.includes("repost_competition_ig") && (
                            <Typography
                              variant="p"
                              className="-mt-3 text-sm text-red-600"
                            >
                              Repost Competition Instagram Proof upload is
                              required.
                            </Typography>
                          )}
                      </div>
                    );
                  })}
                  <div className="space-y-2">
                    {typeof maxMember === "number" && (
                      <Typography variant="p" className="text-sm text-gray-600">
                        Slots left: {slotsLeft}
                      </Typography>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addParticipant}
                      className="w-full"
                      disabled={
                        typeof maxMember === "number" &&
                        participants.length >= maxMember
                      }
                    >
                      <Plus size={16} className="mr-2" />
                      Add Team Member
                    </Button>
                  </div>
                </div>
              )}
              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 max-md:flex-col max-md:items-stretch">
                {page !== 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                {page === 0 && <div />}
                {page !== 1 && (
                  <div className="flex max-w-md flex-col items-end gap-2 self-end max-md:max-w-none max-md:items-stretch">
                    {hasAttemptedNext &&
                    !isStepValid() &&
                    validation.teamStepReason ? (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <Typography
                          variant="p"
                          className="text-sm text-red-700"
                        >
                          {validation.teamStepReason}
                        </Typography>
                      </div>
                    ) : !isStepValid() ? (
                      <p className="text-right text-xs text-gray-400 max-md:text-left">
                        Fill in all fields to continue.
                      </p>
                    ) : null}
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      variant="secondary"
                      className="self-end max-md:self-stretch"
                      disabled={!isStepValid()}
                      rightIcon={ArrowRight}
                    >
                      Go to Next Section
                    </Button>
                  </div>
                )}
                {page === 1 && (
                  <div className="flex max-w-md flex-col items-end gap-2 max-md:max-w-none max-md:items-stretch">
                    {isPending ? (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                        <Typography
                          variant="p"
                          className="text-sm text-amber-700"
                        >
                          Submit is temporarily disabled because files are being
                          uploaded now. Please keep this page open until the
                          process finishes.
                        </Typography>
                      </div>
                    ) : hasAttemptedSubmit &&
                      !isStepValid() &&
                      validation.participantStepReason ? (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <Typography
                          variant="p"
                          className="text-sm text-red-700"
                        >
                          {validation.participantStepReason}
                        </Typography>
                      </div>
                    ) : !isStepValid() ? (
                      <p className="text-right text-xs text-gray-400 max-md:text-left">
                        Fill in all fields to submit.
                      </p>
                    ) : (
                      <p className="max-w-xs text-right text-xs text-amber-600 max-md:max-w-none">
                        Warning: Do not close this page while the upload is in
                        progress.
                      </p>
                    )}
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={isPending || !isStepValid()}
                      onClick={() => {
                        if (!isStepValid()) setHasAttemptedSubmit(true);
                      }}
                    >
                      {isPending ? "Uploading..." : "Submit"}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Loading Overlay with Upload Progress */}
      {isPending && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ backgroundColor: `rgba(0,0,0,0.75)` }}
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-10 py-8 shadow-2xl">
            <svg
              className="h-10 w-10 animate-spin text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-base font-semibold text-gray-800">
              {uploadProgress < 100
                ? `Uploading files... ${uploadProgress}%`
                : "Processing your registration..."}
            </p>
            {/* Progress bar */}
            <div className="w-64 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-primary-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="max-w-[260px] text-center text-xs text-gray-500">
              Do not close or refresh this page.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

const CompetitionRegisterFormGuard = withAuth(
  CompetitionRegisterFormPage,
  "user",
);

export default CompetitionRegisterFormGuard;
