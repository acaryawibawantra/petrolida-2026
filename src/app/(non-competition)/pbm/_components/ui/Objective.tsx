import NextImage from "@/components/next-image";

export default function Objective() {
  return (
    <div className="relative min-h-screen w-full bg-[#9EB773] overflow-hidden py-20">
      {/* decoration */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <NextImage
          src={"/pbm/clouds-beneran-ob.svg"}
          width={1743}
          height={532}
          alt="Decor"
          className="w-full min-w-full h-[150px] md:h-auto object-cover object-bottom"
          style={{ minWidth: "100vw" }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <NextImage
          src={"/pbm/clouds-objective.svg"}
          width={2043}
          height={232}
          alt="Decor"
          className="w-full min-w-full h-auto object-cover"
          style={{ minWidth: "100vw" }}
        />
      </div>
      <NextImage
        src={"/pbm/oil-factory-1.svg"}
        width={322}
        height={356}
        alt="Decor"
        className="absolute top-0 left-0 z-0 w-[100px] md:w-[180px] lg:w-[250px] xl:w-[322px]"
      />
      <NextImage
        src={"/pbm/oil-factory-2.svg"}
        width={302}
        height={556}
        alt="Decor"
        className="absolute -top-4 md:-top-8 right-0 z-0 w-[90px] md:w-[160px] lg:w-[240px] xl:w-[302px]"
      />

      {/* main content */}
      <div className="relative z-20 flex flex-col gap-10 md:gap-16 justify-center items-center w-full px-6">
        <NextImage
          src={"/pbm/objective-title.svg"}
          width={451}
          height={151}
          alt="Objective Title"
          className="w-[250px] md:w-[350px] lg:w-[451px] h-auto"
        />

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center justify-center">
          <NextImage
            src={"/pbm/ob-1.svg"}
            width={351}
            height={301}
            alt="Objective 1"
            className="w-[280px] md:w-[300px] xl:w-[351px] h-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
          />

          <NextImage
            src={"/pbm/ob-2.svg"}
            width={351}
            height={301}
            alt="Objective 2"
            className="w-[280px] md:w-[300px] xl:w-[351px] h-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
          />

          <NextImage
            src={"/pbm/ob-3.svg"}
            width={351}
            height={301}
            alt="Objective 3"
            className="w-[280px] md:w-[300px] xl:w-[351px] h-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}
