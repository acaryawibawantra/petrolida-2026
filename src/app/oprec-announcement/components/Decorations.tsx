import NextImage from "@/components/next-image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type LazyImageProps = {
  name: string;
  width: number;
  height: number;
  className?: string;
  delay?: number;
  direction?: "left" | "right" | "top" | "bottom" | "stay";
};

const LazyImage = ({
  name,
  width,
  height,
  className,
  delay = 0,
  direction = "top",
}: LazyImageProps) => {
  const directions = {
    left: { x: -1000, y: 0 },
    right: { x: 1000, y: 0 },
    top: { y: -1000, x: 0 },
    bottom: { y: 1000, x: 0 },
    stay: { y: 0, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, ...directions[direction] }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        opacity: { duration: 0.6 },
      }}
    >
      <NextImage
        src={`/oprec-announcement-interview/${name}`}
        alt={name}
        width={width}
        height={height}
        className={cn(className, "pointer-events-none select-none")}
        draggable={false}
      />
    </motion.div>
  );
};

export default function Decorations() {
  return (
    <div className="absolute inset-0">
      {/* star */}
      <LazyImage
        name="star.png"
        width={40}
        height={40}
        className="absolute xl:w-[40px] w-[30px] xl:top-2 xl:right-[4%] top-[11%] right-[12%] rotate-12 z-20 animate-pulse"
        delay={0.1}
        direction="right"
      />
      <LazyImage
        name="star.png"
        width={40}
        height={40}
        className="absolute xl:top-[30%] xl:right-[15%] z-20 xl:w-[40px] w-[25px] top-[25%] right-[30%] animate-pulse"
        delay={0.2}
        direction="right"
      />
      <LazyImage
        name="star.png"
        width={40}
        height={40}
        className="absolute bottom-[22%] right-[10%] xl:bottom-[10%] xl:right-[5%] xl:w-[40px] w-[30px] rotate-45 z-20 animate-pulse"
        delay={0.3}
        direction="right"
      />
      <LazyImage
        name="star.png"
        width={40}
        height={40}
        className="absolute xl:block hidden bottom-[25%] left-[5%] rotate-12 z-20 animate-pulse"
        delay={0.4}
        direction="left"
      />
      <LazyImage
        name="star.png"
        width={40}
        height={40}
        className="absolute xl:w-[40px] w-[30px] bottom-[5%] xl:left-[15%] left-[10%] rotate-12 animate-pulse"
        delay={0.5}
        direction="left"
      />
      <LazyImage
        name="star.png"
        width={40}
        height={40}
        className="absolute xl:w-[40px] w-[20px] top-[10%] xl:left-[25%] left-[10%] rotate-45 animate-pulse"
        delay={0.6}
        direction="left"
      />
      <LazyImage
        name="star.png"
        width={40}
        height={40}
        className="absolute top-[30%] left-[15%] xl:block hidden rotate-45 animate-pulse"
        delay={0.7}
        direction="left"
      />

      {/* deco left */}
      <LazyImage
        name="deco-left.png"
        width={350}
        height={200}
        className="h-full absolute hidden xl:block md:block top-0 bottom-0 left-0"
        delay={0.2}
        direction="left"
      />

      {/* deco top */}
      <LazyImage
        name="deco-top-right.png"
        width={350}
        height={200}
        className="absolute xl:top-10 xl:right-10 xl:w-[350px] md:w-[350px] w-[200px] top-10 md:-right-[15%] -right-[30%]"
        delay={0.3}
        direction="bottom"
      />
      <LazyImage
        name="deco-top-left.png"
        width={300}
        height={200}
        className="absolute xl:top-0 xl:left-[25%] md:left-[35%] -left-[10%] xl:w-[300px] md:w-[300px] w-[150px]"
        delay={0.4}
        direction="top"
      />
      <LazyImage
        name="deco-top-star-kotok.png"
        width={100}
        height={200}
        className="absolute xl:block md:block hidden top-[11%] right-[20%]"
        delay={0.5}
        direction="top"
      />
      <LazyImage
        name="anu-anu-2.png"
        width={70}
        height={70}
        className="absolute xl:hidden md:hidden block xl:top-[11%] xl:right-[35%] xl:w-[70px] md:x-[70px] w-[50px] top-[11%] right-[22%]"
        delay={0.5}
        direction="top"
      />

      {/* deco right */}
      <LazyImage
        name="deco-right.png"
        width={200}
        height={200}
        className="absolute xl:block md:block hidden top-1/2 -translate-y-3/4 right-0"
        delay={0.6}
        direction="right"
      />
      <LazyImage
        name="anu-anu-1.png"
        width={80}
        height={80}
        className="absolute bottom-1/4 translate-y-1/2 right-0 xl:w-[80px] md:w-[60px] w-[40px]"
        delay={0.7}
        direction="stay"
      />

      {/* deco bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] xl:w-[85%] h-10">
        <LazyImage
          name="deco-bottom-hand.png"
          width={600}
          height={500}
          className="absolute bottom-0 xl:right-0 xl:-translate-x-[12%] right-1/2 translate-x-1/2 xl:w-[500px] md:w-[600px] w-[300px]"
          delay={0.8}
          direction="bottom"
        />
        <LazyImage
          name="deco-hand.png"
          width={650}
          height={400}
          className="absolute bottom-0 xl:block hidden md:-left-20 xl:left-0"
          delay={0.9}
          direction="bottom"
        />
      </div>
      <LazyImage
        name="deco-bottom-kotok.png"
        width={80}
        height={80}
        className="absolute xl:block hidden bottom-[12%] left-1/2 -translate-x-1/2"
        delay={0.5}
        direction="top"
      />
      <LazyImage
        name="deco-bottom.png"
        width={140}
        height={140}
        className="absolute xl:bottom-10 bottom-2 right-[10%] xl:w-[120px] md:w-[140px] w-[90px]"
        delay={1.1}
        direction="top"
      />
    </div>
  );
}
