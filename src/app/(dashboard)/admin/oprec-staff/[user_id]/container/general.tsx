import Typography from "@/components/typography";

import { DetailResponse } from "@/hooks/use-oprec-staff";

export default function General({ data }: { data: DetailResponse }) {
  const { data: detail } = data;

  return (
    <div className="space-y-10 rounded-xl px-8 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between lg:space-x-5">
        <Typography
          variant="p"
          weight="medium"
          className="w-[50%] text-justify text-default-800 font-semibold"
        >
          Please tell us what do you know about PETROLIDA?
        </Typography>
        <div className="w-[50%]">
          <Typography
            variant="p"
            weight="medium"
            className="break-words text-justify text-default-900"
          >
            {detail.about_petrolida}
          </Typography>
        </div>
      </div>

      <div className="flex justify-between lg:space-x-5">
        <Typography
          variant="p"
          weight="medium"
          className="w-[50%] text-justify text-default-800 font-semibold"
        >
          Primary Division Choice
        </Typography>
        <div className="w-[50%]">
          <Typography
            variant="p"
            weight="medium"
            className="break-words text-justify text-default-900"
          >
            {detail.primary_division}
          </Typography>
        </div>
      </div>

      <div className="flex justify-between lg:space-x-5">
        <Typography
          variant="p"
          weight="medium"
          className="w-[50%] text-justify text-default-800 font-semibold"
        >
          Secondary Division Choice
        </Typography>
        <div className="w-[50%]">
          <Typography
            variant="p"
            weight="medium"
            className="break-words text-justify text-default-900"
          >
            {detail.secondary_division}
          </Typography>
        </div>
      </div>
    </div>
  );
}
