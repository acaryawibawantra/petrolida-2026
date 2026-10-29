import ButtonLink from "@/components/links/button-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { Calendar, Home, MessageCircle } from "lucide-react";
import DecorationsStatus from "../announcement/_components/decor-status";

interface InterviewedProps {
  name: string;
  nrp: string;
}

export default function Interviewed({ name, nrp }: InterviewedProps) {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <DecorationsStatus status="interviewed" />

      <div className="relative gap-2 flex flex-col items-center justify-center text-center max-w-3xl mt-[160px]">
        <NextImage
          src="/announc-lovol/label-accepted.svg"
          alt="Congratulations"
          width={679}
          height={233}
          className="w-[300px] min-[500px]:w-[400px] sm:w-[500px] lg:w-[679px]"
        />

        <Typography
          variant="h1"
          weight="bold"
          font="Helvetica"
          className="text-white"
        >
          {name}
        </Typography>

        <Typography
          variant="h2"
          weight="bold"
          font="Helvetica"
          className="text-white"
        >
          {nrp}
        </Typography>

        <Typography
          variant="p"
          weight="medium"
          font="Helvetica"
          className="text-white max-sm:max-w-xs"
        >
          Kindly check the PDF below to see your interview schedule.
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center">
          <ButtonLink
            variant="ghost"
            href="https://docs.google.com/spreadsheets/d/1usoR0Lqb9UZyiGTAwI09E2vTjzjrkqWI/edit?usp=sharing&ouid=109864618948479201790&rtpof=true&sd=true"
            target="_blank"
            leftIcon={Calendar}
            className="bg-secondary-500 hover:bg-secondary-800 text-white"
          >
            Interview Schedule
          </ButtonLink>

          <ButtonLink
            href="https://chat.whatsapp.com/HU5Xv3MAvau8S6ikEeGNiw"
            target="_blank"
            variant="ghost"
            leftIcon={MessageCircle}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Join WhatsApp Group
          </ButtonLink>

          <ButtonLink
            href="/"
            variant="ghost"
            leftIcon={Home}
            className="bg-gray-500 hover:bg-gray-700 text-white"
          >
            Back to Homepage
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
