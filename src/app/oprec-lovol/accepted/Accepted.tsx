import ButtonLink from "@/components/links/button-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { BookText, Home } from "lucide-react";
import DecorationsStatus from "../announcement/_components/decor-status";

interface AcceptedProps {
  name: string;
  nrp: string;
}

export default function Accepted({ name, nrp }: AcceptedProps) {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <DecorationsStatus status="accepted" />

      <div className="relative gap-2 flex flex-col items-center justify-center text-center max-w-3xl mt-[160px]">
        <NextImage
          src="/announc-lovol/accepted.svg"
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
          Kindly click the button below to confirm your attendance for the
          Welcome Party.
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center">
          <ButtonLink
            variant="ghost"
            href="https://petrolida.com/link/RSVPWelcomePartyLOVOL2026"
            target="_blank"
            leftIcon={BookText}
            className="bg-secondary-500 hover:bg-secondary-800 text-white"
          >
            RSVP
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
