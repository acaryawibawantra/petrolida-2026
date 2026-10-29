"use client";

import { BookText, Trophy } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Button from "@/components/buttons/button";
import withAuth from "@/components/hoc/with-auth";
import Typography from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function RegisterContent() {
  const searchParams = useSearchParams();
  const selectedComp = searchParams.get("comp");

  return (
    <section className="grid min-h-screen lg:grid-cols-2">
      <div className="col-span-1 overflow-hidden lg:h-screen">
        {/* Desktop Background */}
        <Image
          src={"/images/competition/form-kiri.png"}
          width={720}
          height={1024}
          className="hidden lg:block lg:h-screen w-full object-cover"
          alt="Competition Registration"
          quality={100}
        />

        {/* Mobile Background */}
        <Image
          src={"/images/competition/form-mobile.png"}
          width={500}
          height={312}
          className="block lg:hidden max-lg:h-[500px] max-md:!h-[302px] w-full"
          alt="Competition Registration Mobile"
          quality={100}
        />
      </div>

      <div className="col-span-1 grid h-full w-full place-items-center py-12 px-4 max-lg:px-6">
        <div className="flex max-w-[665px] flex-col items-center gap-4 text-center">
          <Typography variant="h2" weight="bold" className="text-gray-900">
            Join the Competition!
          </Typography>
          <Typography variant="p" className="text-xl text-gray-600">
            Register your team and showcase your skills in PETROLIDA 2025
            Competition. Choose your competition category and start your journey
            to excellence!
          </Typography>

          <Separator className="mt-4 mb-2" />

          <div className="mt-6 flex gap-3 max-md:flex-col md:gap-4 w-full justify-center">
            <Link href="/competition/register/form">
              <Button
                variant="secondary"
                size="lg"
                className="w-full gap-2 min-w-[200px]"
                leftIcon={Trophy}
                leftIconClassName="w-[20px] h-auto"
              >
                Register Your Team
              </Button>
            </Link>
            <Link
              target="_blank"
              href="https://petrolida.com/link/InvitationLetterComp2026"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 min-w-[200px] border-primary-500 text-primary-600 hover:bg-primary-50"
                leftIcon={BookText}
                leftIconClassName="w-[20px] h-auto"
              >
                Invitation Letter
              </Button>
            </Link>
          </div>

          {selectedComp && (
            <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-xl w-full">
              <Typography variant="p" className="text-primary-700">
                Selected Competition:{" "}
                <span className="font-semibold capitalize">
                  {selectedComp.replace(/-/g, " ")}
                </span>
              </Typography>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CompetitionRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Typography variant="p">Loading...</Typography>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

const CompetitionRegisterGuard = withAuth(CompetitionRegisterPage, "user");

export default CompetitionRegisterGuard;
