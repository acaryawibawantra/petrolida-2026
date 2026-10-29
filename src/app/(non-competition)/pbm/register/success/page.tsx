"use client";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { useRouter } from "next/navigation";
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

const WHATSAPP_COMMUNAL_GROUP =
  "https://chat.whatsapp.com/DTq78dIJMbz6bsJvD5vUJC";

export default function PBMRegisterPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
      <div className="hidden md:block md:w-1/2 h-screen">
        <img
          src="/images/pbm/pbm-desktop.png"
          alt="Side Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="block md:hidden w-full h-48">
        <img
          src="/images/pbm/pbm-mobile.png"
          alt="Side Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex w-full flex-col lg:w-1/2 justify-center items-center px-8 py-[185px] lg:px-10 lg:py-[60px] gap-9">
        <NextImage
          src={"/pbm/completed-anu.svg"}
          alt="completed"
          width={300}
          height={300}
        />
        <div className="max-w-h">
          <Typography
            variant="h1"
            weight="medium"
            className="text-center mb-2 font-bold"
          >
            Register Completed!
          </Typography>
          <Typography
            variant="h6"
            className="text-muted-foreground text-center mb-5"
          >
            Your registration is completed.
          </Typography>
          <Typography
            variant="h6"
            className="text-muted-foreground text-center"
          >
            <b>Please join the Group Chat below</b> to receive further updates
            regarding the Volume. For further questions you can reach out to us
            on our social media below.
          </Typography>
        </div>
        <div className="w-full border-t" />
        <div className="w-full flex flex-col gap-2 max-w-xl">
          <Button
            leftIcon={FaWhatsapp}
            variant="secondary"
            onClick={() => router.push(WHATSAPP_COMMUNAL_GROUP)}
          >
            Join the group
          </Button>
          <Button
            variant="secondary"
            leftIcon={FaInstagram}
            onClick={() =>
              router.push("https://www.instagram.com/petrolida26/")
            }
          >
            PETROLIDA 2026 Instagram
          </Button>
          <Button
            leftIcon={FiLogOut}
            variant="secondary"
            onClick={() => router.push("/")}
          >
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
