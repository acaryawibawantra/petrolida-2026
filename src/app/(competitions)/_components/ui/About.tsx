"use client";

import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { motion } from "framer-motion";

interface AboutData {
  title: string;
  description: string;
  images: {
    board: string;
    clover1: string;
    clover2: string;
  };
}

interface AboutProps {
  data: AboutData;
}

export default function CompetitionAbout({ data }: AboutProps) {
  return (
    <section className="relative w-full min-h-[604px] bg-[#1D3E48] overflow-hidden flex justify-center py-20 px-6 md:p-0">
      {/* background decorations */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 top-0"
      >
        <NextImage
          src={data.images.clover1}
          width={260}
          height={260}
          alt="decor"
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 bottom-0"
      >
        <NextImage
          src={data.images.clover2}
          width={230}
          height={230}
          alt="decor"
        />
      </motion.div>

      {/* board title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="absolute right-4 md:right-[10%] top-[15%] md:top-[29%] z-30"
      >
        <div className="relative w-[260px] md:w-[474px] h-[50px] md:h-[85px]">
          <NextImage
            src={data.images.board}
            width={474}
            height={85}
            alt="decor"
            className="absolute inset-0 w-full h-full"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <Typography
              font="Melodrame"
              variant="h3"
              className="text-white italic rotate-[1deg] text-center"
            >
              {data.title}
            </Typography>
          </div>
        </div>
      </motion.div>

      {/* stacked cards */}
      <div className="relative flex justify-center items-center w-[1100px] max-w-[95%] mt-20 md:mt-0">
        {/* yellow layer */}
        <motion.div
          initial={{ opacity: 0, y: 80, rotate: -8 }}
          whileInView={{ opacity: 1, y: 0, rotate: -6 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 12,
            delay: 0.6,
          }}
          className="absolute left-4 md:left-6 bottom-0 w-[85%] md:w-[400px] h-[260px] md:h-[300px] bg-[#F4B400] rounded-sm"
        />

        {/* back card */}
        <motion.div
          initial={{ opacity: 0, y: 120, rotate: -10 }}
          whileInView={{ opacity: 1, y: 0, rotate: -6 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 12,
            delay: 0.3,
          }}
          className="absolute left-8 md:left-10 bottom-4 w-[85%] md:w-[400px] h-[260px] md:h-[300px] bg-white rounded-sm z-10"
        />

        {/* main card */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
          className="absolute bottom-0 bg-white flex justify-center items-center px-6 md:px-14 py-8 md:py-0 max-w-4xl md:h-[400px] shadow-xl rounded-sm z-20"
        >
          <Typography
            variant="t"
            weight="medium"
            className="text-gray-700 leading-relaxed text-sm md:text-lg text-center md:text-left"
          >
            {data.description}
          </Typography>
        </motion.div>
      </div>
    </section>
  );
}
