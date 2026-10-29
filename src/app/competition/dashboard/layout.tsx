"use client";

import { AlignJustify } from "lucide-react";
import { Suspense } from "react";
import React from "react";

import withAuth from "@/components/hoc/with-auth";
import Typography from "@/components/typography";

import SidebarCompetition from "./_components/sidebar";

const CompetitionMiddleware = withAuth(DashboardCompetitionLayout, "user");

function DashboardCompetitionLayout({
  children,
}: { children: React.ReactNode }) {
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-[#192B33] w-full overflow-hidden">
      {/* Full Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat lg:hidden"
        style={{
          backgroundImage: "url('/images/login/bg-mobile-login.svg')",
        }}
      />

      <div
        className="fixed inset-0 z-0 hidden bg-cover bg-center bg-no-repeat lg:block"
        style={{
          backgroundImage: "url('/images/login/bg-desktop-login.svg')",
        }}
      />

      {/* Content */}
      <section className="relative z-10 grid grid-cols-12 gap-8 max-lg:grid-cols-none md:px-4 md:py-[60px] lg:px-10">
        {/* sidebar desktop */}
        <div className="sticky top-[60px] rounded-2xl bg-[#F4F4F5] px-4 py-8 max-lg:hidden md:col-span-5 xl:col-span-3">
          <SidebarCompetition setIsNavbarOpen={setIsNavbarOpen} />
        </div>
        {/* sidebar mobile */}
        {isNavbarOpen && (
          <div className="fixed inset-0 z-50 flex bg-black bg-opacity-40 lg:hidden">
            <div
              className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-[#F4F4F5] p-4 ${
                isNavbarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <SidebarCompetition setIsNavbarOpen={setIsNavbarOpen} />
            </div>
            <div
              className="flex-grow cursor-pointer"
              onClick={() => setIsNavbarOpen(false)}
            />
          </div>
        )}
        <div className="fixed left-0 right-0 top-0 z-40 flex h-12 w-full items-center justify-center bg-[#F4F4F5] px-4 lg:hidden">
          <AlignJustify onClick={() => setIsNavbarOpen((prev) => !prev)} />
          <Typography variant="p" className="w-full text-center font-bold">
            My Profile
          </Typography>
        </div>
        <div className="relative max-lg:mt-14 max-lg:p-6 md:col-span-7 xl:col-span-9 ">
          {children}
        </div>
      </section>
    </div>
  );
}

export default function CompetitionPage({
  children,
}: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center">
          <Typography
            variant="p"
            weight="medium"
            className="w-full text-center font-bold text-gray-300"
          >
            Load data
            <span className="dots"></span>
          </Typography>
        </div>
      }
    >
      <CompetitionMiddleware>{children}</CompetitionMiddleware>
    </Suspense>
  );
}
