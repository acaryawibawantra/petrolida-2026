"use client";

import SplitText from "@/components/SplitText";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Image from "next/image";
import Decorations from "../components/Decorations";

export default function Rejected({
  nrp,
  name,
}: {
  nrp: number | string;
  name: string;
}) {
  return (
    <main className="w-full min-h-screen h-screen bg-[url(/images/oprec-announcement-interview/bg-papper-green.png)] bg-cover bg-center relative overflow-hidden flex justify-center items-center">
      <Decorations />
      <section className="xl:w-[60%] w-full h-[40%] flex flex-col justify-center z-30">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <figure className="w-full h-1/2 hidden md:flex flex-col items-center pointer-events-none select-none">
            <Image
              src={"/images/oprec-announcement-interview/declined-dekstop.svg"}
              alt="accepted"
              width={900}
              height={600}
              draggable={false}
              className="pointer-events-none select-none"
            />
          </figure>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <figure className="w-full h-1/4 flex md:hidden flex-col items-center pointer-events-none select-none">
            <Image
              src={"/images/oprec-announcement-interview/declined-mobile.svg"}
              alt="accepted"
              width={700}
              height={600}
              draggable={false}
              className="pointer-events-none select-none"
            />
          </figure>
        </motion.div>
        <motion.div
          className="flex flex-col items-center pb-4 xl:py-5 py-0 xl:gap-3 gap-0"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div>
            <SplitText
              text={name}
              className="xl:text-5xl text-3xl font-bold font-helvetica pb-1 text-primary-50 text-center"
              delay={50}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>
          <Typography
            font="Helvetica"
            weight="bold"
            variant="h2"
            className="text-primary-50 md:text-4xl text-center"
          >
            {nrp}
          </Typography>
        </motion.div>
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Typography
            font="Helvetica"
            weight="bold"
            variant="h6"
            className="text-primary-50 text-center md:w-full md:max-w-full max-w-[300px]"
          >
            Keep up the spirit and good luck next time!
          </Typography>
        </motion.div>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full px-4 py-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            className="w-fit bg-[#335F43] hover:bg-[#23422e] transition-all ease-in-out border-transparent text-white font-bold py-3 px-4 sm:px-6 md:px-10 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Home size={20} className="flex-shrink-0" />
            <span className="whitespace-nowrap">Back to Homepage</span>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
