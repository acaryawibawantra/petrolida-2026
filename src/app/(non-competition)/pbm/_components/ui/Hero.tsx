import ButtonLink from "@/components/links/button-link";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";

export default function Hero() {
  return (
    <div className="relative min-h-[80vh] md:min-h-screen w-full bg-[#96AD6D] overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:-bottom-8 w-[150%] md:w-full max-w-[1400px]">
        <NextImage
          src={"/pbm/curtain.svg"}
          width={1400}
          height={1500}
          alt="Decor"
          className="w-full h-auto object-cover opacity-90 md:opacity-100 animate-pulse"
        />
      </div>

      <NextImage
        src={"/pbm/clover-left.svg"}
        width={200}
        height={200}
        alt="Decor"
        className="absolute top-0 left-0 w-[100px] md:w-[160px] lg:w-[200px]"
      />

      <NextImage
        src={"/pbm/star-right.svg"}
        width={120}
        height={120}
        alt="Decor"
        className="absolute top-20 md:top-28 right-0 w-[60px] md:w-[90px] lg:w-[120px]"
      />

      <NextImage
        src={"/pbm/pita-kuning.svg"}
        width={282}
        height={71}
        alt="Decor"
        className="absolute bottom-24 md:bottom-28 left-0 w-[150px] md:w-[200px] lg:w-[282px]"
      />

      <NextImage
        src={"/pbm/black-dot.svg"}
        width={55}
        height={55}
        alt="Decor"
        className="hidden md:block absolute bottom-[12%] left-[17%]"
      />
      <div className="absolute z-10 flex flex-col gap-6 md:gap-8 items-center justify-center top-[35%] md:top-[40%] left-1/2 -translate-x-1/2 w-full px-6 md:px-12">
        <NextImage
          src={"/pbm/title-branding.svg"}
          width={804}
          height={122}
          alt="title"
          className="w-full max-w-[370px] md:max-w-[650px] lg:max-w-[750px] xl:max-w-[804px] h-auto drop-shadow-sm"
        />

        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <Typography
            variant="h6"
            className="text-center text-white font-[400] text-md sm:text-lg lg:text-xl max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl leading-relaxed"
          >
            Petrolida Benchmarking and Management, a premier event hosted online
            by PETROLIDA 2026, serves as a dynamic symposium that bridges the
            gap between local, international students and professionals in the
            oil and gas sector
          </Typography>

          <ButtonLink
            href="/pbm/register"
            variant="green"
            className="bg-[#244330] hover:bg-[#15271c] border-none py-2 px-6 md:py-[10px] md:px-[32px] mt-2 text-sm md:text-lg"
          >
            Register Now
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
