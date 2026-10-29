"use client";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

export default function HeroAbout() {
  const [isNeat, setIsNeat] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleNeat = () => {
    setIsNeat(true);
    setResetKey((prev) => prev + 1);
  };

  return (
    <section className="relative min-h-screen w-full bg-[#FBDA07] overflow-hidden flex flex-col items-center">
      {/* hero */}
      <div className="w-full bg-[#F9C313] flex justify-center items-center py-20 md:py-32 px-8 z-0">
        <NextImage
          src="/petrovis/text-hero.svg"
          alt="#Power by Passion"
          width={1157}
          height={272}
          className="hidden md:block"
        />
        <NextImage
          src="/petrovis/text-hero-mobile.svg"
          alt="#Power by Passion"
          width={211}
          height={125}
          className="md:hidden"
        />
      </div>

      {/* about */}
      <NextImage
        src="/petrovis/flower.svg"
        alt="flower"
        width={176}
        height={176}
        className="absolute bottom-[2%] left-[294px] w-[100px] md:left-[3%] z-[99] md:w-[140px] lg:w-[176px]"
      />

      {/* about desktop */}
      <LayoutGroup>
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 20, damping: 20 }}
          className={`hidden md:flex relative w-full items-start -mt-20 mb-20 z-10 ${isNeat ? "justify-center" : "justify-start"}`}
        >
          <motion.div layout className="relative shrink-0 z-20">
            <NextImage
              src="/petrovis/bg-about-1.svg"
              alt="Background Left"
              width={333}
              height={1011}
              className="h-auto w-[190px] lg:w-[240px] xl:w-[286px] 2xl:w-[333px]"
            />

            <Button
              onClick={handleNeat}
              variant="danger"
              size="base"
              className="absolute top-[20%] left-1/2 -translate-x-1/2 z-10"
            >
              Neat this file
            </Button>

            {/* Images desktop saat sudah klik button neat */}
            {isNeat && (
              <div className="absolute top-[5%] left-0 w-full flex flex-col items-center gap-4 z-20 pointer-events-none">
                <motion.div
                  key={`img1-neat-${resetKey}`}
                  layoutId="image-1"
                  drag
                  whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                  className="relative flex justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
                  style={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 60, damping: 20 }}
                >
                  <NextImage
                    src="/petrovis/img-about-1.png"
                    alt="About Image 1"
                    width={287}
                    height={470}
                    className="h-auto w-[140px] lg:w-[180px] xl:w-[240px] 2xl:w-[287px] shadow-xl mx-auto pointer-events-none"
                  />
                </motion.div>

                <motion.div
                  key={`img2-neat-${resetKey}`}
                  layoutId="image-2"
                  drag
                  whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                  className="relative flex justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
                  style={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 60, damping: 20 }}
                >
                  <NextImage
                    src="/petrovis/img-about-2.png"
                    alt="About Image 2"
                    width={368}
                    height={244}
                    className="h-auto w-[180px] lg:w-[220px] xl:w-[290px] 2xl:w-[368px] shadow-xl mx-auto pointer-events-none"
                  />
                </motion.div>
              </div>
            )}
          </motion.div>

          <motion.div
            layout
            className="relative shrink-0 -ml-[2px] lg:-ml-[3px] -mt-[1.5px] lg:-mt-[2px] 2xl:-mt-[3px]"
          >
            <NextImage
              src="/petrovis/bg-about-2.svg"
              alt="Background Right"
              width={991}
              height={1013}
              className="h-auto w-[565px] lg:w-[715px] xl:w-[850px] 2xl:w-[991px]"
            />

            <div className="absolute inset-0">
              <motion.div
                layout
                className="absolute top-[8%] left-0 right-0 mx-auto w-[62%] z-10"
              >
                <NextImage
                  src="/petrovis/title-about.svg"
                  alt="About PetroVis"
                  width={615}
                  height={131}
                  className="w-full h-auto"
                />
              </motion.div>

              <motion.div
                layout
                className="absolute bottom-0 left-0 right-0 mx-auto w-full md:max-w-[380px] lg:max-w-[450px] xl:max-w-[540px] 2xl:max-w-[631px] h-auto bg-white flex justify-center items-center md:px-4 md:py-6 lg:px-6 lg:py-8 2xl:px-8 2xl:py-12"
              >
                <Typography
                  font="Helvetica"
                  variant="h2"
                  weight="medium"
                  className="text-[#8C3813] text-center md:text-[19px] lg:text-[22px] xl:text-[28px] 2xl:text-[32px]"
                >
                  PetroVis is a pre-event of Petrolida, a dynamic platform that
                  connects external stakeholders, including oil and gas
                  professionals and SPE Java Student Chapters. This initiative
                  encourages the exchange of forward-thinking ideas, strengthens
                  professional networks, and builds lasting industry
                  relationships. Through interactive engagements and
                  knowledge-sharing sessions, PetroVis not only enhances
                  organizational growth but also equips future energy leaders
                </Typography>
              </motion.div>

              {/* Images desktop saat belum klik button neat */}
              {!isNeat && (
                <>
                  <motion.div
                    layoutId="image-1"
                    drag
                    whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                    className="absolute bottom-[2%] left-[5%] z-20 cursor-grab"
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                  >
                    <NextImage
                      src="/petrovis/img-about-1.png"
                      alt="About Image 1"
                      width={287}
                      height={470}
                      className="h-auto w-[140px] lg:w-[180px] xl:w-[240px] 2xl:w-[287px] pointer-events-none"
                    />
                  </motion.div>

                  <motion.div
                    layoutId="image-2"
                    drag
                    whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                    className="absolute bottom-0 left-[15%] z-20 cursor-grab"
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                  >
                    <NextImage
                      src="/petrovis/img-about-2.png"
                      alt="About Image 2"
                      width={368}
                      height={244}
                      className="h-auto w-[180px] lg:w-[220px] xl:w-[290px] 2xl:w-[368px] pointer-events-none"
                    />
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </LayoutGroup>

      {/* mobile about */}
      <div className="flex md:hidden relative w-full flex-col items-start -mt-10 mb-20 z-10">
        <div className="relative w-fit">
          <NextImage
            src="/petrovis/bg-about-2-mobile.svg"
            alt="Background Mobile Top"
            width={383}
            height={828}
          />

          <div className="absolute inset-0 flex flex-col items-center px-4 pt-[15%]">
            <NextImage
              src="/petrovis/title-about-mobile.svg"
              alt="About PetroVis Title"
              width={166}
              height={85}
              className="mb-6"
            />

            <div className="bg-white w-full max-w-[253px] px-6 py-8 shadow-sm">
              <Typography
                font="Helvetica"
                variant="t"
                weight="medium"
                className="text-[#8C3813] text-center"
              >
                PetroVis is a pre-event of Petrolida, a dynamic platform that
                connects external stakeholders, including oil and gas
                professionals and SPE Java Student Chapters. This initiative
                encourages the exchange of forward-thinking ideas, strengthens
                professional networks, and builds lasting industry
                relationships. Through interactive engagements and
                knowledge-sharing sessions, PetroVis not only enhances
                organizational growth but also equips future energy leaders
              </Typography>
            </div>

            {/* Images mobile saat belum neat */}
            {!isNeat && (
              <div className="absolute bottom-[5%] flex flex-col items-center gap-4">
                <motion.div
                  layoutId="image-1-mobile"
                  drag
                  whileDrag={{ scale: 1.1 }}
                  className="cursor-grab active:cursor-grabbing absolute bottom-[5%] -left-20"
                  transition={{ type: "spring", stiffness: 60, damping: 20 }}
                >
                  <NextImage
                    src="/petrovis/img-about-1.png"
                    alt="Activity 1"
                    width={287}
                    height={470}
                    className="w-[146px] pointer-events-none"
                  />
                </motion.div>

                <motion.div
                  layoutId="image-2-mobile"
                  drag
                  whileDrag={{ scale: 1.1 }}
                  className="relative cursor-grab active:cursor-grabbing"
                  transition={{ type: "spring", stiffness: 60, damping: 20 }}
                >
                  <NextImage
                    src="/petrovis/img-about-2.png"
                    alt="Activity 2"
                    width={368}
                    height={244}
                    className="w-[195px] pointer-events-none"
                  />
                </motion.div>
              </div>
            )}
          </div>
        </div>

        <div className="relative w-fit">
          <NextImage
            src="/petrovis/bg-about-1-mobile.svg"
            alt="Background Mobile Bottom"
            width={363}
            height={479}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Button
              onClick={handleNeat}
              variant="danger"
              size="base"
              className="mb-12"
            >
              Neat this file
            </Button>

            {/* Images mobile saat sudah neat */}
            {isNeat && (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  key={`img1-neat-mobile-${resetKey}`}
                  layoutId="image-1-mobile"
                  drag
                  whileDrag={{ scale: 1.1 }}
                  className="absolute top-[5%] cursor-grab active:cursor-grabbing "
                  style={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 60, damping: 20 }}
                >
                  <NextImage
                    src="/petrovis/img-about-1.png"
                    alt="Activity 1"
                    width={287}
                    height={470}
                    className="w-[176px] pointer-events-none"
                  />
                </motion.div>

                <motion.div
                  key={`img2-neat-mobile-${resetKey}`}
                  layoutId="image-2-mobile"
                  drag
                  whileDrag={{ scale: 1.1 }}
                  className="absolute top-[60%] cursor-grab active:cursor-grabbing"
                  style={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 60, damping: 20 }}
                >
                  <NextImage
                    src="/petrovis/img-about-2.png"
                    alt="Activity 2"
                    width={368}
                    height={244}
                    className="w-[245px] pointer-events-none"
                  />
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
