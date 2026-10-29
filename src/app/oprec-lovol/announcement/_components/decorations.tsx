import NextImage from "@/components/next-image";

export default function Decorations() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <NextImage
        src="/announc-lovol/decor-lovol.svg"
        width={1575}
        height={1051}
        alt="decor"
        className="w-full h-full hidden md:block"
        imgClassName="w-full h-full object-cover object-right-top xl:object-top"
        style={{ objectPosition: "right top" }}
      />

      <NextImage
        src="/announc-lovol/decor-pink-mobile.svg"
        width={777}
        height={915}
        alt="decor"
        className="w-full h-full md:hidden"
        imgClassName="w-full h-full object-cover object-right-top xl:object-top"
        style={{ objectPosition: "right top" }}
      />
      <NextImage
        src="/announc-lovol/text-interview.svg"
        width={548}
        height={72}
        alt="INTERVIEW"
        className="hidden md:block absolute xl:top-[15%] md:top-[23%] max-xl:rotate-[8deg] md:right-[25%] xl:right-[50%]"
      />

      <NextImage
        src="/announc-lovol/lovol.svg"
        width={731}
        height={580}
        alt="Lovol"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
      />
      <NextImage
        src="/announc-lovol/announc-mobile.svg"
        width={437}
        height={343}
        alt="Lovol"
        className="absolute md:hidden top-[25%] w-full"
      />
    </div>
  );
}
