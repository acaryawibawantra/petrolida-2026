"use client";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { Book, LogIn } from "lucide-react";
import Link from "next/link";

interface CTAData {
  title: string;
  description: string;
  images: {
    board: string;
    shadow: string;
    shuriken1: string;
    shuriken2: string;
  };
  links: {
    register: string;
    invitationLetter: string;
  };
}

interface CompetitionCTAProps {
  data: CTAData;
}

export default function CompetitionCTA({ data }: CompetitionCTAProps) {
  return (
    <section className="relative w-full bg-[#357182] overflow-hidden  flex justify-center py-20 px-6">
      {/* decorations */}
      <div className="absolute -right-8 -top-10 md:-top-12 z-10">
        <NextImage
          src={data.images.shuriken1}
          width={250}
          height={250}
          alt="decor"
          className="w-[140px] md:w-[250px]"
        />
      </div>

      <div className="absolute left-0 -bottom-10 md:-bottom-12 z-10">
        <NextImage
          src={data.images.shuriken2}
          width={200}
          height={200}
          alt="decor"
          className="w-[120px] md:w-[200px]"
        />
      </div>

      {/* board container */}
      <div className="relative w-full max-w-[1000px] aspect-[1000/300] flex items-center justify-center">
        {/* shadow */}
        <NextImage
          src={data.images.shadow}
          width={1010}
          height={310}
          alt="board shadow"
          className="absolute top-[6px] left-[6px] w-full h-full"
        />

        {/* board */}
        <NextImage
          src={data.images.board}
          width={1000}
          height={300}
          alt="board"
          className="absolute left-1/2 -translate-x-1/2 -translate-y-6 md:translate-y-0 w-[1000px] h-auto md:w-full md:h-full"
        />

        {/* content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:gap-12 px-6 md:px-12 -translate-y-6">
          {/* text */}
          <div className="flex flex-col items-center md:items-start gap-4 max-w-[420px]">
            <Typography
              font="Melodrame"
              variant="h2"
              className="text-white italic text-xl md:text-3xl"
            >
              {data.title}
            </Typography>

            <Typography
              variant="t"
              weight="medium"
              className="text-white text-sm md:text-base"
            >
              {data.description}
            </Typography>
          </div>

          {/* buttons */}
          <div className="flex flex-col gap-3 md:gap-4">
            <Link href="/competition/dashboard/user" className="w-full">
              <Button className="rounded-lg flex px-4 w-full" leftIcon={LogIn}>
                Register Now
              </Button>
            </Link>

            <Link
              href="https://petrolida.com/link/InvitationLetterComp2026"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="outline"
                className="rounded-lg text-white hover:bg-white/10 px-6 w-full border-white"
                leftIcon={Book}
              >
                Invitation Letter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
