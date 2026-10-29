"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FormProvider } from "react-hook-form";

import Button from "@/components/buttons/button";
import Input from "@/components/form/input";
import Typography from "@/components/typography";

import useOprecLovolAnnounce from "@/hooks/use-oprec-lovol-announc";
import Accepted from "../accepted/Accepted";
import Interviewed from "../interviewed/Interviewed";
import Rejected from "../rejected/Rejected";
import Decorations from "./_components/decorations";

export default function AnnouncementPage() {
  const { method, onSubmit, isPending, status, data, nrp } =
    useOprecLovolAnnounce();
  const { isValid } = method.formState;

  const studentName = data?.data?.name || "";
  const studentNrp = nrp || "";

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-primary-800">
      <div className="absolute inset-0 bg-[url('/images/announc-lovol/bg.svg')] bg-cover bg-center opacity-[0.14] z-0" />
      <Decorations />

      <AnimatePresence mode="wait">
        {status === "initial" && (
          <motion.div
            key="form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute z-20 w-full left-0 right-0 bottom-[30%] md:bottom-[15%]"
          >
            <div className="w-full max-w-3xl mx-auto px-8">
              <FormProvider {...method}>
                <form
                  onSubmit={method.handleSubmit(onSubmit)}
                  className="flex flex-col md:flex-row gap-3 md:items-end w-full"
                >
                  <div className="space-y-2 w-full md:flex-1">
                    <Typography
                      variant="t"
                      weight="medium"
                      className="ml-1 text-white drop-shadow-md"
                    >
                      Student ID <span className="text-danger-500">*</span>
                    </Typography>

                    <Input
                      id="nrp"
                      name="nrp"
                      hideError={true}
                      placeholder="ex : 50123456789"
                      className="bg-white/90 border-transparent text-black placeholder:text-gray-400 focus-visible:ring-offset-0 focus-visible:ring-danger-400 w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending || !isValid}
                    className="w-full md:w-auto bg-primary-300 hover:bg-primary-700 text-white font-semibold rounded-xl py-2 px-6 shrink-0"
                    rightIcon={ArrowRight}
                  >
                    {isPending ? "Checking..." : "Check Result"}
                  </Button>
                </form>
              </FormProvider>
            </div>
          </motion.div>
        )}

        {status === "accepted" && (
          <motion.div
            key="accepted"
            className="absolute z-30 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Accepted nrp={studentNrp} name={studentName} />
          </motion.div>
        )}
        {status === "interviewed" && (
          <motion.div
            key="interviewed"
            className="absolute z-30 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Interviewed nrp={studentNrp} name={studentName} />
          </motion.div>
        )}

        {status === "rejected" && (
          <motion.div
            key="rejected"
            className="absolute z-30 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Rejected nrp={studentNrp} name={studentName} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
