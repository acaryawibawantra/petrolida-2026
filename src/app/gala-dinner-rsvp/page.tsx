"use client";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetAllCompetitionNames } from "@/hooks/use-competition";
import { useCreateGalaDinnerRsvp } from "@/hooks/use-gala-dinner-rsvp";
import { useGetDivision } from "@/hooks/use-master-data";
import {
  GALA_DINNER_COMPETITION_OPTIONS,
  buildGalaDinnerCompetitionOptions,
} from "@/lib/gala-dinner-competition-options";
import {
  type GalaDinnerRsvpForm,
  GalaDinnerRsvpSchema,
} from "@/validation/gala-dinner-rsvp";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const categories = [
  { label: "Delegates", value: "delegates" },
  { label: "Petrolida", value: "petrolida" },
  { label: "SPE", value: "spe" },
  { label: "Lovol", value: "lovol" },
] as const;

const totalSteps = 4;

export default function GalaDinnerRsvpPage() {
  const {
    mutate: submitRsvp,
    isPending,
    isSuccess,
    reset: resetSubmitState,
  } = useCreateGalaDinnerRsvp();
  const { subdivisions } = useGetDivision();
  const { data: competitionNamesData, isError: isCompetitionNamesError } =
    useGetAllCompetitionNames();
  const [page, setPage] = useState(0);

  const form = useForm<GalaDinnerRsvpForm>({
    resolver: zodResolver(GalaDinnerRsvpSchema),
    mode: "onChange",
    defaultValues: {
      category: undefined,
      full_name: "",
      institution_or_university: "",
      competition: "",
      team_name: "",
      attendance_confirmation: "attend",
      petrolida_role: "",
      petrolida_division: "",
      spe_role: "",
    },
  });

  const category = form.watch("category");
  const petrolidaRole = form.watch("petrolida_role");
  const attendance = form.watch("attendance_confirmation");

  useEffect(() => {
    form.setValue("institution_or_university", "");
    form.setValue("competition", "");
    form.setValue("team_name", "");
    form.setValue("petrolida_role", "");
    form.setValue("petrolida_division", "");
    form.setValue("spe_role", "");
  }, [category, form]);

  useEffect(() => {
    if (petrolidaRole !== "HoD") {
      form.setValue("petrolida_division", "");
    }
  }, [petrolidaRole, form]);

  const selectedCategoryLabel = useMemo(
    () => categories.find((item) => item.value === category)?.label || "-",
    [category],
  );
  const competitionOptions = useMemo(
    () =>
      competitionNamesData?.data
        ? buildGalaDinnerCompetitionOptions(competitionNamesData.data)
        : isCompetitionNamesError
          ? GALA_DINNER_COMPETITION_OPTIONS
          : [],
    [competitionNamesData?.data, isCompetitionNamesError],
  );

  const stepTitle = useMemo(() => {
    if (page === 0) return "Choose Participant Type";
    if (page === 1) return "Attendance Information";
    if (page === 2) {
      return category === "lovol" ? "No Extra Details" : "Participant Details";
    }
    return "Review RSVP";
  }, [category, page]);

  const validateCurrentStep = useCallback(() => {
    form.clearErrors();

    if (page === 0) {
      if (!category) {
        form.setError("category", {
          type: "manual",
          message: "Please choose participant type",
        });
        return false;
      }

      return true;
    }

    if (page === 1) {
      let valid = true;

      if (!form.getValues("full_name")?.trim()) {
        form.setError("full_name", {
          type: "manual",
          message: "Full name is required",
        });
        valid = false;
      }

      if (!form.getValues("attendance_confirmation")) {
        form.setError("attendance_confirmation", {
          type: "manual",
          message: "Attendance confirmation is required",
        });
        valid = false;
      }

      return valid;
    }

    if (page === 2) {
      let valid = true;

      if (category === "delegates") {
        if (!form.getValues("institution_or_university")?.trim()) {
          form.setError("institution_or_university", {
            type: "manual",
            message: "Required for delegates",
          });
          valid = false;
        }

        if (!form.getValues("competition")?.trim()) {
          form.setError("competition", {
            type: "manual",
            message: "Required for delegates",
          });
          valid = false;
        }

        if (!form.getValues("team_name")?.trim()) {
          form.setError("team_name", {
            type: "manual",
            message: "Required for delegates",
          });
          valid = false;
        }
      }

      if (category === "petrolida") {
        if (!form.getValues("petrolida_role")?.trim()) {
          form.setError("petrolida_role", {
            type: "manual",
            message: "Petrolida role is required",
          });
          valid = false;
        }

        if (
          form.getValues("petrolida_role") === "HoD" &&
          !form.getValues("petrolida_division")?.trim()
        ) {
          form.setError("petrolida_division", {
            type: "manual",
            message: "Division is required for HoD",
          });
          valid = false;
        }
      }

      if (category === "spe" && !form.getValues("spe_role")?.trim()) {
        form.setError("spe_role", {
          type: "manual",
          message: "SPE role is required",
        });
        valid = false;
      }

      return valid;
    }

    return true;
  }, [category, form, page]);

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    setPage((currentPage) => Math.min(currentPage + 1, totalSteps - 1));
  };

  const onSubmit = (values: GalaDinnerRsvpForm) => {
    submitRsvp(values, {
      onSuccess: () => {
        form.reset({
          category: undefined,
          full_name: "",
          institution_or_university: "",
          competition: "",
          team_name: "",
          attendance_confirmation: "attend",
          petrolida_role: "",
          petrolida_division: "",
          spe_role: "",
        });
        setPage(0);
      },
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="grid h-full grid-cols-1 lg:grid-cols-2 lg:overflow-hidden">
        <div className="col-span-1 overflow-hidden lg:h-screen">
          <NextImage
            src={"/oprec-staff/oprec-bg-desktop.png"}
            width={720}
            height={1024}
            imgClassName="h-full w-full object-cover"
            className="hidden w-full lg:block lg:h-screen"
            alt="Gala Dinner RSVP Desktop"
            priority
            quality={100}
          />
          <NextImage
            src={"/oprec-staff/oprec-bg-mobile.png"}
            width={500}
            height={312}
            imgClassName="h-full w-full object-cover"
            className="block w-full max-lg:h-[500px] max-md:!h-[312px] lg:hidden"
            alt="Gala Dinner RSVP Mobile"
            priority
            quality={100}
          />
        </div>

        <div className="relative col-span-1">
          <div className="relative lg:h-screen lg:overflow-y-scroll">
            <div className="flex min-h-screen flex-col gap-8 px-6 py-10 pb-24 md:px-10 lg:min-h-0">
              <div className="space-y-3">
                <Typography
                  variant="h1"
                  weight="bold"
                  className="text-[#225767]"
                >
                  Gala Dinner RSVP
                </Typography>
                <Typography variant="p" className="text-gray-600">
                  Please confirm your attendance for Petrolida 2026 Gala Dinner.
                </Typography>
              </div>

              {isSuccess ? (
                <div className="flex flex-1 flex-col justify-center gap-5 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
                  <CheckCircle2 className="h-10 w-10" />
                  <div>
                    <Typography variant="h3" weight="bold">
                      RSVP submitted
                    </Typography>
                    <p className="mt-2 text-sm font-medium">
                      Thank you. Your response has been recorded.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="success"
                    className="self-start"
                    onClick={resetSubmitState}
                  >
                    Submit Another RSVP
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex w-full justify-between gap-5 max-md:flex-col">
                    <div className="flex flex-col">
                      <p className="text-xl font-semibold text-[#7A7A7A]">
                        Step: {page + 1} of {totalSteps}
                      </p>
                      <p className="text-xl font-bold text-[#225767]">
                        {stepTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 md:w-1/2">
                      <Progress value={(page / (totalSteps - 1)) * 100} />
                      <p className="text-xl font-semibold text-[#7A7A7A]">
                        {Math.round((page / (totalSteps - 1)) * 100)}%
                      </p>
                    </div>
                  </div>
                  <Separator />

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {page === 0 ? (
                        <div className="space-y-4">
                          <p className="text-sm font-medium text-gray-600">
                            Select which group you are representing.
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {categories.map((item) => (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => {
                                  form.setValue("category", item.value, {
                                    shouldDirty: true,
                                    shouldValidate: false,
                                  });
                                  form.clearErrors("category");
                                }}
                                className={`rounded-lg border px-4 py-5 text-left text-base font-semibold transition-colors ${
                                  category === item.value
                                    ? "border-[#225767] bg-[#225767] text-white"
                                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                          <FieldError
                            message={form.formState.errors.category?.message}
                          />
                        </div>
                      ) : null}

                      {page === 1 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TextField
                            label="Full Name"
                            error={form.formState.errors.full_name?.message}
                            {...form.register("full_name")}
                          />
                          <Controller
                            control={form.control}
                            name="attendance_confirmation"
                            render={({ field }) => (
                              <SelectField
                                label="Attendance Confirmation"
                                value={field.value}
                                onChange={field.onChange}
                                options={[
                                  { label: "Attend", value: "attend" },
                                  {
                                    label: "Unable to Attend",
                                    value: "unable_to_attend",
                                  },
                                ]}
                                error={
                                  form.formState.errors.attendance_confirmation
                                    ?.message
                                }
                              />
                            )}
                          />
                        </div>
                      ) : null}

                      {page === 2 ? (
                        <>
                          {category === "delegates" ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                              <TextField
                                label="Institution or University"
                                error={
                                  form.formState.errors
                                    .institution_or_university?.message
                                }
                                {...form.register("institution_or_university")}
                              />
                              <Controller
                                control={form.control}
                                name="competition"
                                render={({ field }) => (
                                  <SelectField
                                    label="Competition"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    options={competitionOptions}
                                    error={
                                      form.formState.errors.competition?.message
                                    }
                                  />
                                )}
                              />
                              <TextField
                                label="Team Name"
                                error={form.formState.errors.team_name?.message}
                                {...form.register("team_name")}
                              />
                            </div>
                          ) : null}

                          {category === "petrolida" ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Controller
                                control={form.control}
                                name="petrolida_role"
                                render={({ field }) => (
                                  <SelectField
                                    label="Role"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    options={[
                                      { label: "BoE", value: "BoE" },
                                      { label: "BoD", value: "BoD" },
                                      { label: "HoD", value: "HoD" },
                                    ]}
                                    error={
                                      form.formState.errors.petrolida_role
                                        ?.message
                                    }
                                  />
                                )}
                              />
                              {petrolidaRole === "HoD" ? (
                                <Controller
                                  control={form.control}
                                  name="petrolida_division"
                                  render={({ field }) => (
                                    <SelectField
                                      label="Division"
                                      value={field.value || ""}
                                      onChange={field.onChange}
                                      options={subdivisions.map((division) => ({
                                        label: division.name,
                                        value: division.name,
                                      }))}
                                      error={
                                        form.formState.errors.petrolida_division
                                          ?.message
                                      }
                                    />
                                  )}
                                />
                              ) : null}
                            </div>
                          ) : null}

                          {category === "spe" ? (
                            <Controller
                              control={form.control}
                              name="spe_role"
                              render={({ field }) => (
                                <SelectField
                                  label="SPE Role"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  options={[
                                    { label: "BoE", value: "BoE" },
                                    { label: "BoD", value: "BoD" },
                                  ]}
                                  error={
                                    form.formState.errors.spe_role?.message
                                  }
                                />
                              )}
                            />
                          ) : null}

                          {category === "lovol" ? (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                              <p className="text-sm font-medium text-gray-600">
                                Lovol RSVP does not need additional details.
                                Continue to review your response.
                              </p>
                            </div>
                          ) : null}
                        </>
                      ) : null}

                      {page === 3 ? (
                        <div className="space-y-4">
                          <ReviewItem
                            label="Participant Type"
                            value={selectedCategoryLabel}
                          />
                          <ReviewItem
                            label="Full Name"
                            value={form.getValues("full_name")}
                          />
                          <ReviewItem
                            label="Attendance"
                            value={
                              attendance === "attend"
                                ? "Attend"
                                : "Unable to Attend"
                            }
                          />
                          {category === "delegates" ? (
                            <>
                              <ReviewItem
                                label="Institution or University"
                                value={form.getValues(
                                  "institution_or_university",
                                )}
                              />
                              <ReviewItem
                                label="Competition"
                                value={form.getValues("competition")}
                              />
                              <ReviewItem
                                label="Team Name"
                                value={form.getValues("team_name")}
                              />
                            </>
                          ) : null}
                          {category === "petrolida" ? (
                            <>
                              <ReviewItem
                                label="Role"
                                value={form.getValues("petrolida_role")}
                              />
                              {form.getValues("petrolida_role") === "HoD" ? (
                                <ReviewItem
                                  label="Division"
                                  value={form.getValues("petrolida_division")}
                                />
                              ) : null}
                            </>
                          ) : null}
                          {category === "spe" ? (
                            <ReviewItem
                              label="SPE Role"
                              value={form.getValues("spe_role")}
                            />
                          ) : null}
                        </div>
                      ) : null}

                      <div className="flex justify-between gap-3 pt-2">
                        {page !== 0 ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPage((current) => current - 1)}
                            leftIcon={ArrowLeft}
                          >
                            Back
                          </Button>
                        ) : (
                          <div />
                        )}
                        {page !== totalSteps - 1 ? (
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            rightIcon={ArrowRight}
                          >
                            Go to Next Section
                          </Button>
                        ) : (
                          <Button type="submit" disabled={isPending}>
                            {isPending ? "Submitting..." : "Submit RSVP"}
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TextField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...props} />
      <FieldError message={error} />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError message={error} />
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#225767]">
        {value || "-"}
      </p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-red-600">{message}</p>;
}
