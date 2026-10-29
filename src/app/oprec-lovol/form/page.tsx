"use client";

import { useCallback, useEffect, useState } from "react";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

import WholeLoadingPage from "@/components/loading/whole-loading";
import { useLovolRegistrationHook } from "@/hooks/use-lovol";
import Form1Components from "../_components/form1";
import Form2Components from "../_components/form2";
import Form3Components from "../_components/form3";
import SuccessRegistComponent from "../_components/success-regist";

type StepFields = {
  [key: number]: string[];
};

const stepFields: StepFields = {
  0: [
    "name",
    "email",
    "major",
    "batch",
    "student_id",
    "practical_work",
    "phone_number",
    "line_id",
    "information_from",
    "about_petrolida",
    "primary_division",
    "primary_motivation",
    "secondary_division",
    "secondary_motivation",
  ],
  1: [
    "english_proficiency",
    "communication_skill",
    "fast_response",
    "time_management",
  ],
  2: [
    "willing_to_pay",
    "transfer_to_other_division",
    "cv_asset",
    "follow_proof_asset",
  ],
};

export default function LovolRegisPage() {
  const { isPending, onSubmit, form, isSuccess } = useLovolRegistrationHook();
  const [page, setPage] = useState(0);
  const [, setIsRegistrationClosed] = useState(false);

  useEffect(() => {
    const deadline = new Date("2026-10-14T00:00:00+07:00");
    const now = new Date();

    setIsRegistrationClosed(now >= deadline);
  }, []);

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
      // Handle boolean values explicitly (false is a valid answer)
      if (typeof value === "boolean") {
        return true;
      }
      return (
        value !== undefined && value !== null && value.toString().trim() !== ""
      );
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

  return (
    <>
      {isSuccess ? (
        <SuccessRegistComponent />
      ) : (
        <section className="grid min-h-screen lg:grid-cols-2">
          <div className="col-span-1 overflow-hidden lg:h-screen">
            {/* Desktop Background */}
            <NextImage
              src={"/lovol/lovol-bg-desktop.png"}
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
              src={"/lovol/lovol-bg-mobile.png"}
              width={500}
              height={312}
              imgClassName="object-cover w-full h-full"
              className="block lg:hidden max-lg:h-[500px] max-md:!h-[302px] w-full"
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
                      Step: {page + 1} of 3
                    </p>
                    <p className="text-xl font-bold">
                      {page === 0
                        ? "Personal Information"
                        : page === 1
                          ? "Skills Assessment"
                          : "Commitments & Documents"}
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
                      {page !== 2 && (
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
                      {page === 2 && (
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
