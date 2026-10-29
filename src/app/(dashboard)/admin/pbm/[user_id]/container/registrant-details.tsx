"use client";

import Typography from "@/components/typography";
import { DetailResponse } from "@/hooks/use-pbm";
import { PanelLeftOpen } from "lucide-react";

export default function RegistrantDetails({ data }: { data: DetailResponse }) {
  const { data: detail } = data;

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start">
        <Typography variant="h2" weight="medium">
          Registrant Details
        </Typography>
      </div>

      <div className="grid gap-5 rounded-xl px-8 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:grid-cols-2 xl:grid-cols-2">
        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="bold"
            className="w-[40%] break-words text-default-800"
          >
            Name:
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="regular"
              className="break-words text-default-900"
            >
              {detail.name}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="bold"
            className="w-[40%] break-words text-default-800"
          >
            Batch:
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="regular"
              className="break-words text-default-900"
            >
              {detail.batch}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="bold"
            className="w-[40%] break-words text-default-800"
          >
            Email:
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="regular"
              className="break-words text-default-900"
            >
              {detail.email}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="bold"
            className="w-[40%] break-words text-default-800"
          >
            University / Institution:
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="regular"
              className="break-words text-default-900"
            >
              {detail.institution}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="bold"
            className="w-[40%] break-words text-default-800"
          >
            WhatsApp Number:
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="regular"
              className="break-words text-default-900"
            >
              {detail.phone_number}
            </Typography>
          </div>
        </div>
      </div>

      <div className="grid gap-5 rounded-xl px-8 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:grid-cols-1 xl:grid-cols-1">
        <div className="flex flex-col gap-2">
          <Typography
            variant="t"
            weight="bold"
            className="w-[40%] break-words text-default-800"
          >
            Proof of Instagram Follow
          </Typography>
          <a
            href={detail.follow_instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3 rounded-md bg-[#EFEFEF] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div className="flex justify-center items-center gap-2">
              <PanelLeftOpen />
              <Typography
                variant="p"
                weight="medium"
                className="w-[100%] break-words text-default-800"
              >
                Open File
              </Typography>
            </div>
          </a>
        </div>
      </div>

      <div className="grid gap-5 rounded-xl px-8 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:grid-cols-1 xl:grid-cols-1">
        <div className="flex flex-col gap-2">
          <Typography
            variant="t"
            weight="bold"
            className="w-[40%] break-words text-default-800"
          >
            Proof of TikTok Follow
          </Typography>
          <a
            href={detail.follow_tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3 rounded-md bg-[#EFEFEF] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div className="flex justify-center items-center gap-2">
              <PanelLeftOpen />
              <Typography
                variant="p"
                weight="medium"
                className="w-[100%] break-words text-default-800"
              >
                Open File
              </Typography>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
