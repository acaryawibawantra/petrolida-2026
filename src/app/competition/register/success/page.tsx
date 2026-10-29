"use client";

import Button from "@/components/buttons/button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { useGetCompetitionNameById } from "@/hooks/use-competition";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event");

  // Fetch competition name by event_id
  const { data: competitionData, isLoading } = useGetCompetitionNameById(
    eventId || "",
  );

  const competitionName = competitionData?.data?.name || "Competition";

  return (
    <section className="grid min-h-screen lg:grid-cols-2">
      <div className="col-span-1 overflow-hidden lg:h-screen">
        {/* Desktop Background */}
        <NextImage
          src={"/competition/form-kiri.png"}
          width={720}
          height={1024}
          imgClassName="object-cover w-full h-full object-top"
          className="hidden lg:block lg:h-screen w-full"
          alt="Competition Registration"
          quality={100}
        />
        {/* Mobile Background */}
        <NextImage
          src={"/competition/form-mobile.png"}
          width={500}
          height={312}
          imgClassName="object-cover w-full h-full"
          className="block lg:hidden max-lg:h-[500px] max-md:!h-[302px] w-full"
          alt="Competition Registration Mobile"
          quality={100}
        />
      </div>
      <div className="relative col-span-1">
        <div className="relative lg:h-screen lg:overflow-y-scroll flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Typography variant="p" className="text-gray-600">
                Loading...
              </Typography>
            </div>
          ) : (
            <div className="flex flex-col gap-8 px-6 py-12 w-full max-w-md">
              {/* Logo */}
              <div className="flex justify-center">
                <NextImage
                  src="/logo-new.png"
                  width={200}
                  height={200}
                  alt="Petrolida Logo"
                  className="w-32 h-auto"
                />
              </div>

              <div className="text-center space-y-3">
                <Typography
                  variant="h2"
                  weight="bold"
                  className="text-gray-900 text-3xl"
                >
                  Registration Complete
                </Typography>
                <Typography
                  variant="p"
                  className="text-gray-600 text-base leading-relaxed"
                >
                  Thank you for registering for {competitionName}. Your
                  registration has been successfully submitted and is now being
                  processed.
                </Typography>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* WhatsApp group link is available in the dashboard */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Typography
                    variant="p"
                    className="text-blue-800 text-center text-sm leading-relaxed"
                  >
                    The WhatsApp group link for your competition is available in
                    your dashboard. Please visit your dashboard to access it.
                  </Typography>
                </div>

                {/* Dashboard Button */}
                <Link href="/competition/dashboard/user" className="block">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3.5 text-base"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </div>

              {/* Next Steps */}
              <div className="text-center pt-4 space-y-2">
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-gray-700 text-sm"
                >
                  Next Steps
                </Typography>
                <Typography
                  variant="p"
                  className="text-gray-500 text-sm leading-relaxed"
                >
                  Please complete your payment through the dashboard to finalize
                  your registration. Once verified, you'll receive access to all
                  competition materials and updates.
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CompetitionSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="grid min-h-screen lg:grid-cols-2">
          <div className="col-span-1 overflow-hidden lg:h-screen">
            <NextImage
              src={"/competition/form-kiri.png"}
              width={720}
              height={1024}
              imgClassName="object-cover w-full h-full object-top"
              className="hidden lg:block lg:h-screen w-full"
              alt="Competition Registration"
              quality={100}
            />
            <NextImage
              src={"/competition/form-mobile.png"}
              width={500}
              height={312}
              imgClassName="object-cover w-full h-full"
              className="block lg:hidden max-lg:h-[500px] max-md:!h-[302px] w-full"
              alt="Competition Registration Mobile"
              quality={100}
            />
          </div>
          <div className="relative col-span-1 flex items-center justify-center">
            <Typography variant="p">Loading...</Typography>
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
