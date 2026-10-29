"use client";

import { ChevronDown, ExternalLink, Eye, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Countdown from "@/components/countdown";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMyCityTour, useRegisterCityTour } from "@/hooks/use-city-tour";
import {
  useCancelCompetitionFinalInvoice,
  useCheckReferralCode,
  useGetCompetitionPriceById,
  useGetMyTeam,
  usePayCompetition,
  usePayCompetitionFinal,
  useUploadInternationalPaymentProof,
} from "@/hooks/use-competition";
import { cn } from "@/lib/utils";

type FinalAccommodationChoice = "accom" | "non_accom" | null;
const FINAL_ACCOMMODATION_PRICE = 675000;
const FINAL_NON_ACCOMMODATION_PRICE = 400000;

export default function FinalizePage() {
  const { data: teamData, isLoading } = useGetMyTeam();
  const { mutate: payCompetition, isPending: isPayPending } =
    usePayCompetition();
  const { mutate: payCompetitionFinal, isPending: isFinalPayPending } =
    usePayCompetitionFinal();
  const { mutate: cancelFinalInvoice, isPending: isCancelFinalInvoicePending } =
    useCancelCompetitionFinalInvoice();
  const { mutate: uploadPaymentProof, isPending: isUploadingProof } =
    useUploadInternationalPaymentProof();
  const { data: cityTourData } = useGetMyCityTour();
  const { mutate: registerCityTour, isPending: isCityTourPending } =
    useRegisterCityTour();

  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [referralCodeInput, setReferralCodeInput] = useState<string>("");
  const [appliedReferralCode, setAppliedReferralCode] = useState<string>("");
  const [referralDiscount, setReferralDiscount] = useState<number>(0);
  const [voucherType, setVoucherType] = useState<"percentage" | "fixed">(
    "fixed",
  );
  const [participantSelections, setParticipantSelections] = useState<
    Record<string, FinalAccommodationChoice>
  >({});
  const [showFinalPaymentConfirm, setShowFinalPaymentConfirm] = useState(false);
  const [showDeleteInvoiceModal, setShowDeleteInvoiceModal] = useState(false);
  const [cityTourSelections, setCityTourSelections] = useState<
    Record<string, boolean>
  >({});
  const [cityTourStudentID, setCityTourStudentID] = useState("");
  const [cityTourAllergies, setCityTourAllergies] = useState("");
  const [cityTourSongRequest, setCityTourSongRequest] = useState("");

  const team = teamData?.data;
  const isFinalStage = team?.stage === "final";

  const { data: priceData, isLoading: isPriceLoading } =
    useGetCompetitionPriceById(team?.event_id || "");
  const { mutate: checkReferralCode, isPending: isCheckingReferral } =
    useCheckReferralCode();

  const BREADCRUMBS = [
    { name: "My Profile", href: "/competition/dashboard/profile" },
    { name: "Finalize", href: "/competition/dashboard/profile/finalize" },
  ];

  useEffect(() => {
    if (!team?.participants?.length) return;

    setParticipantSelections((prev) => {
      const next = { ...prev };

      for (const participant of team.participants) {
        next[participant.id] =
          prev[participant.id] === undefined
            ? participant.final_accommodation_type ?? null
            : prev[participant.id];
      }

      return next;
    });
  }, [team?.participants]);

  if (isLoading || (!isFinalStage && isPriceLoading)) {
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

  const leader = team.participants?.find(
    (participant: any) => participant.type === "LEADER",
  );
  const members =
    team.participants?.filter(
      (participant: any) => participant.type === "MEMBER",
    ) || [];
  const finalPayment = team.final_payment;
  const cityTourRegistration = cityTourData?.data;
  const accommodationPrice =
    finalPayment?.accommodation_price ?? FINAL_ACCOMMODATION_PRICE;
  const nonAccommodationPrice =
    finalPayment?.non_accommodation_price ?? FINAL_NON_ACCOMMODATION_PRICE;
  const isFinalPaymentEligible =
    isFinalStage && (team.status === "verified" || team.status === "paid");
  const hasFinalInvoice = !!finalPayment?.invoice && !!finalPayment?.order_id;
  const isFinalPaymentPaid = finalPayment?.status === "paid";
  const isFinalPaymentLocked =
    isFinalPaymentPaid ||
    (hasFinalInvoice && finalPayment?.status === "pending");
  const canDeleteFinalInvoice =
    !!finalPayment && finalPayment.status !== "paid";
  const hasParticipants = team.participants.length > 0;
  const getParticipantFinalChoice = (
    participant: any,
  ): FinalAccommodationChoice => {
    if (
      Object.prototype.hasOwnProperty.call(
        participantSelections,
        participant.id,
      )
    ) {
      return participantSelections[participant.id];
    }

    return participant.final_accommodation_type ?? null;
  };

  const finalPaymentSummary = useMemo(() => {
    const accommodationCount = team.participants.filter(
      (participant: any) => getParticipantFinalChoice(participant) === "accom",
    ).length;
    const nonAccommodationCount = team.participants.filter(
      (participant: any) =>
        getParticipantFinalChoice(participant) === "non_accom",
    ).length;
    const notAttendingCount =
      team.participants.length - accommodationCount - nonAccommodationCount;

    return {
      accommodationCount,
      nonAccommodationCount,
      notAttendingCount,
      accommodationSubtotal: accommodationCount * accommodationPrice,
      nonAccommodationSubtotal: nonAccommodationCount * nonAccommodationPrice,
      total:
        accommodationCount * accommodationPrice +
        nonAccommodationCount * nonAccommodationPrice,
    };
  }, [
    accommodationPrice,
    nonAccommodationPrice,
    participantSelections,
    team.participants,
  ]);

  const cityTourSelectedParticipants = team.participants.filter(
    (participant: any) => cityTourSelections[participant.id],
  );
  const cityTourFee = cityTourSelectedParticipants.reduce(
    (total: number, participant: any) =>
      getParticipantFinalChoice(participant) === "non_accom"
        ? total + 15000
        : total,
    0,
  );

  let registrationPrice = 0;
  let registrationPriceUSD = 0;

  if (priceData?.data) {
    if (team.is_international) {
      registrationPriceUSD = priceData.data.total_usd || 0;
      registrationPrice = priceData.data.total_idr || 0;
    } else {
      registrationPrice = priceData.data.price || 0;
    }
  }

  let discountAmount = 0;
  if (voucherType === "percentage") {
    discountAmount = (registrationPrice * referralDiscount) / 100;
  } else {
    discountAmount = referralDiscount;
  }

  const finalRegistrationPrice = Math.max(
    0,
    registrationPrice - discountAmount,
  );
  const finalRegistrationPriceUSD = Math.max(
    0,
    registrationPriceUSD - discountAmount / 15000,
  );

  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 7);
  const deadline = team.deadline || defaultDeadline.toISOString();

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatPriceUSD = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  const handleCheckReferralCode = () => {
    if (!referralCodeInput.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    if (!team?.event_id) {
      toast.error("Event ID not found");
      return;
    }

    checkReferralCode(
      { code: referralCodeInput.trim(), eventId: team.event_id },
      {
        onSuccess: (response) => {
          if (response?.data?.valid && response?.data?.amount) {
            setAppliedReferralCode(referralCodeInput.trim());
            setReferralDiscount(response.data.amount);
            setVoucherType(response.data.type || "fixed");
            toast.success("Voucher code applied");
            return;
          }

          toast.error(response?.data?.message || "Invalid voucher code");
        },
        onError: () => {
          toast.error("Invalid voucher code");
        },
      },
    );
  };

  const handleRemoveReferralCode = () => {
    setAppliedReferralCode("");
    setReferralCodeInput("");
    setReferralDiscount(0);
    setVoucherType("fixed");
    toast.success("Voucher code removed");
  };

  const handleParticipantSelectionChange = (
    participantId: string,
    value: FinalAccommodationChoice,
  ) => {
    if (isFinalPaymentLocked) {
      if (isFinalPaymentPaid) {
        toast.error("Final payment paid. Choices cannot be changed.");
        return;
      }

      setShowDeleteInvoiceModal(true);
      return;
    }

    setParticipantSelections((prev) => ({
      ...prev,
      [participantId]: value,
    }));
    setShowFinalPaymentConfirm(false);
  };

  const handleCityTourSelect = (participantId: string) => {
    if (!isFinalPaymentPaid) {
      toast.error("City tour registration opens after final payment is paid.");
      return;
    }

    setCityTourSelections((prev) => ({
      ...prev,
      [participantId]: true,
    }));
  };

  const handleCityTourRemove = (participantId: string) => {
    if (!isFinalPaymentPaid) {
      toast.error("City tour registration opens after final payment is paid.");
      return;
    }

    setCityTourSelections((prev) => ({
      ...prev,
      [participantId]: false,
    }));
  };

  const handleRegisterCityTour = () => {
    if (!leader) {
      toast.error("Team leader data is required for city tour registration");
      return;
    }
    if (!isFinalPaymentPaid) {
      toast.error("Final payment must be paid before city tour registration");
      return;
    }
    if (cityTourSelectedParticipants.length === 0) {
      toast.error("Select at least one city tour attendee");
      return;
    }
    if (cityTourSelectedParticipants.some(hasUnknownGender)) {
      toast.error("Please set attendee gender in profile before city tour.");
      return;
    }

    registerCityTour(
      {
        name: leader.name,
        student_id: cityTourStudentID,
        university: team.university,
        attendee_participant_ids: cityTourSelectedParticipants.map(
          (participant: any) => participant.id,
        ),
        have_any_alergies: cityTourAllergies,
        any_song_request: cityTourSongRequest,
        is_replaced: false,
      },
      {
        onSuccess: (response) => {
          const invoiceURL = response?.data?.invoice_url;
          if (invoiceURL) {
            window.open(invoiceURL, "_blank");
          }
        },
      },
    );
  };

  const handleFinalizeFinalPayment = () => {
    if (!hasParticipants) {
      toast.error(
        "Team participants are required before creating final payment",
      );
      return;
    }

    if (!isFinalPaymentEligible) {
      toast.error(
        "Final invoice can only be generated after the team is verified for the final stage",
      );
      return;
    }

    if (isFinalPaymentLocked) {
      toast.error("Final payment selection is locked after invoice creation");
      return;
    }

    payCompetitionFinal(
      {
        payment_method: "QRIS",
        participants: team.participants.map((participant: any) => ({
          participant_id: participant.id,
          final_accommodation_type: getParticipantFinalChoice(participant),
        })),
      },
      {
        onSuccess: (response) => {
          if (response?.data?.invoice_url) {
            window.open(response.data.invoice_url, "_blank");
          }
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Failed to initiate final payment";

          if (errorMessage.includes("locked")) {
            toast.error(
              "Final invoice already exists, so accommodation choices can no longer be changed.",
            );
            return;
          }

          if (
            errorMessage.includes("only available") ||
            errorMessage.includes("can only be created")
          ) {
            toast.error(
              "Team must be verified or paid in the final stage before generating the final invoice.",
            );
            return;
          }

          toast.error(errorMessage);
        },
      },
    );
  };

  const handleCancelFinalInvoice = () => {
    if (!canDeleteFinalInvoice) {
      toast.error("Paid final invoices cannot be deleted");
      return;
    }

    cancelFinalInvoice(undefined, {
      onSuccess: () => {
        setShowFinalPaymentConfirm(false);
        setShowDeleteInvoiceModal(false);
      },
    });
  };

  const handleFinalizeRegistration = () => {
    if (
      team.status === "paid" ||
      team.status === "verified" ||
      team.status === "complete"
    ) {
      toast.error(
        "Payment has already been processed. Please refresh the page to see the latest status.",
      );
      return;
    }

    const paymentData: { payment_method?: string; referral_code?: string } =
      team.is_international
        ? { referral_code: appliedReferralCode || undefined }
        : {
            payment_method: "QRIS",
            referral_code: appliedReferralCode || undefined,
          };

    payCompetition(paymentData, {
      onSuccess: (response) => {
        if (response?.data?.invoice_url) {
          window.open(response.data.invoice_url, "_blank");
        }
      },
    });
  };

  const handleUploadPaymentProof = () => {
    if (!paymentProofFile) return;

    const formData = new FormData();
    formData.append("payment_proof", paymentProofFile);

    uploadPaymentProof(formData, {
      onSuccess: () => {
        setPaymentProofFile(null);
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
          Finalize & City Tour
        </Typography>
        <BreadcrumbGroup
          items={BREADCRUMBS}
          textColor="text-white"
          activeColor="text-white"
          separatorColor="text-white"
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <div className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-6">
          <Typography variant="h3" weight="bold" className="mb-4 text-gray-900">
            Activity Status
          </Typography>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatusCard
              label="Registration Status"
              value={team.status}
              active={team.status === "verified" || team.status === "complete"}
            />
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <Typography variant="p" className="mb-1 text-sm text-gray-700">
                Competition Stage
              </Typography>
              <Typography
                variant="h4"
                weight="bold"
                className="capitalize text-blue-600"
              >
                {team.stage}
              </Typography>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary-400 bg-gradient-to-br from-primary-500 to-primary-600 p-4 shadow-lg sm:p-8">
          <Typography
            variant="h3"
            weight="bold"
            className="mb-4 text-center text-white sm:mb-6"
          >
            COUNTDOWN
          </Typography>
          <Countdown deadline={deadline} variant="white" />
        </div>

        <TeamInformationCard
          title="Team Data Information"
          teamInfo={{
            teamName: team.team_name,
            email: team.email,
            institution: team.university,
            competition: team.event_name,
          }}
        />

        {leader ? (
          <MemberInformationCard
            title="Team Leader Information"
            member={leader}
            finalAccommodationSelection={
              isFinalStage ? (
                <FinalAccommodationSelector
                  value={getParticipantFinalChoice(leader)}
                  disabled={isFinalPaymentPaid}
                  locked={isFinalPaymentLocked && !isFinalPaymentPaid}
                  onChange={(value) =>
                    handleParticipantSelectionChange(leader.id, value)
                  }
                />
              ) : null
            }
          />
        ) : null}

        {members.map((member: any, index: number) => (
          <MemberInformationCard
            key={member.id}
            title={`Member ${index + 2} Information`}
            member={member}
            finalAccommodationSelection={
              isFinalStage ? (
                <FinalAccommodationSelector
                  value={getParticipantFinalChoice(member)}
                  disabled={isFinalPaymentPaid}
                  locked={isFinalPaymentLocked && !isFinalPaymentPaid}
                  onChange={(value) =>
                    handleParticipantSelectionChange(member.id, value)
                  }
                />
              ) : null
            }
          />
        ))}

        <div className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-6">
          <Typography variant="h3" weight="bold" className="mb-4 text-gray-900">
            Your Payment
          </Typography>

          {isFinalStage ? (
            <div className="space-y-4">
              <div>
                <Typography variant="p" className="mb-1 text-sm text-gray-600">
                  Final Payment Status
                </Typography>
                <Typography
                  variant="h4"
                  weight="bold"
                  className={cn(
                    "capitalize",
                    finalPayment?.status === "paid"
                      ? "text-green-600"
                      : "text-orange-600",
                  )}
                >
                  {finalPayment?.status || "pending"}
                </Typography>
              </div>

              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-sky-900"
                >
                  Final Stage Pricing Information
                </Typography>
                <div className="mt-3 space-y-2 text-sm text-sky-900">
                  <p>Accommodation: Rp675.000 / org</p>
                  <p>Hotel: MaxOne Hotel</p>
                  <p>Gala dinner: Graha Mahameru</p>
                  <p>Non Accom: Rp400.000 / org</p>
                </div>
                <Typography variant="p" className="mt-3 text-sm text-sky-800">
                  Existing participant data from production is defaulted to
                  <span className="font-semibold"> non accom</span>. You can
                  review each participant selection here and update it before
                  the first final invoice is created.
                </Typography>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <SummaryCard
                  title="Accommodation"
                  quantity={finalPaymentSummary.accommodationCount}
                  price={accommodationPrice}
                  subtotal={finalPaymentSummary.accommodationSubtotal}
                  formatter={formatPrice}
                />
                <SummaryCard
                  title="Non Accommodation"
                  quantity={finalPaymentSummary.nonAccommodationCount}
                  price={nonAccommodationPrice}
                  subtotal={finalPaymentSummary.nonAccommodationSubtotal}
                  formatter={formatPrice}
                />
                <SummaryCard
                  title="Not Attending"
                  quantity={finalPaymentSummary.notAttendingCount}
                  price={0}
                  subtotal={0}
                  formatter={formatPrice}
                />
              </div>

              <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <Typography variant="p" className="text-sm text-primary-700">
                  Grand Total
                </Typography>
                <Typography
                  variant="h3"
                  weight="bold"
                  className="mt-1 text-primary-700"
                >
                  {formatPrice(finalPaymentSummary.total)}
                </Typography>
                <Typography
                  variant="p"
                  className="mt-2 text-sm text-primary-700"
                >
                  One invoice will be created for the whole team.
                </Typography>
                {!isFinalPaymentEligible && !isFinalPaymentLocked ? (
                  <Typography
                    variant="p"
                    className="mt-2 text-sm text-blue-700"
                  >
                    Final invoice will be available after the team is verified
                    or marked paid for the final stage.
                  </Typography>
                ) : null}
                {isFinalPaymentLocked ? (
                  <Typography
                    variant="p"
                    className="mt-2 text-sm text-amber-700"
                  >
                    {isFinalPaymentPaid
                      ? "Final payment paid. Choices cannot be changed."
                      : "Invoice already generated. Delete invoice first to change choices."}
                  </Typography>
                ) : null}
              </div>

              {finalPayment?.invoice || canDeleteFinalInvoice ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {finalPayment?.invoice ? (
                    <Link href={finalPayment.invoice} target="_blank">
                      <div className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors hover:bg-gray-50 sm:px-6">
                        <Typography
                          variant="p"
                          weight="semibold"
                          className="text-sm text-orange-500 sm:text-base"
                        >
                          View Final Invoice
                        </Typography>
                        <ExternalLink className="text-orange-500" size={18} />
                      </div>
                    </Link>
                  ) : null}
                  {canDeleteFinalInvoice ? (
                    <button
                      type="button"
                      onClick={handleCancelFinalInvoice}
                      disabled={isCancelFinalInvoicePending}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                    >
                      <span className="text-sm sm:text-base">
                        {isCancelFinalInvoicePending
                          ? finalPayment?.invoice
                            ? "Deleting Invoice..."
                            : "Resetting Draft..."
                          : finalPayment?.invoice
                            ? "Delete Invoice"
                            : "Reset Final Payment Draft"}
                      </span>
                      <Trash2 size={18} />
                    </button>
                  ) : null}
                </div>
              ) : (
                <Typography
                  variant="p"
                  className="text-sm italic text-gray-600"
                >
                  Invoice will be generated after finalization.
                </Typography>
              )}
            </div>
          ) : (
            <RegistrationPaymentSection
              team={team}
              finalPrice={finalRegistrationPrice}
              finalPriceUSD={finalRegistrationPriceUSD}
              price={registrationPrice}
              priceUSD={registrationPriceUSD}
              discountAmount={discountAmount}
              referralDiscount={referralDiscount}
              voucherType={voucherType}
              referralCodeInput={referralCodeInput}
              appliedReferralCode={appliedReferralCode}
              isCheckingReferral={isCheckingReferral}
              isUploadingProof={isUploadingProof}
              paymentProofFile={paymentProofFile}
              formatPrice={formatPrice}
              formatPriceUSD={formatPriceUSD}
              setReferralCodeInput={setReferralCodeInput}
              setPaymentProofFile={setPaymentProofFile}
              handleCheckReferralCode={handleCheckReferralCode}
              handleRemoveReferralCode={handleRemoveReferralCode}
              handleUploadPaymentProof={handleUploadPaymentProof}
            />
          )}
        </div>

        {isFinalStage ? (
          <CityTourSection
            participants={team.participants}
            selectedParticipants={cityTourSelectedParticipants}
            selections={cityTourSelections}
            registration={cityTourRegistration}
            studentID={cityTourStudentID}
            allergies={cityTourAllergies}
            songRequest={cityTourSongRequest}
            fee={cityTourFee}
            isFinalPaymentPaid={isFinalPaymentPaid}
            isPending={isCityTourPending}
            getParticipantFinalChoice={getParticipantFinalChoice}
            formatPrice={formatPrice}
            setStudentID={setCityTourStudentID}
            setAllergies={setCityTourAllergies}
            setSongRequest={setCityTourSongRequest}
            onSelect={handleCityTourSelect}
            onRemove={handleCityTourRemove}
            onSubmit={handleRegisterCityTour}
          />
        ) : null}

        {isFinalStage ? (
          finalPayment?.status === "paid" ? (
            <ActionBanner color="green" text="Final Payment Paid" />
          ) : isFinalPaymentLocked ? (
            <ActionBanner color="blue" text="Final Invoice Generated" />
          ) : !isFinalPaymentEligible ? (
            <div className="space-y-3">
              <ActionBanner
                color="blue"
                text="Awaiting Final Verification Before Invoice Generation"
              />
              <Typography
                variant="p"
                className="text-center text-xs text-white sm:text-sm"
              >
                Accommodation choices are saved on this page, but the final
                invoice can only be generated after the team is verified or
                marked paid for the final stage.
              </Typography>
            </div>
          ) : showFinalPaymentConfirm ? (
            <div className="rounded-2xl border border-orange-200 bg-white/95 p-4 shadow-lg sm:p-6">
              <Typography variant="h3" weight="bold" className="text-gray-900">
                Confirm Final Invoice
              </Typography>
              <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <span className="font-semibold text-gray-900">
                    {finalPaymentSummary.accommodationCount} Accommodation
                  </span>{" "}
                  x {formatPrice(accommodationPrice)}
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <span className="font-semibold text-gray-900">
                    {finalPaymentSummary.nonAccommodationCount} Non
                    Accommodation
                  </span>{" "}
                  x {formatPrice(nonAccommodationPrice)}
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <span className="font-semibold text-gray-900">
                    {finalPaymentSummary.notAttendingCount} Not Attending
                  </span>{" "}
                  x {formatPrice(0)}
                </div>
              </div>
              <Typography
                variant="h3"
                weight="bold"
                className="mt-4 text-primary-700"
              >
                Total {formatPrice(finalPaymentSummary.total)}
              </Typography>
              <Typography variant="p" className="mt-2 text-sm text-amber-700">
                Choices will be locked after invoice creation. Delete the
                invoice first if you need to change accommodation selections.
              </Typography>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShowFinalPaymentConfirm(false)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Review Stay Options
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeFinalPayment}
                  disabled={isFinalPayPending || !hasParticipants}
                  className="rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isFinalPayPending
                    ? "Processing..."
                    : "Confirm & Generate Invoice"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowFinalPaymentConfirm(true)}
              disabled={isFinalPayPending || !hasParticipants}
              className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
            >
              <Typography
                variant="p"
                weight="bold"
                className="text-sm text-white sm:text-base"
              >
                {isFinalPayPending ? "Processing..." : "Generate Final Invoice"}
              </Typography>
            </button>
          )
        ) : team.status === "verified" || team.status === "complete" ? (
          <ActionBanner color="green" text="Verified & Paid" />
        ) : team.is_international ? (
          <div className="space-y-3">
            <ActionBanner
              color="blue"
              text="International Team - Upload PayPal Proof Above"
            />
            <Typography
              variant="p"
              className="text-center text-xs text-white sm:text-sm"
            >
              Your registration will be verified after admin confirms your
              PayPal payment
            </Typography>
          </div>
        ) : (
          <button
            onClick={handleFinalizeRegistration}
            disabled={isPayPending}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
          >
            <Typography
              variant="p"
              weight="bold"
              className="text-sm text-white sm:text-base"
            >
              {isPayPending ? "Processing..." : "Finalize & Pay"}
            </Typography>
          </button>
        )}
      </div>
      <Dialog
        open={showDeleteInvoiceModal}
        onOpenChange={setShowDeleteInvoiceModal}
      >
        <DialogContent className="bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle>Delete Final Invoice First</DialogTitle>
          </DialogHeader>
          <Typography variant="p" className="text-sm text-gray-600">
            A final invoice has already been generated. Delete the invoice first
            to change accommodation choices.
          </Typography>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setShowDeleteInvoiceModal(false)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            {finalPayment?.invoice ? (
              <Link
                href={finalPayment.invoice}
                target="_blank"
                className="rounded-xl border border-orange-300 bg-white px-4 py-3 text-center font-semibold text-orange-600 transition-colors hover:bg-orange-50"
              >
                View Invoice
              </Link>
            ) : null}
            <button
              type="button"
              onClick={handleCancelFinalInvoice}
              disabled={isCancelFinalInvoicePending}
              className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCancelFinalInvoicePending ? "Deleting..." : "Delete Invoice"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusCard({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        active ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50",
      )}
    >
      <Typography variant="p" className="mb-1 text-sm text-gray-700">
        {label}
      </Typography>
      <Typography
        variant="h4"
        weight="bold"
        className={cn("capitalize", active ? "text-green-600" : "text-red-600")}
      >
        {value}
      </Typography>
    </div>
  );
}

function SummaryCard({
  title,
  quantity,
  price,
  subtotal,
  formatter,
}: {
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
  formatter: (amount: number) => string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <Typography variant="p" className="text-sm text-gray-600">
        {title}
      </Typography>
      <Typography variant="h4" weight="bold" className="mt-1 text-gray-900">
        {quantity} x {formatter(price)}
      </Typography>
      <Typography variant="p" className="mt-2 text-sm text-gray-600">
        Subtotal:{" "}
        <span className="font-semibold text-gray-900">
          {formatter(subtotal)}
        </span>
      </Typography>
    </div>
  );
}

function getParticipantGenderLabel(participant: any) {
  const gender = (participant?.gender || "").toLowerCase();
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  return "Unknown";
}

function hasUnknownGender(participant: any) {
  return getParticipantGenderLabel(participant) === "Unknown";
}

function CityTourSection({
  participants,
  selectedParticipants,
  selections,
  registration,
  studentID,
  allergies,
  songRequest,
  fee,
  isFinalPaymentPaid,
  isPending,
  getParticipantFinalChoice,
  formatPrice,
  setStudentID,
  setAllergies,
  setSongRequest,
  onSelect,
  onRemove,
  onSubmit,
}: {
  participants: any[];
  selectedParticipants: any[];
  selections: Record<string, boolean>;
  registration?: any;
  studentID: string;
  allergies: string;
  songRequest: string;
  fee: number;
  isFinalPaymentPaid: boolean;
  isPending: boolean;
  getParticipantFinalChoice: (participant: any) => FinalAccommodationChoice;
  formatPrice: (amount: number) => string;
  setStudentID: (value: string) => void;
  setAllergies: (value: string) => void;
  setSongRequest: (value: string) => void;
  onSelect: (participantId: string) => void;
  onRemove: (participantId: string) => void;
  onSubmit: () => void;
}) {
  const freeCount = selectedParticipants.filter(
    (participant) => getParticipantFinalChoice(participant) === "accom",
  ).length;
  const paidCount = selectedParticipants.filter(
    (participant) => getParticipantFinalChoice(participant) === "non_accom",
  ).length;
  const availableParticipants = participants.filter(
    (participant) => !selections[participant.id],
  );
  const hasSelectedUnknownGender = selectedParticipants.some(hasUnknownGender);

  return (
    <div className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Typography variant="h3" weight="bold" className="text-gray-900">
            City Tour Registration
          </Typography>
          <Typography variant="p" className="mt-1 text-sm text-gray-600">
            Optional for finalists after final payment is paid. Accommodation
            participants are free, non accommodation participants pay Rp15.000.
          </Typography>
        </div>
        <Badge variant={registration ? "success" : "secondary"}>
          {registration ? "Registered" : "Optional"}
        </Badge>
      </div>

      {registration ? (
        <div className="mt-5 space-y-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <Typography variant="p" weight="semibold" className="text-green-800">
            City tour registration submitted
          </Typography>
          <div className="grid gap-3 text-sm text-green-900 sm:grid-cols-3">
            <span>{registration.attending_member} attendees</span>
            <span>Total {formatPrice(registration.total_fee ?? 0)}</span>
            <span className="capitalize">
              Payment {registration.payment_status || "paid"}
            </span>
          </div>
          {registration.invoice_url ? (
            <Link href={registration.invoice_url} target="_blank">
              <Button variant="ghost" size="sm" className="!text-sm">
                View City Tour Invoice
              </Button>
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <Typography variant="p" weight="semibold" className="text-sky-900">
              City Tour Rundown
            </Typography>
            <div className="mt-3 grid gap-2 text-sm text-sky-900 sm:grid-cols-2">
              {[
                "07.30 - 08.30 Preparation at the Hotel",
                "08.30 - 09.00 Delegates preparation",
                "09.00 - 09.45 OTW to Museum Siola and Jalan Tunjungan",
                "09.45 - 11.00 Explore Museum Siola",
                "11.00 - 13.45 Explore Jalan Tunjungan",
                "13.45 - 14.00 Delegates preparation",
                "14.00 - 14.45 OTW to the Hotel",
                "14.45 - 15.00 Closing City Tour",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <Typography variant="p" className="mt-3 text-sm text-sky-800">
              Maximum quota: 80 attendees.
            </Typography>
          </div>

          {!isFinalPaymentPaid ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
              City tour registration opens after final payment is paid.
            </div>
          ) : null}

          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Select City Tour Attendees
              </label>
              <Select
                key={selectedParticipants.length}
                disabled={
                  !isFinalPaymentPaid || availableParticipants.length === 0
                }
                onValueChange={onSelect}
              >
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue
                    placeholder={
                      availableParticipants.length === 0
                        ? "All team members selected"
                        : "Choose team member"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableParticipants.map((participant) => {
                    const choice = getParticipantFinalChoice(participant);
                    const genderLabel = getParticipantGenderLabel(participant);
                    const feeLabel =
                      choice === "non_accom" ? formatPrice(15000) : "Free";

                    return (
                      <SelectItem key={participant.id} value={participant.id}>
                        {participant.name} - {genderLabel} -{" "}
                        {choice?.replace("_", " ") || "not selected"} -{" "}
                        {feeLabel}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedParticipants.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedParticipants.map((participant) => {
                  const choice = getParticipantFinalChoice(participant);
                  const genderLabel = getParticipantGenderLabel(participant);
                  const feeLabel =
                    choice === "non_accom" ? formatPrice(15000) : "Free";

                  return (
                    <div
                      key={participant.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4"
                    >
                      <span>
                        <span className="block font-semibold text-gray-900">
                          {participant.name}
                        </span>
                        <span className="block text-sm text-gray-600">
                          {genderLabel} -{" "}
                          {choice?.replace("_", " ") || "not selected"} -{" "}
                          {feeLabel}
                        </span>
                        {genderLabel === "Unknown" ? (
                          <span className="mt-2 block text-sm font-medium text-red-600">
                            Please set gender in profile before city tour.
                          </span>
                        ) : null}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={!isFinalPaymentPaid}
                        onClick={() => onRemove(participant.id)}
                        aria-label={`Remove ${participant.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm font-medium text-gray-500">
                No attendee selected yet.
              </div>
            )}
          </div>

          {hasSelectedUnknownGender ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              Please set gender in{" "}
              <Link
                href="/competition/dashboard/profile"
                className="font-semibold underline"
              >
                profile
              </Link>{" "}
              before city tour.
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                PIC Student ID
              </label>
              <input
                value={studentID}
                onChange={(event) => setStudentID(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Student ID / NRP"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Allergies
              </label>
              <input
                value={allergies}
                onChange={(event) => setAllergies(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="None / details"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Song Request
              </label>
              <input
                value={songRequest}
                onChange={(event) => setSongRequest(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
            <div className="grid gap-3 text-sm text-primary-800 sm:grid-cols-3">
              <span>{selectedParticipants.length} selected</span>
              <span>{freeCount} free accom attendees</span>
              <span>{paidCount} paid non-accom attendees</span>
            </div>
            <Typography
              variant="h3"
              weight="bold"
              className="mt-3 text-primary-700"
            >
              City Tour Fee {formatPrice(fee)}
            </Typography>
          </div>

          <Button
            type="button"
            disabled={
              !isFinalPaymentPaid || isPending || hasSelectedUnknownGender
            }
            onClick={onSubmit}
          >
            {isPending ? "Submitting..." : "Submit City Tour Registration"}
          </Button>
        </div>
      )}
    </div>
  );
}

function ActionBanner({
  color,
  text,
}: {
  color: "green" | "blue";
  text: string;
}) {
  const classes = color === "green" ? "bg-green-500" : "bg-blue-500";

  return (
    <div
      className={cn(
        "w-full rounded-xl px-4 py-3 text-center font-semibold text-white shadow-md sm:px-6",
        classes,
      )}
    >
      <Typography
        variant="p"
        weight="bold"
        className="text-sm text-white sm:text-base"
      >
        {text}
      </Typography>
    </div>
  );
}

function RegistrationPaymentSection({
  team,
  finalPrice,
  finalPriceUSD,
  price,
  priceUSD,
  discountAmount,
  referralDiscount,
  voucherType,
  referralCodeInput,
  appliedReferralCode,
  isCheckingReferral,
  isUploadingProof,
  paymentProofFile,
  formatPrice,
  formatPriceUSD,
  setReferralCodeInput,
  setPaymentProofFile,
  handleCheckReferralCode,
  handleRemoveReferralCode,
  handleUploadPaymentProof,
}: {
  team: any;
  finalPrice: number;
  finalPriceUSD: number;
  price: number;
  priceUSD: number;
  discountAmount: number;
  referralDiscount: number;
  voucherType: "percentage" | "fixed";
  referralCodeInput: string;
  appliedReferralCode: string;
  isCheckingReferral: boolean;
  isUploadingProof: boolean;
  paymentProofFile: File | null;
  formatPrice: (amount: number) => string;
  formatPriceUSD: (amount: number) => string;
  setReferralCodeInput: (value: string) => void;
  setPaymentProofFile: (value: File | null) => void;
  handleCheckReferralCode: () => void;
  handleRemoveReferralCode: () => void;
  handleUploadPaymentProof: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Typography variant="p" className="mb-1 text-sm text-gray-600">
          Registration Payment
        </Typography>
        <Typography
          variant="h4"
          weight="bold"
          className={cn(
            "capitalize",
            team.status === "verified" || team.status === "complete"
              ? "text-green-600"
              : "text-red-600",
          )}
        >
          {team.status === "verified" || team.status === "complete"
            ? "Paid"
            : "Unpaid"}
        </Typography>
      </div>

      <Collapsible>
        <div>
          <Typography variant="p" className="mb-1 text-sm text-gray-600">
            Total Amount
          </Typography>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <Typography
                variant="h4"
                weight="bold"
                className="break-all text-primary-600"
              >
                {team.is_international
                  ? formatPriceUSD(finalPriceUSD)
                  : formatPrice(finalPrice)}
              </Typography>
              {team.is_international ? (
                <Typography variant="p" className="text-sm text-gray-500">
                  ≈ {formatPrice(finalPrice)}
                </Typography>
              ) : null}
              {referralDiscount > 0 ? (
                <div className="mt-1">
                  <Typography
                    variant="p"
                    className="text-sm text-gray-500 line-through"
                  >
                    {team.is_international
                      ? formatPriceUSD(priceUSD)
                      : formatPrice(price)}
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-sm font-semibold text-green-600"
                  >
                    Discount:{" "}
                    {voucherType === "percentage"
                      ? `${referralDiscount}% (${formatPrice(discountAmount)})`
                      : formatPrice(discountAmount)}
                  </Typography>
                </div>
              ) : null}
            </div>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 whitespace-nowrap text-sm text-gray-600 hover:text-gray-900">
                <span>View Details</span>
                <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="mt-4 space-y-3 border-t pt-3">
          <div>
            <Typography variant="p" className="mb-1 text-sm text-gray-600">
              Competition
            </Typography>
            <Typography variant="p" weight="medium" className="text-gray-900">
              {team.event_name}
            </Typography>
          </div>

          {team.is_international ? (
            <>
              <DetailRow label="Payment Type" value="International (PayPal)" />
              {team.event_id ? (
                <>
                  <DetailRow label="Base Price" value={formatPrice(price)} />
                  <DetailRow
                    label="Exchange Rate"
                    value={`1 USD = ${formatPrice(Math.round(price / Math.max(priceUSD || 1, 1)))}`}
                  />
                </>
              ) : null}
            </>
          ) : (
            <>
              <DetailRow label="Base Price" value={formatPrice(price)} />
              <DetailRow label="Payment Type" value="Domestic (QRIS)" />
            </>
          )}
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-6 space-y-3">
        <Typography variant="p" weight="semibold" className="text-gray-900">
          Voucher Code (Optional)
        </Typography>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={referralCodeInput}
            onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
            placeholder="Enter voucher code"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            disabled={!!appliedReferralCode}
          />
          {!appliedReferralCode ? (
            <button
              onClick={handleCheckReferralCode}
              disabled={!referralCodeInput.trim() || isCheckingReferral}
              className="whitespace-nowrap rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCheckingReferral ? "Checking..." : "Apply Code"}
            </button>
          ) : (
            <button
              onClick={handleRemoveReferralCode}
              className="whitespace-nowrap rounded-xl bg-red-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-red-600"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {team.registration_invoice ? (
        <Link href={team.registration_invoice} target="_blank">
          <div className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors hover:bg-gray-50 sm:px-6">
            <Typography
              variant="p"
              weight="semibold"
              className="text-sm text-orange-500 sm:text-base"
            >
              View Registration Invoice
            </Typography>
            <ExternalLink className="text-orange-500" size={18} />
          </div>
        </Link>
      ) : null}

      {team.is_international ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <Typography
              variant="p"
              weight="semibold"
              className="mb-2 text-blue-900"
            >
              International Payment Instructions
            </Typography>
            <Typography variant="p" className="text-sm text-blue-800">
              Please send payment via PayPal to{" "}
              <a
                href="https://paypal.me/kafanalkafi"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-blue-600"
              >
                paypal.me/kafanalkafi
              </a>
              . After payment, upload your PayPal transaction screenshot below.
            </Typography>
          </div>

          {team.payment_proof ? (
            <Link href={team.payment_proof} target="_blank">
              <div className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors hover:bg-gray-50 sm:px-6">
                <Eye className="text-primary-600" size={18} />
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-sm text-primary-600 sm:text-base"
                >
                  View Uploaded Proof
                </Typography>
              </div>
            </Link>
          ) : (
            <div className="space-y-3">
              <Typography
                variant="p"
                weight="semibold"
                className="text-gray-900"
              >
                Upload PayPal Payment Proof{" "}
                <span className="text-red-500">*</span>
              </Typography>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPaymentProofFile(file);
                    }
                  }}
                  className="hidden"
                  id="payment-proof-upload"
                />
                <div
                  className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-4 text-center transition-all hover:border-primary-400 hover:bg-primary-50/50 sm:p-8"
                  onClick={() =>
                    document.getElementById("payment-proof-upload")?.click()
                  }
                >
                  <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400 sm:h-10 sm:w-10" />
                  <Typography
                    variant="p"
                    className="break-all text-sm text-gray-600 sm:text-base"
                  >
                    {paymentProofFile
                      ? paymentProofFile.name
                      : "Click to upload PayPal screenshot (JPG or PNG)"}
                  </Typography>
                </div>
              </label>
              {paymentProofFile ? (
                <button
                  onClick={handleUploadPaymentProof}
                  disabled={isUploadingProof}
                  className="w-full rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Typography variant="p" weight="bold" className="text-white">
                    {isUploadingProof ? "Uploading..." : "Upload Payment Proof"}
                  </Typography>
                </button>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Typography variant="p" className="mb-1 text-sm text-gray-600">
        {label}
      </Typography>
      <Typography variant="p" weight="medium" className="text-gray-900">
        {value}
      </Typography>
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
  };
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-2xl border border-primary-400 bg-primary-500 shadow-lg">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 sm:p-6">
          <Typography
            variant="h3"
            weight="bold"
            className="text-base text-white sm:text-xl"
          >
            {title}
          </Typography>
          <ChevronDown
            className={cn(
              "flex-shrink-0 text-white transition-all duration-200",
              !isOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-primary-400/20 bg-white/95 p-4 backdrop-blur-sm sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem label="Email" value={teamInfo.email} breakAll />
              <InfoItem label="Team Name" value={teamInfo.teamName} />
              <InfoItem
                label="University/Institution"
                value={teamInfo.institution}
              />
              <InfoItem label="Competition" value={teamInfo.competition} />
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
  finalAccommodationSelection,
}: {
  title: string;
  member: any;
  finalAccommodationSelection?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-2xl border border-primary-400 bg-primary-500 shadow-lg">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 sm:p-6">
          <Typography
            variant="h3"
            weight="bold"
            className="text-base text-white sm:text-xl"
          >
            {title}
          </Typography>
          <ChevronDown
            className={cn(
              "flex-shrink-0 text-white transition-all duration-200",
              !isOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-primary-400/20 bg-white/95 p-4 backdrop-blur-sm sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem label="Full Name" value={member.name} />
              <InfoItem
                label="Gender"
                value={getParticipantGenderLabel(member)}
              />
              <InfoItem label="Major" value={member.major} />
              <InfoItem label="Batch" value={member.batch} />
              <InfoItem label="Email" value={member.email} breakAll />
              <InfoItem
                label="Whatsapp Number"
                value={member.phone_number}
                breakAll
              />
            </div>

            {finalAccommodationSelection ? (
              <div className="mt-6 border-t pt-6">
                {finalAccommodationSelection}
              </div>
            ) : null}

            <div className="mt-6">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <ParticipantAsset
                  href={member.student_id_card}
                  label="Student ID Card"
                />
                <ParticipantAsset
                  href={member.story_ig}
                  label="Proof of Instagram Story"
                />
                <ParticipantAsset
                  href={member.twibbon_ig}
                  label="Proof of Twibbon"
                />
                <ParticipantAsset
                  href={member.follow_ig}
                  label="Proof of Following Instagram"
                />
                <ParticipantAsset
                  href={member.follow_linkedin}
                  label="Proof of Following LinkedIn"
                />
                <ParticipantAsset
                  href={member.follow_tiktok}
                  label="Proof of Following TikTok"
                />
                <ParticipantAsset
                  href={member.repost_competition_ig}
                  label="Proof of Repost Competition Instagram"
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function InfoItem({
  label,
  value,
  breakAll,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div>
      <Typography variant="p" className="text-sm text-gray-600">
        {label}
      </Typography>
      <Typography
        variant="p"
        weight="medium"
        className={cn(
          breakAll
            ? "break-all overflow-wrap-anywhere"
            : "break-words overflow-wrap-anywhere",
        )}
      >
        {value}
      </Typography>
    </div>
  );
}

function ParticipantAsset({
  href,
  label,
}: {
  href?: string;
  label: string;
}) {
  if (!href) return null;

  return (
    <div className="space-y-2">
      <Typography variant="p" weight="semibold" className="text-gray-900">
        {label}
      </Typography>
      <Link href={href} target="_blank">
        <div className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-gray-100 py-3 transition-all duration-200 hover:bg-gray-200">
          <Eye className="text-gray-700" />
          <Typography variant="p" weight="semibold" className="text-gray-700">
            View file
          </Typography>
        </div>
      </Link>
    </div>
  );
}

function FinalAccommodationSelector({
  value,
  disabled,
  locked,
  onChange,
}: {
  value: FinalAccommodationChoice;
  disabled: boolean;
  locked: boolean;
  onChange: (value: FinalAccommodationChoice) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Typography variant="p" className="text-sm text-gray-600">
          Final Stage Stay Option
        </Typography>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <SelectionButton
          title="Accom"
          description="Accommodation + hotel + gala dinner"
          active={value === "accom"}
          disabled={disabled}
          locked={locked}
          onClick={() => onChange("accom")}
        />
        <SelectionButton
          title="Non Accom"
          description="No accommodation package"
          active={value === "non_accom"}
          disabled={disabled}
          locked={locked}
          onClick={() => onChange("non_accom")}
        />
        <SelectionButton
          title="Not Attending"
          description="Participant will not be charged"
          active={value === null}
          disabled={disabled}
          locked={locked}
          onClick={() => onChange(null)}
        />
      </div>
    </div>
  );
}

function SelectionButton({
  title,
  description,
  active,
  disabled,
  locked,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  disabled: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={locked}
      className={cn(
        "rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-gray-300 bg-white text-gray-700 hover:border-primary-300",
        locked && "cursor-not-allowed opacity-70 hover:border-gray-300",
      )}
    >
      <Typography variant="p" weight="semibold">
        {title}
      </Typography>
      <Typography variant="p" className="mt-1 text-sm">
        {description}
      </Typography>
    </button>
  );
}
