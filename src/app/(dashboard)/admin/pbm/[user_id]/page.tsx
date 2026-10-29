"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import BreadcrumbGroup from "@/components/breadcrumb";
import Typography from "@/components/typography";

import { useGetDetailRegistrantPBM } from "@/hooks/use-pbm";
import RegistrantDetails from "./container/registrant-details";

export default function Page({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = React.use(params);
  // const [page, setPage] = React.useState(0);

  const { detailData, isLoading } = useGetDetailRegistrantPBM(user_id);

  const BREADCRUMBS = [
    { name: "Dashboard", href: "/admin" },
    { name: "Registrant PBM", href: "/admin/pbm" },
    { name: "Details", href: `/admin/pbm/${user_id}` },
  ];

  // Loading state
  if (isLoading) {
    return (
      <section className="flex h-96 items-center justify-center">
        <Typography variant="p" className="text-default-600">
          Loading registrant details...
        </Typography>
      </section>
    );
  }

  // Error state
  if (!detailData?.success || !detailData?.data) {
    return (
      <section className="flex h-96 items-center justify-center">
        <Typography variant="p" className="text-danger-500">
          Failed to load registrant details
        </Typography>
      </section>
    );
  }

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/admin/pbm">
          <div className="cursor-pointer rounded-full bg-default-300 p-4 transition duration-100 hover:bg-default-500">
            <ArrowLeft />
          </div>
        </Link>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>

      {/* Registrant detail */}
      <RegistrantDetails data={detailData} />
    </section>
  );
}
