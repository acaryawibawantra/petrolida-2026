"use client";

import Button from "@/components/buttons/button";
import Input from "@/components/form/input";
import Typography from "@/components/typography";
import useOprecAnnounceHook from "@/hooks/use-oprec-announcement";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FormProvider } from "react-hook-form";
import Accepted from "./accepted/Accepted";
import Rejected from "./rejected/Rejected";

const AnnouncementPage = () => {
  const { method, onSubmit, isPending, status, data, nrp } =
    useOprecAnnounceHook();

  const currentNim = method.watch("nrp") || nrp;
  const studentName = data?.data?.name || "";
  const studentNrp = nrp || "";

  return (
    <section className="relative bg-[#7FA854] w-full min-h-screen overflow-hidden flex justify-center items-center">
      <AnimatePresence mode="wait">
        {status === "initial" && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full min-h-screen overflow-hidden flex justify-center 
                 items-center md:items-end 
                 bg-no-repeat bg-cover bg-center
                 bg-[url:var(--bg-mobile)] md:bg-[url:var(--bg-desktop)]"
            style={
              {
                "--bg-desktop":
                  "url('/images/oprec-announcement-interview/bg-announcement-input-desktop.png')",
                "--bg-mobile":
                  "url('/images/oprec-announcement-interview/bg-announcement-input-mobile.png')",
              } as React.CSSProperties
            }
          >
            <div className="relative flex justify-center w-full max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="w-full flex flex-col items-center mb-0 md:mb-20 mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="w-full max-w-2xl space-y-1"
                >
                  <FormProvider {...method}>
                    <div className="flex flex-col md:flex-row gap-2">
                      <motion.div
                        className="w-full"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <Typography
                          variant="h2"
                          weight="medium"
                          className="text-left text-lg md:text-xl lg:text-xl"
                        >
                          Student ID<span className="text-red-900">*</span>
                        </Typography>
                        <Input
                          id="nrp"
                          type="text"
                          placeholder="ex. 5053241067"
                          className="w-full py-3 px-3 rounded-md focus:outline-none transition-colors font-bold"
                          hideError={true}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              method.handleSubmit(onSubmit)();
                            }
                          }}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-auto"
                      >
                        <Button
                          onClick={method.handleSubmit(onSubmit)}
                          disabled={!currentNim || isPending}
                          variant="secondary"
                          className="h-11 w-full md:w-fit rounded-xl whitespace-nowrap px-8 bg-[#335F43] border-transparent"
                          size="sm"
                          rightIcon={ArrowRight}
                        >
                          {isPending ? "Checking..." : "Check Status"}
                        </Button>
                      </motion.div>
                    </div>
                  </FormProvider>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interviewed View */}
        {status === "accepted" && (
          <Accepted nrp={studentNrp} name={studentName} />
        )}

        {/* Rejected View */}
        {(status === "rejected" || status === "interviewed") && (
          <Rejected nrp={studentNrp} name={studentName} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default AnnouncementPage;
