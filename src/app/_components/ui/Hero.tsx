"use client";

import { Variants, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function PixelImage({
  src,
  alt,
  className,
  activeSlots,
}: {
  src: string;
  alt: string;
  className?: string;
  activeSlots: number[];
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [gridSize] = useState({ cols: 8, rows: 6 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const numBlocks = gridSize.cols * gridSize.rows;

  const getDelay = (i: number) => {
    const col = i % gridSize.cols;
    const row = Math.floor(i / gridSize.cols);
    const cx = gridSize.cols / 2;
    const cy = gridSize.rows / 2;
    const d = Math.sqrt(Math.pow(col - cx, 2) + Math.pow(row - cy, 2));
    const maxDist = Math.sqrt(
      Math.pow(gridSize.cols / 2, 2) + Math.pow(gridSize.rows / 2, 2),
    );
    return (d / (maxDist || 1)) * 1.5;
  };

  const generateKeyframes = () => {
    const totalTime = 18;
    const slotTime = 3;

    const points = [
      { t: 0, v: 1 },
      { t: 1, v: 1 },
    ];

    activeSlots.forEach((slot) => {
      const start = slot * slotTime;
      const t1 = start / totalTime;
      const t2 = (start + 1.2) / totalTime;
      const t3 = (start + 1.8) / totalTime;
      const t4 = (start + 3.0) / totalTime;

      points.push({ t: t1, v: 1 });
      points.push({ t: t2, v: 0 });
      points.push({ t: t3, v: 0 });
      points.push({ t: t4, v: 1 });
    });

    points.sort((a, b) => a.t - b.t);

    const times: number[] = [];
    const opacity: number[] = [];

    points.forEach((p, idx) => {
      if (idx === 0 || Math.abs(p.t - points[idx - 1].t) > 0.0001) {
        times.push(p.t);
        opacity.push(p.v);
      }
    });

    return { times, opacity };
  };

  const { times, opacity } = generateKeyframes();

  const rippleVariants: Variants = {
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: getDelay(i) * 0.5,
        ease: "easeInOut",
      },
    }),
    hidden: (i: number) => ({
      opacity: 0,
      transition: {
        duration: 0.4,
        delay: getDelay(i) * 0.5,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <motion.div
      className={`${className} w-[240px] h-[180px] overflow-hidden lg:block hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="block w-full h-full object-cover"
        onLoad={handleImageLoad}
      />

      {imageLoaded && (
        <div
          className="absolute inset-0 grid w-full h-full pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
          }}
        >
          {isMounted &&
            Array.from({ length: numBlocks }).map((_, i) => (
              <motion.div
                key={i}
                className="w-full h-full"
                custom={i}
                variants={rippleVariants}
                initial="visible"
                animate={isHovered ? "hidden" : "visible"}
              >
                <motion.div
                  className="bg-[#335F43] w-full h-full"
                  style={{ scale: 1.1 }}
                  animate={{ opacity: opacity }}
                  transition={{
                    duration: 18,
                    times: times,
                    repeat: Infinity,
                    repeatDelay: 0,
                    delay: getDelay(i),
                    ease: "linear",
                  }}
                />
              </motion.div>
            ))}
        </div>
      )}
    </motion.div>
  );
}

export default function Hero() {
  return (
    <main className="flex min-h-screen w-full bg-[#335F43] relative group overflow-hidden">
      <section>
        <PixelImage
          src="/images/landing/f1.png"
          alt=""
          className="absolute z-0 left-[20px] lg:left-[160px] top-[180px] lg:top-[280px]"
          activeSlots={[0, 5]}
        />
        <PixelImage
          src="/images/landing/f2.png"
          alt=""
          className="absolute left-[20px] lg:left-[60px] top-[420px] lg:top-[500px]"
          activeSlots={[1, 5]}
        />
        <PixelImage
          src="/images/landing/f3.png"
          alt=""
          className="absolute left-[20px] lg:left-[150px] top-[660px] lg:top-[740px]"
          activeSlots={[2, 5]}
        />
        <PixelImage
          src="/images/landing/f4.png"
          alt=""
          className="absolute right-[20px] lg:right-[80px] top-[120px] lg:top-[160px]"
          activeSlots={[3, 5]}
        />
        <PixelImage
          src="/images/landing/f5.png"
          alt=""
          className="absolute right-[20px] lg:right-[260px] top-[340px] lg:top-[380px]"
          activeSlots={[4, 5]}
        />

        <img
          src="/images/landing/Group1.svg"
          alt=""
          className="hidden lg:block lg:hover:block absolute left-[116px] top-[581px] pointer-events-none"
        />
        <img
          src="/images/landing/Group2.svg"
          alt=""
          className="hidden lg:block absolute right-[74px] top-[193px] pointer-events-none"
        />
        <svg
          width="628"
          height="355"
          viewBox="0 0 628 355"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0 w-1/2 lg:w-auto h-auto pointer-events-none"
        >
          <path
            d="M148.954 354.177L627.28 -81.9891L-61.041 -207L-105.107 135.955L148.954 354.177Z"
            fill="#F9C313"
          />
        </svg>
        <svg
          width="900"
          height="577"
          viewBox="0 0 622 577"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-0 bottom-0 w-3/4 lg:w-auto h-auto pointer-events-none"
        >
          <path
            d="M785.745 717.467L804.095 -2.61304e-05L328.721 307.707L0 776.175L785.745 717.467Z"
            fill="#F9C313"
          />
        </svg>
      </section>
      <section className="flex min-h-screen w-full items-center justify-center relative z-10 p-4">
        <div className="flex flex-col gap-[24px] lg:gap-[48px] w-full max-w-[900px] lg:h-[502px] items-center justify-center pointer-events-auto">
          <h1 className="w-full lg:w-[640px] text-3xl md:text-5xl lg:text-[60px] text-white text-center font-helvetica font-bold leading-tight">
            Leading Sustainable{" "}
            <span className="inline-flex items-center justify-center bg-[url('/images/landing/Vectori.svg')] bg-cover bg-no-repeat bg-center ">
              <span className="text-4xl md:text-6xl lg:text-[72px] font-normal font-melodrame italic leading-none">
                Optimization
              </span>
            </span>{" "}
            to Empower
            <br />
            Future{" "}
            <span className="inline-flex items-center justify-center bg-[url('/images/landing/Vectore.svg')] bg-cover bg-no-repeat bg-center ">
              <span className="text-4xl md:text-6xl lg:text-[72px] font-normal font-melodrame italic leading-none">
                Energy
              </span>
            </span>{" "}
            Solutions
          </h1>
          <div className="flex flex-col align-center gap-[16px] lg:gap-[24px]">
            <p className="text-sm md:text-lg lg:text-[20px] leading-normal lg:leading-[28px] text-white text-center font-helvetica font-normal tracking-[0.01em]">
              <span className="font-semibold">PETROLIDA 2026</span> aims to
              become a firm pioneer platform for university students in the
              dynamic advancement to provide
              <span className="font-semibold">
                {" "}
                valuable insights, opportunities, and experiences
              </span>{" "}
              by bestowing
              <br className="hidden md:block" />
              prospects to enhance excellence — establishing brilliant solutions
              for
              <br className="hidden md:block" />
              <span className="font-semibold">energy transformation</span> to
              prioritizing in future sustainability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] lg:gap-[32px]">
              <Link href="/about">
                <button className="flex items-center justify-center w-full sm:w-[170px] h-[48px] md:h-[48px] lg:h-[52px] px-[32px] border rounded-[12px] border-[#F9C313]">
                  <p className="text-base whitespace-nowrap lg:text-[20px] font-helvetica font-medium text-[#F9C313]">
                    Learn More
                  </p>
                </button>
              </Link>
              <Link href="/competition/dashboard/user">
                <button className="flex w-full sm:w-[170px] h-[48px] lg:h-[52px] px-[32px] py-[12px] gap-[10px] items-center justify-center border rounded-[12px] bg-[#F9C313] border-[#F9C313]">
                  <p className="text-base lg:text-[20px] font-helvetica font-medium leading-[28px] text-[#FCFCFC] ">
                    Register
                  </p>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
