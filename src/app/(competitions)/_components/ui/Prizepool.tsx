"use client";

import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { motion } from "framer-motion";

interface Prize {
  title: string;
  reward: string;
  tape: string;
  rotate: string;
  offset: string;
}

interface PrizeData {
  title: string;
  ribbon: string;
  images: {
    ribbon: string;
    books: string;
    clover: string;
    pen: string;
  };
  prizes: Prize[];
}

interface CompetitionPrizeProps {
  data: PrizeData;
}

export default function CompetitionPrize({ data }: CompetitionPrizeProps) {
  return (
    <section className="relative w-full min-h-screen sm:h-[963px] bg-[#3E7887] py-24 flex justify-center overflow-hidden">
      {/* pen decoration */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden xl:absolute xl:block left-12 bottom-0 z-30"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <NextImage src={data.images.pen} width={220} height={400} alt="pen" />
        </motion.div>
      </motion.div>

      {/* clover decoration */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden xl:absolute xl:block -right-24 top-28 z-30"
      >
        <motion.div
          animate={{
            rotate: [0, 5, 0],
          }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <NextImage
            src={data.images.clover}
            width={400}
            height={400}
            alt="decor"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="relative w-full  max-w-[1100px] flex flex-col items-center gap-16 px-6"
      >
        {/* header */}
        <div className="flex flex-col items-center gap-6">
          <Typography
            variant="h2"
            weight="bold"
            className="text-white text-center"
          >
            {data.title}
          </Typography>

          <div className="relative w-[420px] h-[80px] flex items-center justify-center">
            <NextImage
              src={data.images.ribbon}
              width={420}
              height={80}
              alt="ribbon"
              className="absolute inset-0"
            />

            <Typography
              font="Melodrame"
              variant="h2"
              className="text-[#B03A48] italic z-10"
            >
              {data.ribbon}
            </Typography>
          </div>
        </div>

        {/* board */}
        <div className="relative w-full py-32 px-10 rounded-sm">
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: `url(/images/${data.images.books})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* brown layer */}
          <motion.div
            initial={{ opacity: 0, y: 80, rotate: -8 }}
            whileInView={{ opacity: 1, y: 0, rotate: -6 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 12,
              delay: 1,
            }}
            className="hidden xl:absolute xl:block -left-10 bottom-0 w-[20%] h-[40rem] bg-[#93293F]  -z-5"
          />

          {/* white layer */}
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
            className="hidden xl:absolute xl:block -left-6 bottom-6 w-[20%] h-[40rem] bg-white  -z-5"
          />

          {/* prize grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-20 place-items-center">
            {data.prizes.length > 0 ? (
              data.prizes.map((prize, i) => (
                <div key={i} className={i >= 2 ? "xl:translate-x-16 z-10" : ""}>
                  <PrizeCard {...prize} />
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12">
                <Typography
                  variant="h3"
                  weight="semibold"
                  className="text-white text-center"
                >
                  Prize details will be announced soon
                </Typography>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function PrizeCard({ title, reward, tape, rotate, offset }: Prize) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 80 }}
      className={`relative w-[260px] h-[200px] flex items-center justify-center ${offset} z-10`}
      style={{ transform: `rotate(${rotate})` }}
    >
      {/* shadow */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black/10" />

      {/* sticky note */}
      <div className="absolute inset-0 bg-[#F2C744]" />

      {/* tape */}
      <NextImage
        src={tape}
        width={180}
        height={60}
        alt="tape"
        className="absolute -top-8"
      />

      <div className="relative flex flex-col items-center gap-2 text-center">
        <Typography
          font="Melodrame"
          variant="h3"
          className="text-[#B03A48] italic"
        >
          {title}
        </Typography>

        <Typography variant="h4" className="text-white">
          {reward}
        </Typography>
      </div>
    </motion.div>
  );
}
