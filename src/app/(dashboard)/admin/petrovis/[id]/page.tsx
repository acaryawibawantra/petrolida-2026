"use client";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePetrovisDetail } from "@/hooks/use-petrovis-admin";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  GraduationCap,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Petrovis Registrations", href: "/admin/petrovis" },
  { name: "Detail", href: "#" },
];

export default function PetrovisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = usePetrovisDetail(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-between">
          <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
            Loading...
          </Typography>
          <BreadcrumbGroup items={BREADCRUMBS} />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-between">
          <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
            Registration Not Found
          </Typography>
          <BreadcrumbGroup items={BREADCRUMBS} />
        </div>
        <Link href="/admin/petrovis">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      paid: "default",
      verified: "default",
      pending: "secondary",
      cancelled: "destructive",
    };

    return (
      <Badge
        variant={variants[normalizedStatus] || "secondary"}
        className="text-sm"
      >
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Petrovis Registration Detail
        </Typography>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>

      <Link href="/admin/petrovis">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Registration Information</span>
            {getStatusBadge(data.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <User className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{data.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{data.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">SPE Organization</p>
              <p className="font-medium">{data.spe || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Institution</p>
              <p className="font-medium">{data.institution}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GraduationCap className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{data.department}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GraduationCap className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Batch</p>
              <p className="font-medium">{data.batch}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Student ID Number</p>
              <p className="font-medium">{data.student_id_number}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{data.phone_number}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="mt-1 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Student ID Card</p>
              <a
                href={data.student_id_card}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                View Document
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">
              Motivation for Joining Company Visit
            </p>
            <p className="font-medium">
              {data.motivation_joining_company_visit}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Have you ever participated in a company visit?
              </p>
              <p className="font-medium">
                {data.have_you_ever_participated_company_visit ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                How did you hear about this event?
              </p>
              <p className="font-medium">{data.how_did_hear_this_event}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
