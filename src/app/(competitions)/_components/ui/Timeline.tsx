"use client";

import AOS from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";

interface TimelineItem {
  label: string;
  date: string;
  topPercent: number;
}

interface TimelineProps {
  leftItems: TimelineItem[];
  rightItems: TimelineItem[];
}

export default function CompetitionTimeline({
  leftItems,
  rightItems,
}: TimelineProps) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section className="relative w-full bg-primary-800 min-h-screen overflow-hidden">
      <NextImage
        src="/oil-rig-design/card-bg.svg"
        alt="Background"
        width={1507}
        height={1573}
        className="absolute bottom-0 left-0 w-full xl:translate-y-[10%]"
        imgClassName="w-full h-auto"
      />
      <div className="relative z-10 flex mt-28 items-center flex-col w-full">
        <div data-aos="fade-down">
          <Typography
            font="Helvetica"
            variant="h5"
            weight="bold"
            className="text-white text-center"
          >
            Don't miss out
          </Typography>
        </div>
        <div data-aos="fade-down" data-aos-delay="150">
          <NextImage
            src="/oil-rig-design/title.svg"
            alt="Title"
            width={570}
            height={89}
            className="w-[320px] md:w-[470px] lg:w-[570px] px-4"
          />
        </div>

        <NextImage
          src="/oil-rig-design/flower.svg"
          alt="flower"
          width={273}
          height={277}
          className="absolute -right-[25px] top-[15%] md:-right-[90px] md:top-[40%] w-[80px] md:w-[273px]"
        />
        <NextImage
          src="/oil-rig-design/flower.svg"
          alt="flower"
          width={161}
          height={164}
          className="absolute right-[20px] bottom-[15%] md:right-[120px] md:bottom-[7%] w-[60px] md:w-[161px]"
        />
        <NextImage
          src="/oil-rig-design/flower.svg"
          alt="flower"
          width={273}
          height={277}
          className="absolute -left-[30px] bottom-[15%] md:-left-[90px] md:bottom-[15%] w-[80px] md:w-[273px]"
        />
        <NextImage
          src="/oil-rig-design/flower.svg"
          alt="flower"
          width={229}
          height={233}
          className="absolute -left-[30px] top-[15%] md:-left-[80px] md:top-[32%] w-[70px] md:w-[229px]"
        />
        <NextImage
          src="/oil-rig-design/penjepit-photo.svg"
          alt="Penjepit"
          width={1465}
          height={372}
          className="w-full relative"
          imgClassName="w-full h-auto"
        />

        {/* Timeline Section */}
        <div className="flex flex-col md:flex-row w-full mt-[80px] md:mt-[150px] xl:mt-[250px]">
          {/* timeline kiri */}
          <div className="relative flex-1" style={{ minHeight: "800px" }}>
            <div className="absolute top-0 h-full left-[30%] md:left-[36%] lg:left-[35%] w-[9px] bg-[#F9C213]" />
            {leftItems.map((item, i) => (
              <div
                key={i}
                data-aos="fade-right"
                data-aos-delay={`${i * 100}`}
                className="absolute flex items-center gap-3 left-[24%] min-[500px]:left-[25%] sm:left-[26%] md:left-[29%] lg:left-[30%] xl:left-[32%]"
                style={{
                  top: `${item.topPercent}%`,
                  transform: "translateY(-50%)",
                }}
              >
                <NextImage
                  src="/oil-rig-design/star.svg"
                  alt="Star"
                  width={64}
                  height={64}
                />
                <div>
                  <Typography
                    font="Helvetica"
                    variant="h5"
                    weight="bold"
                    className="text-white"
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    font="Helvetica"
                    variant="h6"
                    weight="medium"
                    className="text-white"
                  >
                    {item.date}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          {/* timeline kanan */}
          <div className="relative flex-1" style={{ minHeight: "800px" }}>
            <div className="absolute top-0 h-full left-[30%] md:left-[36%] lg:left-[25%] w-[9px] bg-[#F9C213]" />
            {rightItems.map((item, i) => (
              <div
                key={i}
                data-aos="fade-left"
                data-aos-delay={`${i * 100}`}
                className="absolute flex items-center gap-3 left-[24%] min-[500px]:left-[25%] sm:left-[26%] md:left-[29%] lg:left-[20%] xl:left-[22%]"
                style={{
                  top: `${item.topPercent}%`,
                  transform: "translateY(-50%)",
                }}
              >
                <NextImage
                  src="/oil-rig-design/star.svg"
                  alt="Star"
                  width={64}
                  height={64}
                />
                <div>
                  <Typography
                    font="Helvetica"
                    variant="h5"
                    weight="bold"
                    className="text-white"
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    font="Helvetica"
                    variant="h6"
                    weight="medium"
                    className="text-white"
                  >
                    {item.date}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
