"use client";

import UploadFile from "@/app/competition/register/form/_components/upload-file";
import Button from "@/components/buttons/button";
import WholeLoadingPage from "@/components/loading/whole-loading";
import NextImage from "@/components/next-image";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePetrovisRegistration } from "@/hooks/use-petrovis-registration";
import {
  CircleDollarSign,
  FileBadge2,
  NotebookPen,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";

type SectionCardProps = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
};

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-[#D7E4E8] bg-white p-5 shadow-[0_18px_50px_rgba(30,68,81,0.08)] md:p-7">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-[#E7F2F5] p-3">
          <Icon className="h-5 w-5 text-[#2E6673]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#17333B]">{title}</h2>
          <p className="text-sm leading-6 text-[#6C8188]">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function PetrovisRegisterFormPage() {
  const { onSubmit, form, speList, isLoadingSPE, isPending } =
    usePetrovisRegistration();
  const [showVoucherCode, setShowVoucherCode] = useState(false);
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const deadline = new Date("2026-04-06T23:59:59+07:00");
    const now = new Date();

    if (now >= deadline) {
      setIsRegistrationClosed(true);
      router.push("/petrovis/register");
    }
  }, [router]);

  if (isRegistrationClosed) {
    return null;
  }

  return (
    <section className="grid min-h-screen bg-[#F4F8F9] lg:grid-cols-2">
      <div className="col-span-1 overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        <div className="relative h-full">
          <NextImage
            src={"/petrovis/form-background.svg"}
            width={720}
            height={1024}
            imgClassName="h-full w-full object-cover"
            className="hidden h-full w-full lg:block"
            alt="Hero Desktop"
            priority
            quality={100}
          />

          <NextImage
            src={"/petrovis/form-background.svg"}
            width={500}
            height={312}
            imgClassName="h-full w-full object-cover"
            className="block w-full max-md:!h-[302px] max-lg:h-[320px] lg:hidden"
            alt="Hero Mobile"
            priority
            quality={100}
          />

          <div className="absolute inset-0 hidden bg-gradient-to-t from-[#17333B]/80 via-[#17333B]/20 to-transparent lg:block" />
          <div className="absolute bottom-0 hidden w-full p-8 text-white lg:block xl:p-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#D3E8EE]">
              PetroVis 2026
            </p>
            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Complete your registration in one tidy step.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#E5F3F6]">
              Fill in your personal information, upload your student ID, and
              continue to QRIS payment once everything looks good.
            </p>
          </div>
        </div>
      </div>

      <div className="relative col-span-1">
        <div className="relative lg:h-screen lg:overflow-y-auto">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-5 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
            <div className="rounded-3xl border border-[#D7E4E8] bg-white/90 p-6 shadow-[0_24px_60px_rgba(23,51,59,0.08)] backdrop-blur-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5E7D86]">
                PetroVis Registration
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#17333B] md:text-[2.2rem]">
                Registrant Information
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#647A82] md:text-base">
                Complete the form below with your personal, academic, and event
                details. Voucher code is optional, and payment will continue via
                QRIS after submission.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <SectionCard
                  title="Contact Information"
                  description="Use an active email and phone number so we can reach you about registration and payment."
                  icon={UserRound}
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Full Name <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="spe_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SPE Organization</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    isLoadingSPE
                                      ? "Loading..."
                                      : "Select SPE (optional)"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {speList?.map((spe) => (
                                <SelectItem key={spe.id} value={spe.id}>
                                  {spe.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Phone Number <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="628123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  title="Academic Information"
                  description="Provide your current academic identity so the committee can verify your participant data correctly."
                  icon={NotebookPen}
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Institution <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Universitas Indonesia"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Department <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Petroleum Engineering"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="batch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Batch / Year <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="student_id_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Student ID Number{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="12345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  title="Supporting Document"
                  description="Upload your student ID card in image format so the committee can verify your registration."
                  icon={FileBadge2}
                >
                  <FormField
                    control={form.control}
                    name="student_id_card"
                    render={({ field }) => (
                      <FormItem className="gap-3">
                        <UploadFile
                          title="Student ID Card"
                          description="Upload a clear image of your current student ID card."
                          value={field.value ?? null}
                          onChange={(file) => field.onChange(file)}
                          accept={{
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                          supportFiles={["jpg", "jpeg", "png"]}
                          isRequired={true}
                          variant="md"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionCard>

                <SectionCard
                  title="Event Questions"
                  description="Help us understand your motivation and how you discovered PetroVis."
                  icon={NotebookPen}
                >
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="motivation_joining_company_visit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Motivation for Joining Company Visit{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us why you want to join PetroVis."
                              className="min-h-[140px] rounded-2xl border-[#D3E1E6] bg-[#FAFCFC] px-4 py-3 leading-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="have_you_ever_participated_company_visit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Have you ever participated in a company visit?{" "}
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <Select
                              value={field.value ? "yes" : "no"}
                              onValueChange={(value) =>
                                field.onChange(value === "yes")
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="how_did_hear_this_event"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              How did you hear about this event?{" "}
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Instagram, friends, campus, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Payment & Voucher"
                  description="Review the payment method, optionally apply a voucher code, and confirm the registration summary."
                  icon={CircleDollarSign}
                >
                  <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="payment_method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value="QRIS"
                                disabled
                                className="bg-[#F5F9FA] font-medium text-[#254B55]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="rounded-2xl border border-dashed border-[#C9DDE3] bg-[#F9FCFD] p-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="has_voucher"
                            checked={showVoucherCode}
                            onCheckedChange={(checked) => {
                              const isChecked = checked === true;
                              setShowVoucherCode(isChecked);
                              if (!isChecked) {
                                form.setValue("voucher_code", "");
                              }
                            }}
                          />
                          <label
                            htmlFor="has_voucher"
                            className="text-sm font-medium leading-none text-[#23404A]"
                          >
                            I have a voucher code
                          </label>
                        </div>

                        {showVoucherCode && (
                          <div className="mt-4">
                            <FormField
                              control={form.control}
                              name="voucher_code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Voucher Code</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter voucher code"
                                      {...field}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#17333B] p-5 text-white shadow-[0_20px_50px_rgba(23,51,59,0.24)]">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A9CDD7]">
                        Registration Summary
                      </p>
                      <div className="mt-5 space-y-4 text-sm">
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                          <span className="text-[#D3E8EE]">Payment Method</span>
                          <span className="font-semibold">QRIS</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                          <span className="text-[#D3E8EE]">Normal Price</span>
                          <span className="font-semibold">Rp 145,000</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                          <span className="text-[#D3E8EE]">
                            Price with Voucher
                          </span>
                          <span className="font-semibold">Rp 120,000</span>
                        </div>
                        <div className="rounded-2xl bg-white/8 p-4 text-[#E7F5F8]">
                          Voucher code is optional. If valid, the discounted
                          price will be applied during payment.
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div className="sticky bottom-0 z-10 rounded-3xl border border-[#D7E4E8] bg-white/95 p-4 shadow-[0_-12px_40px_rgba(23,51,59,0.08)] backdrop-blur-sm md:p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#17333B]">
                        Ready to continue?
                      </p>
                      <p className="text-sm text-[#6B8087]">
                        Please review your information before continuing to
                        payment.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={isPending}
                      className="h-12 min-w-[190px] text-base"
                    >
                      {isPending ? "Submitting..." : "Register & Pay"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {isPending && <WholeLoadingPage opacity={0.75} />}
    </section>
  );
}
