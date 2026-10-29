"use client";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { LogInIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PetrovisRegisterPage() {
  const router = useRouter();
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  useEffect(() => {
    const deadline = new Date("2026-04-06T23:59:59+07:00");
    const now = new Date();

    setIsRegistrationClosed(now >= deadline);
  }, []);

  const handleClick = () => {
    if (isRegistrationClosed) return;
    router.push("/petrovis/register/form");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
      {/* Desktop Background */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <Image
          src="/images/petrovis/form-background.svg"
          width={720}
          height={1024}
          alt="Petrovis Registration"
          className="w-full h-full object-cover"
          quality={100}
        />
      </div>

      {/* Mobile Background */}
      <div className="block md:hidden w-full h-48">
        <Image
          src="/images/petrovis/form-background.svg"
          width={500}
          height={312}
          alt="Petrovis Registration Mobile"
          className="w-full h-full object-cover"
          quality={100}
        />
      </div>

      <div className="flex w-full flex-col lg:w-1/2 justify-center items-center px-8 py-[185px] lg:px-10 lg:py-[60px] gap-9">
        <div className="max-w-h">
          <Typography
            variant="h1"
            weight="medium"
            className="text-center mb-2 font-bold"
          >
            Register for Petrovis
          </Typography>
          <Typography variant="p" className="text-muted-foreground text-center">
            {isRegistrationClosed
              ? "PetroVis registration closed on April 6, 2026 at 23:59 WIB. Thank you for your enthusiasm."
              : "Fuel your passion by registering for PetroVis now."}
          </Typography>
        </div>

        {isRegistrationClosed ? (
          <div className="w-full rounded-2xl border border-[#D7E4E8] bg-[#F4F8F9] px-5 py-4 text-center text-sm text-[#5E7D86]">
            Registration has ended as of April 6, 2026 at 23:59 WIB.
          </div>
        ) : (
          <Button
            className="w-full h-12 text-lg bg-secondary-500 hover:bg-secondary-700"
            rightIcon={LogInIcon}
            onClick={handleClick}
          >
            Register Now
          </Button>
        )}
      </div>
    </div>
  );
}
