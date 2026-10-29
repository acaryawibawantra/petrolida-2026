import { House, ShoppingBag } from "lucide-react";
import Link from "next/link";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";

function SuccessRegistComponent() {
  return (
    <section className="grid h-full grid-cols-1 lg:grid-cols-2 lg:overflow-hidden">
      <div className="col-span-1 overflow-hidden lg:h-screen bg-primary-900">
        {/* Desktop Background */}
        <NextImage
          src={"/lovol/lovol-bg-desktop.png"}
          width={720}
          height={1024}
          imgClassName="object-cover w-full h-full"
          className="hidden lg:block lg:h-screen w-full"
          alt="Hero Desktop"
          priority
          quality={100}
        />

        {/* Mobile Background */}
        <NextImage
          src={"/lovol/lovol-bg-mobile.png"}
          width={500}
          height={312}
          imgClassName="object-cover w-full h-full"
          className="block lg:hidden max-lg:h-[500px] max-md:!h-[302px] w-full"
          alt="Hero Mobile"
          priority
          quality={100}
        />
      </div>
      <div className="col-span-1 flex min-h-screen items-center justify-center lg:h-screen">
        <div className="flex max-w-2xl flex-col items-center justify-center gap-6 px-6 py-12 text-center lg:px-8">
          <Typography
            variant="h2"
            font="Helvetica"
            weight="bold"
            className="text-[35px] font-bold text-center leading-none tracking-tighter"
          >
            Form has been Submitted!
          </Typography>
          <Typography
            weight="medium"
            variant="bt"
            font="Helvetica"
            className="text-center text-default-800"
          >
            Thank you for your submission! Let me look into that and get back to
            you. Explore more of what we offer by visiting our homepage or
            connecting with us on Instagram for the latest information and
            insights!
          </Typography>
          <hr className="my-2 h-[0.3px] w-full bg-default-700" />
          <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-3 sm:flex-row sm:gap-2">
            <Button
              variant="secondary"
              leftIcon={House}
              leftIconClassName="w-[20px] h-auto mr-2"
              size="md"
              className="w-full font-normal md:w-1/2"
            >
              <Link href="/">Back to Homepage</Link>
            </Button>
            <Button
              variant="secondary"
              className="w-full font-normal md:w-1/2 py-2"
              leftIcon={ShoppingBag}
              leftIconClassName="w-[20px] h-auto"
            >
              <Link href="/merch">Buy Petrolida's Merch</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuccessRegistComponent;
