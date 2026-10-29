"use client";

import Button from "@/components/buttons/button";
import ButtonLink from "@/components/links/button-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import useCartStore from "@/stores/use-cart-store";
import { Check, CircleCheck, ClipboardCopy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SuccessContent() {
  const [isCopied, setIsCopied] = useState(false);
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  // Ambil code (sementara pakai nama code dulu tergantung nanti), kalo gaada maka "-"
  const orderCode = searchParams.get("code") || "-";

  // Clear cart on successful checkout
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderCode);
    setIsCopied(true);
  };

  return (
    <section className="bg-[#7EA13F] relative w-full min-h-screen flex justify-center items-center py-10 overflow-hidden">
      <NextImage
        src="/merchandise/flower-green.svg"
        width={1020}
        height={985}
        alt="decoration"
        className="absolute left-0 bottom-0 w-[300px] sm:w-[400px] md:w-[600px]"
      />
      <NextImage
        src="/merchandise/flower-right-green.svg"
        width={750}
        height={724}
        alt="decoration"
        className="absolute right-0 top-0 2xl:w-[750px] w-[400px] sm:w-[500px] md:w-[600px]"
      />
      <NextImage
        src="/merchandise/decor-left-green.svg"
        width={177}
        height={224}
        alt="decoration"
        className="absolute left-[5%] top-[10%] hidden lg:block"
      />
      <NextImage
        src="/merchandise/decor-right-green.svg"
        width={308}
        height={518}
        alt="decoration"
        className="absolute right-[10%] bottom-0 hidden lg:block"
      />

      <div className="relative z-10 px-6 w-full flex flex-col items-center justify-center max-w-3xl">
        <div className="bg-white rounded-[41px] md:rounded-[49px] px-6 py-8 sm:p-8 w-full flex flex-col items-center relative overflow-visible mb-6 shadow-xl">
          <NextImage
            src="/merchandise/penjepit-kertas.svg"
            width={114}
            height={154}
            alt="clip"
            className="absolute -top-[5%] -left-[2%] md:-top-[10%] md:-left-[4%] z-20 w-[60px] md:w-[114px]"
          />

          <CircleCheck
            size={327}
            color="#749338"
            strokeWidth={1}
            className="mb-4 md:mb-6 w-[140px] h-[140px] md:w-[240px] md:h-[240px] 2xl:w-[270px] 2xl:h-[270px]"
          />

          <Typography
            font="Helvetica"
            variant="h2"
            weight="bold"
            className="text-[#749338] mb-2 text-center text-2xl sm:text-3xl md:text-5xl"
          >
            PAYMENT SUCCESS
          </Typography>

          <Typography
            font="Helvetica"
            variant="h2"
            weight="bold"
            className="text-[#5A722C] mb-6 text-center max-[500px]:text-base text-xl sm:text-2xl md:text-3xl uppercase"
          >
            HERE’S YOUR ORDER CODE
          </Typography>

          <div className="flex items-stretch gap-3 w-full max-w-lg mb-4">
            <div className="flex-1 border-[3px] border-dashed border-[#5A722C] rounded-2xl p-3 md:p-4 flex items-center justify-center bg-[#F8FAF5]">
              <Typography
                font="Helvetica"
                variant="h3"
                weight="bold"
                className="text-[#00452D] text-lg sm:text-xl md:text-3xl tracking-wider text-center break-all"
              >
                {orderCode}
              </Typography>
            </div>

            <Button
              onClick={handleCopy}
              variant="success"
              className={`
                  text-white rounded-2xl transition-all duration-300 shrink-0 aspect-square h-auto flex items-center justify-center px-4 md:px-5
                  ${
                    isCopied
                      ? "bg-[#749338] hover:bg-[#749338] cursor-default"
                      : "bg-[#99B465] hover:bg-[#8da85a]"
                  }
                `}
              aria-label="ClipboardCopy Order Code"
            >
              {isCopied ? (
                <Check className="w-6 h-6 md:w-8 md:h-8 animate-in zoom-in duration-300" />
              ) : (
                <ClipboardCopy className="w-6 h-6 md:w-8 md:h-8" />
              )}
            </Button>
          </div>

          <Typography
            font="Helvetica"
            variant="p"
            className="text-[#E94759] text-center text-xs sm:text-sm md:text-base"
          >
            *Make sure you <span className="font-bold">COPY & SAVE</span> your
            order code!!!
          </Typography>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4">
          <ButtonLink
            size="lg"
            // sementara gini route e
            href={`/merch/track-order?code=${orderCode}`}
            variant="outline"
            className="bg-[#99B465]/60 border-[#F9C313] border-2 w-full py-4 rounded-xl shadow-lg hover:bg-[#99B465]"
          >
            <Typography
              font="Helvetica"
              variant="h5"
              weight="medium"
              className="text-[#F9C313]"
            >
              View Order
            </Typography>
          </ButtonLink>

          <ButtonLink
            size="lg"
            href="/merch"
            variant="yellow"
            className="w-full py-4 rounded-xl shadow-lg bg-[#F9C313] hover:bg-[#e0af10] text-white border-0"
          >
            <Typography
              font="Helvetica"
              variant="h5"
              weight="medium"
              className="text-white"
            >
              Continue Shopping
            </Typography>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
