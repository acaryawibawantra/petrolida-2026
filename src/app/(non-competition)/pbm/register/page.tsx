"use client";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PBMRegisterPage() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/pbm/register/form");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
      <div className="hidden md:block md:w-1/2 h-screen">
        <img
          src="/images/pbm/pbm-batch2-desktop.png"
          alt="Side Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="block md:hidden w-full h-48">
        <img
          src="/images/pbm/pbm-batch2-mobile.png"
          alt="Side Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex w-full flex-col lg:w-1/2 justify-center items-center px-8 py-[185px] lg:px-10 lg:py-[60px] gap-9">
        <div className="max-w-h">
          <Typography
            variant="h1"
            weight="medium"
            className="text-center mb-2 font-bold"
          >
            Register for PBM
          </Typography>
          <Typography variant="p" className="text-muted-foreground text-center">
            Petrolida Benchmarking and Management (PBM), premier online
            symposium hosted by PETROLIDA 2026, serving as the official
            pre-event before the competition series begins.
          </Typography>
        </div>

        <Button
          className="w-full h-12 text-lg bg-secondary-500 hover:bg-secondary-700"
          rightIcon={LogInIcon}
          onClick={handleClick}
        >
          Register Yourself
        </Button>
      </div>
    </div>
  );
}
