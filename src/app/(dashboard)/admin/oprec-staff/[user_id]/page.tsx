"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";

import { useGetDetailRegistrant } from "@/hooks/use-oprec-staff";
import Detail from "./container/detail-form";
import Document from "./container/document-form";
import General from "./container/general";
import RegistrantDetails from "./container/registrant-details";

export default function Page({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = React.use(params);
  const [page, setPage] = React.useState(0);

  const { detailData, isLoading } = useGetDetailRegistrant(user_id);

  const BREADCRUMBS = [
    { name: "Dashboard", href: "/admin" },
    { name: "Registrant Staff", href: "/admin/oprec-staff" },
    { name: "Details", href: `/admin/oprec-staff/${user_id}` },
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

  const TAB_ITEMS = [
    { id: 0, label: "General", hasData: true },
    { id: 1, label: "Primary Division", hasData: true },
    { id: 2, label: "Secondary Division", hasData: true },
    { id: 3, label: "Documents", hasData: true },
  ];

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/admin/oprec-staff">
          <div className="cursor-pointer rounded-full bg-default-300 p-4 transition duration-100 hover:bg-default-500">
            <ArrowLeft />
          </div>
        </Link>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>

      {/* Registrant detail */}
      <RegistrantDetails data={detailData} />

      {/* Tab Navigation */}
      <div className="flex items-center space-x-3 overflow-x-auto">
        {TAB_ITEMS.map((item) => (
          <Button
            key={item.id}
            variant={page === item.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPage(item.id)}
            className="whitespace-nowrap"
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {page === 0 && <General data={detailData} />}
        {page === 1 && <Detail data={detailData} type="primary" />}
        {page === 2 && <Detail data={detailData} type="secondary" />}
        {page === 3 && <Document data={detailData} />}
      </div>
    </section>
  );
}
