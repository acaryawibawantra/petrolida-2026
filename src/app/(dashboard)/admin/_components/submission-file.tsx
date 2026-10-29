import { Eye } from "lucide-react";
import Link from "next/link";

import Typography from "@/components/typography";
import { cn } from "@/lib/utils";

export default function SubmissionFile({
  SubmissionData,
}: {
  SubmissionData: { [key: string]: string };
}) {
  return (
    <section>
      <div
        className={cn(
          "grid grid-cols-1 gap-x-8 gap-y-4 rounded-xl px-8 py-6 pt-8 shadow-[0_4px_4px_rgba(0,0,0,0.25)] md:grid-cols-2 md:gap-y-8",
          !SubmissionData && "hidden",
        )}
      >
        {SubmissionData &&
          Object.keys(SubmissionData).map((x, i) => {
            return (
              <div className="space-y-2" key={i}>
                <Typography
                  variant="p"
                  weight="semibold"
                  className="capitalize text-black"
                >
                  {x.split("_").join(" ")}
                </Typography>

                <Link href={SubmissionData[x]} target="_blank">
                  <div
                    className="flex w-full cursor-pointer items-center justify-center space-x-3 rounded-xl bg-default-100 py-3 transition-all duration-200 hover:bg-default-200"
                    // onClick={() => {
                    //   setPage(page);
                    //   setOpenPreview(true);
                    //   setIndex(1);
                    // }}
                  >
                    <Eye className="text-default-800" />
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-default-800"
                    >
                      View file
                    </Typography>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </section>
  );
}
