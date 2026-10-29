"use client";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useExportCityTourExcel,
  useGetCityTourRegistrants,
} from "@/hooks/use-city-tour";
import type { CityTourRegistration } from "@/services/city-tour";
import { Download } from "lucide-react";
import Link from "next/link";

export default function CityTourAdminPage() {
  const { data, isLoading } = useGetCityTourRegistrants();
  const { mutate: exportExcel, isPending: isExporting } =
    useExportCityTourExcel();
  const rows = (data?.data ?? []) as CityTourRegistration[];

  const totalAttendees = rows.reduce(
    (total, row) => total + (row.attending_member ?? 0),
    0,
  );
  const totalFee = rows.reduce((total, row) => total + (row.total_fee ?? 0), 0);
  const paidFee = rows
    .filter((row) => row.payment_status === "paid")
    .reduce((total, row) => total + (row.total_fee ?? 0), 0);
  const unpaidFee = totalFee - paidFee;

  const breadcrumbs = [
    { name: "Dashboard", href: "/admin" },
    { name: "City Tour", href: "/admin/city-tour" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          City Tour
        </Typography>
        <BreadcrumbGroup items={breadcrumbs} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Registrations" value={rows.length} />
        <SummaryCard label="Attendees" value={totalAttendees} />
        <SummaryCard label="Paid Fee" value={formatCurrency(paidFee)} />
        <SummaryCard label="Unpaid Fee" value={formatCurrency(unpaidFee)} />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => exportExcel()} disabled={isExporting}>
          <Download size={16} className="mr-2" />
          {isExporting ? "Exporting..." : "Export Excel"}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader className="bg-[#357182]">
            <TableRow>
              {[
                "Team",
                "PIC",
                "University",
                "Attendees",
                "Total Fee",
                "Payment",
                "Invoice",
                "Allergies",
                "Song Request",
              ].map((label) => (
                <TableHead key={label} className="whitespace-nowrap text-white">
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Loading city tour data...
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => <CityTourRow key={row.id} row={row} />)
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No city tour registration found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CityTourRow({ row }: { row: CityTourRegistration }) {
  return (
    <TableRow>
      <TableCell className="min-w-[180px] font-semibold">
        {row.competition_team_name || "-"}
      </TableCell>
      <TableCell className="min-w-[180px]">
        <div className="font-semibold">{row.name}</div>
        <div className="text-sm text-gray-500">{row.student_id || "-"}</div>
      </TableCell>
      <TableCell className="min-w-[180px]">{row.university}</TableCell>
      <TableCell className="min-w-[260px]">
        <div className="mb-2 font-semibold">
          {row.attending_member} person(s)
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          {row.attendees?.map((attendee) => (
            <div key={attendee.participant_id}>
              {attendee.participant_name} -{" "}
              {attendee.final_accommodation_type?.replace("_", " ") || "-"} -{" "}
              {formatCurrency(attendee.fee)}
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {formatCurrency(row.total_fee)}
      </TableCell>
      <TableCell>
        <PaymentBadge status={row.payment_status} />
      </TableCell>
      <TableCell className="min-w-[160px]">
        {row.invoice_url ? (
          <Link
            href={row.invoice_url}
            target="_blank"
            className="text-sm font-semibold text-primary-700 underline"
          >
            Open Invoice
          </Link>
        ) : (
          "-"
        )}
        {row.order_id ? (
          <div className="mt-1 text-xs text-gray-500">{row.order_id}</div>
        ) : null}
      </TableCell>
      <TableCell className="min-w-[160px]">
        {row.have_any_alergies || "-"}
      </TableCell>
      <TableCell className="min-w-[160px]">
        {row.any_song_request || "-"}
      </TableCell>
    </TableRow>
  );
}

function SummaryCard({
  label,
  value,
}: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Typography variant="p" className="text-sm text-gray-600">
        {label}
      </Typography>
      <Typography variant="h3" weight="bold" className="mt-2 text-primary-700">
        {value}
      </Typography>
    </div>
  );
}

function PaymentBadge({ status }: { status?: string }) {
  const normalized = status || "paid";
  const variant =
    normalized === "paid"
      ? "success"
      : normalized === "pending"
        ? "warning"
        : "secondary";

  return <Badge variant={variant}>{toTitle(normalized)}</Badge>;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function toTitle(value: string) {
  return value
    .replace("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
