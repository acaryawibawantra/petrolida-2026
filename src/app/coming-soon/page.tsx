"use client";

import ButtonLink from "@/components/links/button-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const CommingSoonPage = () => {
  return (
    <section className="relative bg-secondary-500 w-full h-screen overflow-hidden flex justify-center items-center">
      <div
        className="relative w-full h-screen overflow-hidden flex justify-center items-end 
                   bg-no-repeat mobile-bg-custom md:bg-cover md:bg-center
                   bg-[url(/images/coming-soon/background/coming-soon/background-mb.png)] md:bg-[url(/images/coming-soon/background/coming-soon/background.png)]"
      >
        <div className="relative flex justify-center lg:w-3/4">
          <NextImage
            src={"/coming-soon/background/content-bg.png"}
            width={860}
            height={860}
            alt="bg content"
            className=" w-[760px] lg:w-[860px] h-auto -mb-24 hidden md:block"
          />
          <NextImage
            src={"/coming-soon/background/content-bg-mb.png"}
            width={860}
            height={860}
            alt="bg content"
            className=" w-[760px] lg:w-[860px] h-auto -mb-24 md:hidden"
          />
          <div className="absolute h-full top-20 md:top-16 object-contain w-full flex flex-col items-center ">
            <div className="mx-auto w-2/3">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Typography
                  as="h1"
                  variant="h1"
                  font="Helvetica"
                  className="font-bold uppercase text-white text-center opacity-80 tracking-tight leading-none text-7xl xl:text-9xl"
                >
                  Coming
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              >
                <Typography
                  as="h1"
                  variant="h1"
                  font="Melodrame"
                  className="italic tracking-tight absolute top-8 right-1/3 lg:top-12 lg:right-[30%] text-7xl xl:text-9xl"
                  style={{
                    color: "#FFFFFF",
                    textShadow: `2px 2px 0px #D28092, 
                              -2px -2px 0px #D28092, 
                              2px -2px 0px #D28092, 
                              -2px 2px 0px #D28092`,
                    WebkitTextStroke: "1px #D28092",
                  }}
                >
                  Soon
                </Typography>
              </motion.div>
            </div>
            <div className="w-4/12 md:w-2/3 lg:w-1/2 space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              >
                <NextImage
                  src={"/coming-soon/hat.svg"}
                  alt="hat"
                  width={250}
                  height={250}
                  className="mx-auto w-[180px] lg:w-[220px]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
              >
                <Typography
                  as="p"
                  variant="h6"
                  font="Helvetica"
                  className="text-white tracking-tight leading-tight text-center"
                >
                  We&apos;re excited to let you know that the website is being
                  developed to enhance your experience. Keep an eye out for more
                  updates!
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                className="flex justify-center items-center"
              >
                <ButtonLink
                  href="https://www.instagram.com/petrolida26/"
                  target="_blank"
                  leftIcon={Instagram}
                  className="mt-2"
                  variant="danger"
                >
                  Check Our Social Media
                </ButtonLink>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommingSoonPage;
