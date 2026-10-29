"use client";

import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { motion } from "framer-motion";

export default function LookingBack() {
  return (
    <div className="relative w-full  min-h-[350px] md:min-h-[645px] bg-[#81A344] flex flex-col justify-center items-center gap-24 md:gap-16  overflow-hidden ">
      <Typography
        variant="h1"
        font="Helvetica"
        weight="bold"
        className=" text-white flex flex-col md:flex-row leading-none gap-2 md:gap-5 text-center"
      >
        <Typography
          variant="h1"
          font="Melodrame"
          weight="thin"
          className="text-white italic"
        >
          Looking back
        </Typography>
        PetroVis 2025
      </Typography>

      <div className="relative w-full -translate-y-16 md:translate-y-0">
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <NextImage
            src="/petrovis/petrovis-film.png"
            width={1527}
            height={290}
            alt="petrovis film"
            priority
            className="h-[100px] w-[800px] md:w-[1527px] md:h-[290px]"
          />

          <NextImage
            src="/petrovis/petrovis-film.png"
            width={1527}
            height={290}
            alt="petrovis film duplicate"
            priority
            className="h-[100px] w-[800px] md:w-[1527px] md:h-[290px]"
          />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 right-0 z-10"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <NextImage
          src="/petrovis/blade-decor.svg"
          width={132}
          height={113}
          alt="blade decor"
          className="hidden md:block"
        />
      </motion.div>
    </div>
  );
}
