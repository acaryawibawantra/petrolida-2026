"use client";

import Button from "@/components/buttons/button";
import ButtonLink from "@/components/links/button-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { Check, ClipboardCopy, House, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const PETROVIS_WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/JTgBb2Qi3ZYJ8yrayO8OAF?mode=gi_t";

export default function PetrovisSuccessPage() {
  const params = useParams<{ orderID: string }>();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const orderID = params?.orderID ?? "-";
  const hasWhatsappLink = Boolean(PETROVIS_WHATSAPP_GROUP_URL);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(orderID);
    setIsCopied(true);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#E9F2F4] px-5 py-12">
      <NextImage
        src="/petrovis/blade-decor.svg"
        width={308}
        height={518}
        alt="decoration"
        className="absolute left-0 top-0 w-36 -rotate-12 opacity-50 md:w-52"
      />
      <NextImage
        src="/petrovis/red-scarf.svg"
        width={236}
        height={215}
        alt="decoration"
        className="absolute bottom-0 right-0 w-32 opacity-70 md:w-44"
      />

      <div className="relative z-10 w-full max-w-3xl rounded-[36px] border border-white/70 bg-white/95 p-6 shadow-[0_24px_70px_rgba(23,51,59,0.14)] backdrop-blur-sm md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-[#DCEEEF] p-5">
            <Check className="h-12 w-12 text-[#1F5E6A] md:h-16 md:w-16" />
          </div>

          <Typography
            variant="h2"
            weight="bold"
            className="text-[#17333B] md:text-[42px]"
          >
            Registration Successful
          </Typography>

          <Typography
            variant="p"
            className="mt-3 max-w-2xl text-center text-[#5E7D86] md:text-base"
          >
            Your PetroVis registration has been recorded. Keep your order ID for
            future reference and join the WhatsApp group to stay updated on
            event information.
          </Typography>
        </div>

        <div className="mt-8 rounded-[28px] border border-[#D5E6EA] bg-[#F7FBFC] p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography
                variant="bt"
                weight="bold"
                className="uppercase tracking-[0.18em] text-[#5E7D86]"
              >
                Order ID
              </Typography>
              <Typography
                variant="h5"
                weight="bold"
                className="mt-2 break-all text-[#17333B] md:text-[28px]"
              >
                {orderID}
              </Typography>
            </div>

            <Button
              type="button"
              variant="outline"
              leftIcon={isCopied ? Check : ClipboardCopy}
              onClick={handleCopy}
              className="h-12 border-[#B8D1D8] px-5 text-[#17333B] hover:bg-[#EAF4F6]"
            >
              {isCopied ? "Copied" : "Copy Order ID"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            leftIcon={Users}
            disabled={!hasWhatsappLink}
            onClick={() => router.push(PETROVIS_WHATSAPP_GROUP_URL)}
            className="h-12"
          >
            Join WhatsApp Group
          </Button>

          <ButtonLink
            href="/petrovis"
            variant="outline"
            leftIcon={House}
            className="h-12 border-[#B8D1D8] text-[#17333B] hover:bg-[#EAF4F6]"
          >
            Back to PetroVis
          </ButtonLink>
        </div>

        {!hasWhatsappLink && (
          <Typography
            variant="bt"
            className="mt-4 text-center text-[#7A3D2A] md:text-sm"
          >
            Add the PetroVis WhatsApp invite URL in this page before publishing
            the button.
          </Typography>
        )}
      </div>
    </section>
  );
}
