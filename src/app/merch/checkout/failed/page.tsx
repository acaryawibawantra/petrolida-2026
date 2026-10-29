import ButtonLink from "@/components/links/button-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { XCircle } from "lucide-react";

export default function FailedCheckout() {
  return (
    <section className="bg-[#164453] relative w-full min-h-screen flex justify-center items-center">
      <NextImage
        src="/merchandise/flower-left-bottom.svg"
        width={1020}
        height={985}
        alt="decoration"
        className="absolute left-0 bottom-0 w-[300px] sm:w-[400px] md:w-[600px]"
      />

      <NextImage
        src="/merchandise/flower-right-top.svg"
        width={750}
        height={724}
        alt="decoration"
        className="absolute right-0 top-0 2xl:w-[750px] w-[400px] sm:w-[500px] md:w-[600px]"
      />

      <NextImage
        src="/merchandise/decor-left-top.svg"
        width={177}
        height={224}
        alt="decoration"
        className="absolute left-[5%] top-[10%] hidden lg:block"
      />

      <NextImage
        src="/merchandise/decor-right-bottom.svg"
        width={308}
        height={518}
        alt="decoration"
        className="absolute right-[10%] bottom-0 hidden lg:block"
      />

      <div className="relative z-10 px-8 w-full flex flex-col items-center justify-center max-w-[615px]">
        <div className="bg-white rounded-[41px] md:rounded-[49px] p-10 md:py-20 xl:py-12 2xl:py-20 w-full flex flex-col items-center relative overflow-visible mb-6 md:mb-0">
          <NextImage
            src="/merchandise/penjepit-kertas.svg"
            width={114}
            height={154}
            alt="clip"
            className="absolute -top-[10%] -left-[4%] z-20 w-[60px] md:w-[114px]"
          />

          <XCircle
            size={340}
            color="#BC425D"
            strokeWidth={1}
            className="mb-4 md:mb-8 w-[180px] h-[180px] md:w-[340px] md:h-[340px]"
          />

          <Typography
            font="Helvetica"
            variant="h2"
            weight="bold"
            className="text-[#BC425D] mb-5 text-center text-2xl sm:text-3xl md:text-5xl"
          >
            PAYMENT FAILED
          </Typography>

          {/* tombol desktop */}
          <div className="hidden md:flex flex-row justify-center gap-4 w-full mt-4">
            <ButtonLink
              // sementara gini route e (gatau bener apa ngga)
              href="/merchandise/checkout"
              size="lg"
              className="bg-[#BC4C5E] hover:bg-[#a03d4d]"
            >
              <Typography
                font="Helvetica"
                variant="h5"
                weight="medium"
                className="text-white px-4"
              >
                TRY AGAIN
              </Typography>
            </ButtonLink>

            <ButtonLink
              href="/merchandise"
              size="lg"
              className="bg-white border-[#BC4C5E] border-2 hover:bg-red-50"
            >
              <Typography
                font="Helvetica"
                variant="h5"
                weight="medium"
                className="text-[#BC4C5E] px-4"
              >
                RETURN
              </Typography>
            </ButtonLink>
          </div>
        </div>

        {/* tombol mobile */}
        <div className="flex md:hidden flex-col w-full gap-4 mt-2">
          <ButtonLink
            // sementara gini route e (gatau bener apa ngga)
            href="/merchandise/checkout"
            size="lg"
            className="bg-[#BC4C5E] hover:bg-[#a03d4d] w-full py-3 rounded-xl shadow-lg"
          >
            <Typography
              font="Helvetica"
              variant="h5"
              weight="medium"
              className="text-white"
            >
              TRY AGAIN
            </Typography>
          </ButtonLink>
          <ButtonLink
            // sementara gini route e (gatau bener apa ngga)
            href="/merchandise"
            size="lg"
            className="bg-[#C0D3D8]/80 border-[#BC4C5E] border-2 w-full py-3 rounded-xl shadow-lg hover:bg-[#889ea5]"
          >
            <Typography
              font="Helvetica"
              variant="h5"
              weight="medium"
              className="text-[#BC4C5E]"
            >
              RETURN
            </Typography>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
