"use client";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Join() {
  const joinRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: joinRef,
    offset: ["start end", "end start"],
  });

  const cardOpacity = useTransform(
    scrollYProgress,
    [0, 0.19, 0.25],
    [0, 0.5, 1],
  );
  const cardy = useTransform(scrollYProgress, [0, 0.3], [1000, 0]);

  const floatingAnimation = (duration: number, delay: number) => ({
    y: [0, -10, 0],
    transition: {
      duration: duration,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut" as const,
      delay: delay,
    },
  });

  return (
    <div
      ref={joinRef}
      className="sticky top-0 h-[30vh] md:h-[45vh] xl:h-screen w-full bg-[url(/images/landing/join-bg.svg)] bg-cover bg-center overflow-hidden flex justify-center items-end"
    >
      {/* decoration */}
      <div className="absolute inset-0 pointer-events-none z-[9999]">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[17%] lg:top-[10%] left-[10.5%] max-md:w-[70px] max-xl:w-[150px]"
        >
          <Image
            src="/images/landing/star.svg"
            alt="decoration"
            width={187}
            height={187}
          />
        </motion.div>

        <motion.div
          animate={floatingAnimation(3.5, 0.5)}
          className="absolute top-[15%] lg:top-[8%] right-0 max-md:w-[100px] max-xl:w-[200px]"
        >
          <Image
            src="/images/landing/pita-right.svg"
            alt="decoration"
            width={374}
            height={112}
          />
        </motion.div>

        <motion.div
          animate={floatingAnimation(4, 1)}
          className="absolute bottom-[10%] left-0 max-xl:w-[200px] max-md:w-[100px]"
        >
          <Image
            src="/images/landing/pita-left.svg"
            alt="decoration"
            width={374}
            height={112}
          />
        </motion.div>

        <motion.div
          animate={floatingAnimation(3, 1.5)}
          className="absolute right-[5%] bottom-[20%] lg:right-[8%] max-md:w-[50px] max-xl:w-[100px]"
        >
          <Image
            src="/images/landing/yellow-stone.svg"
            alt="decoration"
            width={138}
            height={102}
          />
        </motion.div>

        <Image
          src="/images/landing/white-dot.svg"
          alt="decoration"
          width={88}
          height={88}
          className="absolute bottom-[10%] right-[20%] max-md:w-[25px] max-xl:w-[50px]"
        />
      </div>

      <div className="w-[80%] h-[75%] md:h-[85.5%] flex flex-col relative">
        {/* papper */}
        <motion.div
          style={{ y: cardy, opacity: cardOpacity }}
          className="absolute inset-0 z-10"
        >
          <div className="relative w-full h-full">
            <figure className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-1/8 w-[80%] max-w-[80%] h-full bg-[url(/images/landing/title-papper.svg)] bg-contain bg-no-repeat bg-center">
              <div className="absolute inset-0">
                {/* content papper */}
                <div className="absolute h-[65%] w-[80%] bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-5">
                  <Typography
                    variant="h2"
                    font="Helvetica"
                    weight="medium"
                    className="text-danger-500 max-w-4xl text-[0.55rem] md:text-xl lg:text-3xl xl:text-4xl text-center"
                  >
                    Be the first to know the ultimate opportunity to show your
                    ideas and advancements in bolstering the future of the
                    energy sector
                  </Typography>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-fit md:text-xl lg:text-3xl text-[0.5rem] px-3 md:py-3 md:px-6 bg-danger-500 cursor-pointer z-[99]"
                  >
                    Register
                  </Button>
                </div>
              </div>
            </figure>
          </div>
        </motion.div>
        <figure className="flex-1 h-1/2 w-full relative pointer-events-none">
          <Image
            src={"/images/landing/amplop-atas.svg"}
            alt="amplop"
            fill
            className="object-cover absolute top-0"
          />
        </figure>
        <figure className="flex-1 h-1/2 w-full relative pointer-events-none">
          <Image
            src={"/images/landing/amplop-belakang.svg"}
            alt="amplop"
            fill
            className="object-cover absolute top-0"
          />

          <Image
            src={"/images/landing/amplop-depan.svg"}
            alt="amplop"
            fill
            className="object-cover absolute bottom-0 z-[999]"
          />
        </figure>
      </div>
    </div>
  );
}
