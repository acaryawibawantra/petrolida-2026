"use client";

import Button from "@/components/buttons/button";
import WholeLoadingPage from "@/components/loading/whole-loading";
import Typography from "@/components/typography";
import { usePBMRegistrationHook } from "@/hooks/use-pbm";
import { FormProvider } from "react-hook-form";
import RegistrationPBM from "./RegistrationPBM";

export default function PBMRegisterForm() {
  const { onSubmit, form, batchList, isBatchLoading, isPending } =
    usePBMRegistrationHook();

  return (
    <div className="flex flex-col md:flex-row h-screen sticky overflow-hidden">
      <>
        <div className="hidden md:block md:w-1/2 h-screen">
          <img
            src="/images/pbm/pbm-batch2-desktop.png"
            alt="Side Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="block md:hidden w-full h-48">
          <img
            src="/images/pbm/pbm-batch2-mobile.png"
            alt="Side Background"
            className="w-full h-full object-cover"
          />
        </div>
      </>

      <div className="flex w-full flex-col lg:w-1/2 overflow-y-auto h-screen px-4 py-9 lg:px-10 lg:py-[60px] gap-9">
        <div>
          <Typography variant="h4" weight="bold" className="text-xl lg:h4">
            Registration Form
          </Typography>
          <Typography
            variant="p"
            weight="regular"
            className="text-muted-foreground text-base mt-3 mb-6"
          >
            Help us get to know you better! It only takes a minute to fill in
            your personal details
          </Typography>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <RegistrationPBM
                batchList={batchList}
                isBatchLoading={isBatchLoading}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="secondary"
                  className="px-8 py-2 mt-2 text-xl"
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      {isPending && <WholeLoadingPage />}
    </div>
  );
}
