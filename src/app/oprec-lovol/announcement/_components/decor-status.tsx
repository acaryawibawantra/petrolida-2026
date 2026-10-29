"use client";

import NextImage from "@/components/next-image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type LazyImageProps = {
  name: string;
  width: number;
  height: number;
  className?: string;
  delay?: number;
  initialY?: number;
  finalY?: number;
};

type DecorationsStatusProps = {
  status: "accepted" | "rejected" | "interviewed";
};

const FallingStar = ({
  name,
  width,
  height,
  className,
  delay = 0,
  initialY = -100,
  finalY = 2000,
}: LazyImageProps) => {
  return (
    <motion.div
      initial={{ y: initialY, opacity: 1 }}
      animate={{ y: finalY, opacity: 1 }}
      transition={{
        duration: 8,
        delay,
        ease: "linear",
      }}
      className={cn(className, "z-50")}
    >
      <NextImage
        src={`/announc-lovol/${name}`}
        alt={name}
        width={width}
        height={height}
        className={cn("pointer-events-none select-none")}
        draggable={false}
      />
    </motion.div>
  );
};

export default function DecorationsStatus({ status }: DecorationsStatusProps) {
  const isAccepted = status === "accepted";
  const flickerOpacity = [1, 1, 0, 0];

  const flickerTransition = {
    duration: 1,
    times: [0, 0.5, 0.5, 1],
    repeat: Infinity,
    ease: "linear" as const,
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-primary-800">
      <div className="absolute inset-0 bg-[url('/images/announc-lovol/bg.svg')] bg-cover bg-center opacity-[0.1] z-0" />
      <motion.div
        className="absolute top-[120px] left-1/2 ml-[40px] -translate-x-1/2 hidden xl:block z-0"
        animate={isAccepted ? { opacity: flickerOpacity } : { opacity: 1 }}
        transition={isAccepted ? flickerTransition : undefined}
      >
        <NextImage
          src="/announc-lovol/cahaya-desktop.svg"
          alt="Cahaya Sorot"
          width={1315}
          height={952}
          className="w-auto"
          imgClassName="h-[100vh] w-auto max-w-none"
        />
      </motion.div>

      <motion.div
        className="absolute top-[95px] left-1/2 ml-[6px] md:ml-[12px] lg:ml-[20px] -translate-x-1/2 xl:hidden w-[100%] md:top-[120px] lg:top-[160px] md:w-[90%] lg:w-[95%] z-0"
        animate={isAccepted ? { opacity: flickerOpacity } : { opacity: 1 }}
        transition={isAccepted ? flickerTransition : undefined}
      >
        <NextImage
          src="/announc-lovol/cahaya-mobile.svg"
          alt="Cahaya Sorot"
          width={603}
          height={794}
          className="w-full"
          imgClassName="h-auto w-full max-w-none"
        />
      </motion.div>
      <NextImage
        src="/announc-lovol/lampu.svg"
        alt="Lampu Gantung"
        width={439}
        height={338}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[439px] lg:w-[550px] xl:w-[439px]"
        imgClassName="w-full h-auto"
      />
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.75 }}
        className="absolute top-0 left-0 z-10 h-full w-1/2"
      >
        <NextImage
          src="/announc-lovol/tirai-scroll-left.svg"
          alt="Tirai Scroll Kiri"
          width={741}
          height={1106}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover object-right"
          priority
        />
      </motion.div>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.75 }}
        className="absolute top-0 right-0 z-10 h-full w-1/2"
      >
        <NextImage
          src="/announc-lovol/tirai-scroll-right.svg"
          alt="Tirai Scroll Kanan"
          width={741}
          height={1106}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover object-left"
          priority
        />
      </motion.div>

      {isAccepted && (
        <>
          <FallingStar
            name="star-red.svg"
            width={28}
            height={28}
            className="absolute left-[15%]"
            delay={2.3}
          />
          <FallingStar
            name="star-yellow.svg"
            width={28}
            height={28}
            className="absolute left-[25%] rotate-12"
            delay={2.3}
          />
          <FallingStar
            name="star-red.svg"
            width={28}
            height={28}
            className="absolute left-[35%] rotate-45"
            delay={2.4}
          />
          <FallingStar
            name="star-yellow.svg"
            width={28}
            height={28}
            className="absolute left-[45%]"
            delay={2.5}
          />
          <FallingStar
            name="star-red.svg"
            width={28}
            height={28}
            className="absolute left-[55%] rotate-12"
            delay={2.5}
          />
          <FallingStar
            name="star-yellow.svg"
            width={28}
            height={28}
            className="absolute left-[65%] rotate-45"
            delay={2.3}
          />
          <FallingStar
            name="star-red.svg"
            width={28}
            height={28}
            className="absolute left-[75%]"
            delay={2.4}
          />
          <FallingStar
            name="star-yellow.svg"
            width={28}
            height={28}
            className="absolute left-[85%] rotate-12"
            delay={2.5}
          />
          <FallingStar
            name="star-red.svg"
            width={28}
            height={28}
            className="absolute left-[20%] rotate-45"
            delay={2.8}
          />
          <FallingStar
            name="star-yellow.svg"
            width={28}
            height={28}
            className="absolute left-[30%]"
            delay={2.5}
          />
          <FallingStar
            name="star-red.svg"
            width={28}
            height={28}
            className="absolute left-[50%] rotate-12"
            delay={2.2}
          />
          <FallingStar
            name="star-yellow.svg"
            width={28}
            height={28}
            className="absolute left-[70%] rotate-45"
            delay={2.4}
          />
          <FallingStar
            name="star-red.svg"
            width={28}
            height={28}
            className="absolute left-[18%]"
            delay={2.5}
          />
          <FallingStar
            name="star-yellow.svg"
            width={28}
            height={28}
            className="absolute left-[40%] rotate-12"
            delay={2.35}
          />
          <FallingStar
            name="star-red.svg"
            width={28}
            height={28}
            className="absolute left-[60%] rotate-45"
            delay={2.6}
          />
          <FallingStar
            name="star-yellow.svg"
            width={28}
            height={28}
            className="absolute left-[80%]"
            delay={2.3}
          />
        </>
      )}

      <NextImage
        src="/announc-lovol/tirai-kiri.svg"
        alt="Tirai Kiri"
        width={488}
        height={1780}
        className="absolute top-0 left-0 z-20 w-auto hidden xl:block h-full"
        imgClassName="h-full w-auto object-cover object-left-top"
        priority
      />
      <NextImage
        src="/announc-lovol/tirai-kanan.svg"
        alt="Tirai Kanan"
        width={488}
        height={1780}
        className="absolute top-0 w-auto z-20 right-0 hidden xl:block h-full"
        imgClassName="h-full w-auto object-cover object-right-top"
        priority
      />
      <NextImage
        src="/announc-lovol/tirai-kiri-mobile.svg"
        alt="Tirai Kiri"
        width={99}
        height={903}
        className="absolute top-0 left-0 z-20 h-full md:w-[250px] lg:w-[250px] xl:hidden"
        imgClassName="h-full w-full object-cover object-left-top"
        priority
      />
      <NextImage
        src="/announc-lovol/tirai-kanan-mobile.svg"
        alt="Tirai Kanan"
        width={99}
        height={903}
        className="absolute top-0 right-0 h-full md:w-[250px] lg:w-[250px] xl:hidden z-20"
        imgClassName="h-full w-full object-cover object-right-top"
        priority
      />
    </div>
  );
}
