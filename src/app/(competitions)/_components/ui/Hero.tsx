"use client";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeroData {
  competition: string;
  title: string;
  subtitle: string;
  buttonText: string;
  images: {
    photo1: string;
    photo2: string;
    envelope: string;
    star1: string;
    star2: string;
    topSide: string;
    rectangle: string;
  };
}

interface HeroProps {
  data: HeroData;
}

export default function CompetitionHero({ data }: HeroProps) {
  return (
    <div className="relative min-h-screen bg-[#1D3E48] overflow-hidden flex items-center justify-center">
      {/* MOBILE */}
      <div className="xl:hidden relative w-full flex flex-col items-center pt-20 pb-44 px-6">
        {/* photos */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] -left-0 md:left-[20%] rotate-[-6deg] z-20"
        >
          <NextImage
            src={data.images.photo1}
            width={150}
            height={100}
            alt="Photo"
          />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] -right-0 md:right-[20%] rotate-[6deg] z-20"
        >
          <NextImage
            src={data.images.photo2}
            width={150}
            height={100}
            alt="Photo"
          />
        </motion.div>

        {/* card */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 12 }}
          className="bg-[#f3f1ee] text-center px-6 py-10 shadow-xl rounded-sm max-w-md w-full "
        >
          <Typography
            variant="h6"
            weight="bold"
            className="text-gray-600 mb-2 text-sm"
          >
            {data.competition}
          </Typography>

          <Typography
            font="Melodrame"
            variant="h2"
            className="text-[#BC425D] italic mb-3"
          >
            {data.title}
          </Typography>

          <Typography
            variant="t"
            weight="semibold"
            className="text-gray-600 text-sm mb-6"
          >
            {data.subtitle}
          </Typography>

          <Link href="/competition/dashboard/user">
            <Button className="py-2 px-5 text-sm">{data.buttonText}</Button>
          </Link>
        </motion.div>

        {/* envelope */}
        <NextImage
          src={data.images.envelope}
          width={500}
          height={200}
          alt="Envelope"
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        />

        {/* stars */}
        <motion.div
          className="absolute -bottom-[50%] -left-24"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <NextImage
            src={data.images.star1}
            width={300}
            height={300}
            alt="Star Decor"
          />
        </motion.div>

        <motion.div
          className="absolute -top-[50%] -right-24 "
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <NextImage
            src={data.images.star2}
            width={300}
            height={300}
            alt="Star Decor"
          />
        </motion.div>
      </div>

      {/* DESKTOP */}
      <div className="hidden xl:flex relative min-h-screen w-full items-center justify-center">
        {/* top side */}
        <NextImage
          src={data.images.topSide}
          width={1300}
          height={535}
          alt="Top Side"
          className="absolute top-0"
        />

        {/* back envelope */}
        <NextImage
          src={data.images.rectangle}
          width={1100}
          height={93}
          alt="Decor"
          className="absolute bottom-[33%] z-10"
        />

        {/* Paper Card */}
        <motion.div
          className="absolute bg-[#f3f1ee] w-[900px] text-center px-10 py-20 shadow-xl rounded-sm top-[23%] z-10"
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 12,
          }}
        >
          <Typography variant="h6" weight="bold" className="text-gray-600 mb-2">
            {data.competition}
          </Typography>

          <Typography
            font="Melodrame"
            variant="h1"
            className="text-[#BC425D] mb-4 italic"
          >
            {data.title}
          </Typography>

          <Typography
            variant="t"
            weight="semibold"
            className="text-gray-600 max-w-xl mx-auto mb-8"
          >
            {data.subtitle}
          </Typography>

          <Link href="/competition/dashboard/user">
            <Button className="py-2 px-6">{data.buttonText}</Button>
          </Link>
        </motion.div>

        {/* front envelope */}
        <NextImage
          src={data.images.envelope}
          width={1100}
          height={278}
          alt="Decor"
          className="absolute bottom-0 z-10"
        />

        {/* photos */}
        <motion.div
          className="absolute top-[15%] left-12 z-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <NextImage
              src={data.images.photo1}
              width={311}
              height={205}
              alt="Photo 1"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-[20%] right-12 z-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <NextImage
              src={data.images.photo2}
              width={311}
              height={205}
              alt="Photo 2"
            />
          </motion.div>
        </motion.div>

        {/* stars */}
        <motion.div
          className="absolute bottom-[15%] left-0"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <NextImage
            src={data.images.star1}
            width={300}
            height={300}
            alt="Star Decor"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-[15%] right-0"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <NextImage
            src={data.images.star2}
            width={300}
            height={300}
            alt="Star Decor"
          />
        </motion.div>
      </div>
    </div>
  );
}
