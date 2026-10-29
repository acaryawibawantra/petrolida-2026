import NextImage from "@/components/next-image";
import Typography from "@/components/typography";

export default function PBM() {
  return (
    <div className="relative min-h-[50vh] md:min-h-screen w-full bg-[#9EB773] overflow-visible py-16 md:py-20">
      <NextImage
        src={"/pbm/clover-top-desc.svg"}
        width={144}
        height={144}
        alt="Decor"
        className="absolute top-4 left-4 w-[80px] md:top-0 md:left-[10%] md:w-[144px]
        "
      />

      <NextImage
        src={"/pbm/clover-left-desx.svg"}
        width={250}
        height={250}
        alt="Decor"
        className="absolute -left-8 bottom-0 w-[100px] md:-left-5 md:bottom-6 md:w-[130px] xl:left-0 xl:bottom-[20%] xl:w-[250px] z-20
        "
      />

      <NextImage
        src={"/pbm/clover-right.svg"}
        width={252}
        height={252}
        alt="Decor"
        className="absolute -top-10 right-0 w-[150px] md:-top-[15%] md:right-10 md:w-[252px] z-0
        "
      />

      <NextImage
        src={"/pbm/fuel.svg"}
        width={446}
        height={156}
        alt="Decor"
        className=" hidden lg:block absolute right-0 top-[34%] md:w-[320px] xl:top-[28%] xl:w-[446px] z-20
        "
      />

      {/* main content */}
      <div className="relative z-10 w-full px-6 md:px-12 max-w-5xl xl:max-w-[90rem] mx-auto flex flex-col gap-8 md:gap-16 items-center text-justify mt-8 md:mt-20">
        <div className="relative scale-90 md:scale-100 xl:scale-125 mb-8 md:mb-14 xl:mb-24">
          <NextImage
            src={"/pbm/title-desc-decor.svg"}
            width={349}
            height={144}
            alt="Decor"
            className="
              absolute -z-10 -left-4 -top-4 w-[200px] md:-left-6 md:-top-6 md:w-[349px]
            "
          />
          <NextImage
            src={"/pbm/what-is-pbm.svg"}
            width={489}
            height={124}
            alt="What is PBM"
            className="relative z-10 w-[260px] md:w-[489px]"
          />
        </div>
        <div
          className="
            relative w-full max-w-5xl mx-auto flex flex-col gap-4 md:gap-6 z-10 px-6 py-8 md:px-10 md:py-12 xl:px-16 xl:py-10
          "
        >
          <div className="absolute inset-0 bg-white -z-10 shadow-2xl"></div>

          <Typography
            variant="h6"
            weight="medium"
            className="text-xs md:text-base lg:text-lg xl:text-xl leading-loose md:leading-relaxed xl:leading-loose text-[#425F44]"
          >
            Petrolida Benchmarking and Management{" "}
            <span className="font-bold">
              (PBM) is a premier online symposium hosted by PETROLIDA 2026
            </span>
            , serving as the official pre-event before the competition series
            begins. As a stepping stone for curious delegates, PBM provides{" "}
            <span className="font-bold">
              an early platform to explore, learn, and engage with the oil and
              gas industry before entering the main competition.
            </span>
          </Typography>

          <Typography
            variant="h6"
            weight="medium"
            className="text-xs md:text-base lg:text-lg xl:text-xl leading-loose md:leading-relaxed xl:leading-loose text-[#425F44]"
          >
            The event features four volumes, divided into two segments: PBM Vol.
            1 and Vol. 2, where industry professionals share their expertise,
            experiences, and insights directly with students, creating a space
            for inspiration and learning from real-world leaders; and the Power
            Up Series Vol. 1 and Vol. 2, which focus on student-to-student
            sharing sessions, allowing participants to exchange perspectives,
            tips, and strategies for the upcoming competitions.
          </Typography>
        </div>
      </div>
    </div>
  );
}
