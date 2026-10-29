"use client";

import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const aboutRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });

  const sectionBg = useTransform(
    scrollYProgress,
    [0, 0.15, 0.2],
    ["#f9c313", "#f9c313", "#ffffff"],
  );

  const pictsY = useTransform(scrollYProgress, [0, 0.2], [-1000, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [1000, 0]);
  const opacityFlower = useTransform(
    scrollYProgress,
    [0, 0.15, 0.2],
    [0, 0, 1],
  );

  const cardScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.7],
    [1, 1, 1, 0.7, 0.6],
  );
  const cardScales = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.7],
    [1, 1, 1, 0.7, 0.6],
  );
  const bgRotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.4, 0.5],
    [0, 0, 0, 0, 5],
  );

  const c1x = useTransform(scrollYProgress, [0.6, 0.65], [300, 0]);
  const c1y = useTransform(scrollYProgress, [0.6, 0.66], [-300, 0]);

  const c2x = useTransform(scrollYProgress, [0.6, 0.67], [-300, 0]);
  const c2y = useTransform(scrollYProgress, [0.6, 0.68], [-300, 0]);

  const c3x = useTransform(scrollYProgress, [0.6, 0.69], [-400, 0]);
  const c4x = useTransform(scrollYProgress, [0.6, 0.7], [400, 0]);

  const c5x = useTransform(scrollYProgress, [0.6, 0.71], [-300, 0]);
  const c5y = useTransform(scrollYProgress, [0.6, 0.72], [300, 0]);

  const c6x = useTransform(scrollYProgress, [0.6, 0.73], [300, 0]);
  const c6y = useTransform(scrollYProgress, [0.6, 0.74], [300, 0]);

  return (
    <section ref={aboutRef} className="w-full min-h-[800vh] bg-warning-500">
      <div className="w-full min-h-screen h-screen sticky top-0 overflow-hidden">
        {/* card kecil kecil */}
        <motion.div
          style={{ x: c1x, y: c1y }}
          className="bg-[url('/images/landing/about-sub.svg')] bg-contain bg-no-repeat bg-center absolute -right-10 md:right-10 top-20 md:top-0 aspect-video w-[200px] md:w-[300px] lg:w-[400px]"
        />
        <motion.div
          style={{ x: c2x, y: c2y }}
          className="bg-[url('/images/landing/about-sub.svg')] bg-contain bg-no-repeat bg-center absolute -left-10 md:left-10 top-40 md:top-10 aspect-video w-[200px] md:w-[300px] lg:w-[400px]"
        />
        <motion.div
          style={{ x: c3x }}
          className="bg-[url('/images/landing/about-sub.svg')] bg-contain bg-no-repeat bg-center absolute left-0 bottom-1/2 translate-y-1/2 aspect-video w-[200px] md:w-[300px] lg:w-[400px]"
        />
        <motion.div
          style={{ x: c4x }}
          className="bg-[url('/images/landing/about-sub.svg')] bg-contain bg-no-repeat bg-center absolute right-0 bottom-1/2 translate-y-1/2 aspect-video w-[200px] md:w-[300px] lg:w-[400px]"
        />
        <motion.div
          style={{ x: c5x, y: c5y }}
          className="bg-[url('/images/landing/about-sub.svg')] bg-contain bg-no-repeat bg-center absolute left-0 md:left-1/4 bottom-10 md:bottom-0 aspect-video w-[200px] md:w-[300px] lg:w-[400px]"
        />
        <motion.div
          style={{ x: c6x, y: c6y }}
          className="bg-[url('/images/landing/about-sub.svg')] bg-contain bg-no-repeat bg-center absolute right-0 md:right-20 bottom-10 md:bottom-0 aspect-video w-[200px] md:w-[300px] lg:w-[400px]"
        />

        {/* belakang card */}
        <motion.div
          style={{ scale: cardScales, rotate: bgRotate }}
          className="absolute w-full h-full inset-0 bg-green-600 flex bg-cover shadow-2xl"
        >
          <div className="w-1/2 h-full bg-[#7D9F3E]" />
          <div className="w-1/2 h-full bg-[#385745]" />
          <div className="w-1/2 h-1/2 absolute -right-[4%] bottom-[5%] bg-[#385745] rounded-r-3xl" />
        </motion.div>

        {/* card putih */}
        <motion.div
          style={{ background: sectionBg, scale: cardScale }}
          className="
            w-full min-h-screen
            flex flex-col
            justify-center
            items-center
            relative
            px-4
            py-10
          "
        >
          {/* ornament */}
          <motion.div
            style={{ opacity: opacityFlower }}
            className="absolute inset-0"
          >
            <NextImage
              src={"/landing/flower-bottom.svg"}
              alt="flower-b"
              width={300}
              height={300}
              className="absolute -bottom-[15%] -left-[9%] md:block hidden"
            />
            <NextImage
              src={"/landing/flower-top.svg"}
              alt="flower-t"
              width={150}
              height={150}
              className="absolute -top-[5%] -right-[3%] md:block hidden"
            />
          </motion.div>

          {/* FOTO */}
          <div className="w-full flex justify-center items-center">
            <motion.div
              style={{ y: pictsY }}
              className="
                w-full max-w-6xl
                h-[40vh] sm:h-[45vh] md:h-[60vh]
                bg-[url('/images/landing/foto-about.png')]
                bg-cover bg-center
                rounded-xl
              "
            />
          </div>
          <motion.div
            style={{ y: textY }}
            className="w-full flex justify-center mt-6 md:mt-10"
          >
            <Typography
              variant="h2"
              font="Helvetica"
              weight="medium"
              className="
                text-danger-500
                text-center
                px-4 md:px-12
                text-base md:text-xl
                max-w-5xl
              "
            >
              <b>PETROLIDA 2026</b> aims to become a firm pioneer platform for
              university students in the dynamic advancement to provide{" "}
              <b>valuable insights, opportunities, and experiences</b> by
              bestowing prospects to enhance excellence — establishing brilliant
              solutions for <b>energy transformation</b>, prioritizing in future
              sustainability.
            </Typography>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
