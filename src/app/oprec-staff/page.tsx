"use client";

import { BookText, Newspaper } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import { Separator } from "@/components/ui/separator";

export default function OprecStaffPage() {
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  useEffect(() => {
    const deadline = new Date("2025-10-14T00:00:00+07:00");
    const now = new Date();

    setIsRegistrationClosed(now >= deadline);
  }, []);

  return (
    <section className="grid min-h-screen lg:grid-cols-2">
      <div className="col-span-1 overflow-hidden lg:h-screen">
        {/* Desktop Background */}
        <NextImage
          src={"/oprec-staff/oprec-bg-desktop.png"}
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
          src={"/oprec-staff/oprec-bg-mobile.png"}
          width={500}
          height={312}
          imgClassName="object-cover w-full h-full"
          className="block lg:hidden max-lg:h-[500px] max-md:!h-[312px] w-full"
          alt="Hero Mobile"
          priority
          quality={100}
        />
      </div>
      <div className="col-span-1 grid h-full w-full place-items-center py-6 px-4 max-lg:px-4 max-md:pb-12">
        <div className="flex max-w-[665px] flex-col items-center gap-2 text-center">
          <h2 className="text-[35px] font-bold">
            {isRegistrationClosed
              ? "Registration Closed"
              : "Be a Part of Something Big!"}
          </h2>
          <p className="text-xl text-[#7A7A7A]">
            {isRegistrationClosed
              ? "Thank you for your interest! The registration period for PETROLIDA 2026 Staff has ended. Stay tuned for future opportunities!"
              : "Unlock incredible opportunities and make lasting memories by joining our dynamic team. Your chance to shine and make an impact starts here!"}
          </p>
          <Separator className="mt-4" />
          <div className="mt-[38px] flex gap-3 max-md:flex-col md:gap-3 w-full justify-center">
            {isRegistrationClosed ? (
              <Link
                target="_blank"
                href={
                  "https://petrolida.com/link/GUIDEBOOKOPRECSTAFFPETROLIDA2026"
                }
              >
                <Button
                  variant="secondary"
                  className="w-full gap-2"
                  leftIcon={BookText}
                  leftIconClassName="w-[20px] h-auto"
                >
                  Guide Book
                </Button>
              </Link>
            ) : (
              <>
                <Link href={"/oprec-staff/form"}>
                  <Button
                    variant="secondary"
                    className="w-full gap-2"
                    leftIcon={Newspaper}
                    leftIconClassName="w-[20px] h-auto"
                  >
                    Register Yourself
                  </Button>
                </Link>
                <Link
                  target="_blank"
                  href={
                    "https://petrolida.com/link/GUIDEBOOKOPRECSTAFFPETROLIDA2026"
                  }
                >
                  <Button
                    variant="secondary"
                    className="w-full gap-2"
                    leftIcon={BookText}
                    leftIconClassName="w-[20px] h-auto"
                  >
                    Guide Book
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
