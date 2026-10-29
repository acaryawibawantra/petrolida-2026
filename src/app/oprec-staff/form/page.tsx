"use client";
import { useCallback, useEffect, useState } from "react";

import Button from "@/components/buttons/button";
import WholeLoadingPage from "@/components/loading/whole-loading";
import NextImage from "@/components/next-image";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useOprecHook } from "@/hooks/use-oprec-staff";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Form1Components from "./_components/form1";
import Form2Components from "./_components/form2";
import Form3Components from "./_components/form3";
import Form4Components from "./_components/form4";
import SuccessRegistComponent from "./_components/success-regist";

type StepFields = {
  [key: number]: string[];
};

const stepFields: StepFields = {
  0: [
    "name",
    "email",
    "department",
    "faculty",
    "batch",
    "student_id",
    "phone_number",
    "line_id",
    "about_petrolida",
    "primary_division_id",
    "secondary_division_id",
  ],
  1: [
    "about_primary_division",
    "reason_join_primary_division",
    "innovation_idea_primary_division",
  ],
  2: [
    "about_secondary_division",
    "reason_join_secondary_division",
    "innovation_idea_secondary_division",
  ],
  3: ["required_document_link"],
};

export default function FormOprecStaff() {
  const { isPending, onSubmit, form, isSuccess } = useOprecHook();
  const [page, setPage] = useState(0);
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const deadline = new Date("2027-10-14T00:00:00+07:00");
    const now = new Date();

    if (now >= deadline) {
      setIsRegistrationClosed(true);
      router.push("/oprec-staff");
    }
  }, [router]);

  const isStepValid = useCallback(() => {
    const currentStepFields = stepFields[page];

    if (!currentStepFields) return false;

    const isCurrentStepValid = currentStepFields.every(
      (field) =>
        !form.formState.errors[field as keyof typeof form.formState.errors],
    );

    const isCurrentStepFilled = currentStepFields.every((field) => {
      const value =
        form.getValues()[field as keyof typeof form.formState.dirtyFields];
      return value && value.toString().trim() !== "";
    });

    return isCurrentStepValid && isCurrentStepFilled;
  }, [page, form]);

  const handleNextStep = async () => {
    const currentStepFields = stepFields[page];

    if (currentStepFields && currentStepFields.length > 0) {
      const result = await form.trigger(currentStepFields as any);

      if (!result) {
        return;
      }
    }

    if (isStepValid()) {
      setPage(page + 1);
    }
  };

  if (isRegistrationClosed) {
    return null;
  }

  return (
    <>
      {isSuccess ? (
        <SuccessRegistComponent />
      ) : (
        <section className="grid h-full grid-cols-1 lg:grid-cols-2 lg:overflow-hidden">
          <div className="col-span-1 overflow-hidden lg:h-screen">
            {/* Desktop Background */}
            <NextImage
              src={"/oprec-staff/oprec-bg-desktop.png"}
              width={720}
              height={1024}
              imgClassName="object-cover w-full h-full"
              className="hidden lg:block lg:h-screen w-full"
              alt="Hero Desktop"
              priority
              quality={100}
            />

            {/* Mobile Background */}
            <NextImage
              src={"/oprec-staff/oprec-bg-mobile.png"}
              width={500}
              height={312}
              imgClassName="object-cover w-full h-full"
              className="block lg:hidden max-lg:h-[500px] max-md:!h-[312px] w-full"
              alt="Hero Mobile"
              priority
              quality={100}
            />
          </div>
          <div className="relative col-span-1">
            <div className="relative lg:h-screen lg:overflow-y-scroll">
              <div className="flex flex-col gap-9 px-6 py-12 pb-[100px]">
                <div className="flex w-full justify-between max-md:flex-col">
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold text-[#7A7A7A]">
                      Step: {page + 1} of 4
                    </p>
                    <p className="text-xl font-bold">
                      {page === 0
                        ? "Personal Information"
                        : page === 1
                          ? "Primary Division"
                          : page === 2
                            ? "Secondary Division"
                            : "Documents and Portfolio"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:w-1/2">
                    <Progress value={(page / 3) * 100} />
                    <p className="text-xl font-semibold text-[#7A7A7A]">
                      {Math.round((page / 3) * 100)}%
                    </p>
                  </div>
                </div>
                <Separator />
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {page === 0 && <Form1Components />}
                    {page === 1 && <Form2Components />}
                    {page === 2 && <Form3Components />}
                    {page === 3 && <Form4Components />}

                    <div className="flex justify-between">
                      {page !== 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setPage(page - 1);
                          }}
                        >
                          Back
                        </Button>
                      )}
                      {page === 0 && <div />}
                      {page !== 3 && (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          variant="secondary"
                          className="self-end"
                          disabled={!isStepValid()}
                          rightIcon={ArrowRight}
                        >
                          Go to Next Section
                        </Button>
                      )}
                      {page === 3 && (
                        <Button
                          type="submit"
                          variant="secondary"
                          disabled={isPending || !isStepValid()}
                        >
                          {isPending ? "Submitting..." : "Submit"}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          {isPending && <WholeLoadingPage />}
        </section>
      )}
    </>
  );
}
