"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
// import * as React from "react";

import BreadcrumbGroup from "@/components/breadcrumb";

import MerchItemsDetail from "./merch-items-details";

export default function Page() {
  const BREADCRUMBS = [
    { name: "Dashboard", href: "/admin" },
    { name: "Merch Items", href: "/admin/merch-items" },
    { name: "Details", href: "/admin/merch-items/${merch_id}" },
  ];

  // // Loading state
  // if (isLoading) {
  //   return (
  //     <section className="flex h-96 items-center justify-center">
  //       <Typography variant="p" className="text-default-600">
  //         Loading merch items details...
  //       </Typography>
  //     </section>
  //   );
  // }

  // // Error state
  // if (!detailData?.success || !detailData?.data) {
  //   return (
  //     <section className="flex h-96 items-center justify-center">
  //       <Typography variant="p" className="text-danger-500">
  //         Failed to load merch items details
  //       </Typography>
  //     </section>
  //   );
  // }

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/admin/merch-items">
          <div className="cursor-pointer rounded-full bg-default-300 p-4 transition duration-100 hover:bg-default-500">
            <ArrowLeft />
          </div>
        </Link>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>

      {/* Merch items detail */}
      <MerchItemsDetail />
    </section>
  );
}
