"use client";

import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { motion } from "framer-motion";

export default function PetrovisVisit() {
  return (
    <div className="relative w-full min-h-screen bg-[#E0EAAA] overflow-hidden">
      <NextImage
        src="/petrovis/top-green-bg.svg"
        width={1951}
        height={300}
        alt="top green bg"
        className="absolute top-0 -left-12 w-[900px] h-auto md:w-[1951px] md:h-[300px]"
      />

      <motion.div
        className="absolute left-0 top-24 md:top-[12%] z-10"
        animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      >
        <NextImage
          src="/petrovis/blade-decor.svg"
          width={132}
          height={113}
          alt="blade decor"
          className="w-[70px] md:w-[132px] md:h-[113px]"
        />
      </motion.div>

      <div className="relative w-full flex justify-center">
        <div className="relative z-10 w-full flex justify-center">
          <NextImage
            src="/petrovis/red-scarf.svg"
            width={1151}
            height={150}
            alt="red scarf"
            className="hidden md:block"
          />

          <div className="absolute top-2 md:inset-0  flex items-center justify-center px-6">
            <Typography
              variant="h2"
              font="Melodrame"
              weight="thin"
              className="text-white text-3xl sm:text-4xl md:text-5xl flex flex-wrap items-center justify-center gap-x-3 text-center leading-tight italic"
            >
              Where will
              <Typography
                variant="h2"
                font="Helvetica"
                weight="bold"
                className="text-white not-italic"
              >
                PetroVis 2026
              </Typography>
              be visiting this year?
            </Typography>
          </div>
        </div>
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-6 pt-28 md:pt-40 pb-40 md:pb-[20rem]"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mt-16">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <NextImage
              src="/petrovis/photo-3.png"
              width={300}
              height={300}
              alt="polaroid 1"
              className="w-[160px] sm:w-[280px] md:w-[300px]"
            />
          </motion.div>

          <motion.div
            className="max-w-xl text-justify"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Typography
              variant="h6"
              font="Helvetica"
              className="text-[#7A3E1D] leading-relaxed"
            >
              <span className="font-bold text-[#6D8F3A]">
                PT Trans-Pacific Petrochemical Indotama{" "}
              </span>{" "}
              (TPPI) is an Indonesian{" "}
              <span className="bg-[#bfca7f] px-1">petrochemical</span> and{" "}
              <span className="bg-[#bfca7f] px-1">refining company</span>{" "}
              established in 1995, with its main operations located in Tuban.
              The company processes condensate into fuels and petrochemical
              products such as{" "}
              <span className="bg-[#bfca7f] px-1">
                paraxylene, benzene, and other aromatics
              </span>
              , which support industries like plastics, textiles, and
              manufacturing.
            </Typography>
          </motion.div>
        </div>

        <div className="relative flex flex-col-reverse md:flex-row justify-center items-center gap-12 md:gap-24 mt-12">
          <motion.div
            className="max-w-xl text-justify"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Typography
              variant="h6"
              font="Helvetica"
              className="text-[#7A3E1D] leading-relaxed mt-6"
            >
              <span className="font-bold text-[#6D8F3A]">In Indonesia,</span>
              <br />
              TPPI plays an important role in{" "}
              <span className="bg-[#bfca7f] px-1">
                supplying energy and chemical raw materials
              </span>{" "}
              while helping reduce dependence on imports and supporting
              downstream industrial growth.
            </Typography>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <NextImage
              src="/petrovis/photo-1.png"
              width={700}
              height={63}
              alt="polaroid 2"
              className="w-[280px] sm:w-[280px] md:w-[405px]"
            />
          </motion.div>
        </div>
        <div className="relative flex flex-col-reverse md:flex-row justify-center items-center gap-12 md:gap-24 mt-12">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <NextImage
              src="/petrovis/photo-2.png"
              width={405}
              height={213}
              alt="polaroid 2"
              className="w-[280px] sm:w-[280px] md:w-[405px]"
            />
          </motion.div>
          <motion.div
            className="max-w-xl text-justify"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Typography
              variant="h6"
              font="Helvetica"
              className="text-[#7A3E1D] leading-relaxed"
            >
              TPPI’s <span className="bg-[#bfca7f] px-1">vision</span> is{" "}
              <span className="bg-[#bfca7f] px-1">
                {" "}
                to become a world-class petrochemical and energy company,
              </span>{" "}
              while its <span className="bg-[#bfca7f] px-1">mission</span> is{" "}
              <span className="bg-[#bfca7f] px-1">
                {" "}
                to operate an integrated business with professionalism,
                efficiency, and integrity.
              </span>{" "}
              Through modern technology and sustainable practices, TPPI
              contributes to strengthening Indonesia’s energy and petrochemical
              sector.
            </Typography>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className=" absolute bottom-12 md:bottom-32 right-6 md:right-12 z-10"
        animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      >
        <NextImage
          src="/petrovis/blade-decor.svg"
          width={132}
          height={113}
          alt="blade decor"
          className="w-[70px] md:w-[132px] md:h-[113px]"
        />
      </motion.div>

      <NextImage
        src="/petrovis/bottom-green-bg.svg"
        width={1951}
        height={300}
        alt="bottom green bg"
        className="absolute bottom-0  w-[900px] h-auto md:w-[1951px] md:h-[300px]"
      />
    </div>
  );
}
