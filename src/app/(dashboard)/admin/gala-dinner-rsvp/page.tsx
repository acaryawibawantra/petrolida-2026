"use client";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetGalaDinnerRsvps } from "@/hooks/use-gala-dinner-rsvp";
import { GALA_DINNER_COMPETITION_OPTIONS } from "@/lib/gala-dinner-competition-options";
import {
  type GalaDinnerRsvp,
  exportGalaDinnerRsvps,
} from "@/services/gala-dinner-rsvp";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

const ALL_VALUE = "all";

export default function GalaDinnerRsvpAdminPage() {
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState(ALL_VALUE);
  const [competition, setCompetition] = useState(ALL_VALUE);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const filters: string[] = [];
  const filterBy: string[] = [];
  if (debouncedSearch) {
    filters.push(debouncedSearch);
    filterBy.push("search");
  }
  if (category !== ALL_VALUE) {
    filters.push(category);
    filterBy.push("category");
  }
  if (competition !== ALL_VALUE) {
    filters.push(competition);
    filterBy.push("competition");
  }

  const { data, isLoading } = useGetGalaDinnerRsvps({
    page,
    take,
    filter: filters.join(","),
    filter_by: filterBy.join(","),
  });

  const rows = (data?.data ?? []) as GalaDinnerRsvp[];
  const meta = data?.meta;
  const totalPage = meta?.total_page ?? 1;

  const handleExport = async () => {
    const blob = await exportGalaDinnerRsvps();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gala-dinner-rsvp.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const breadcrumbs = [
    { name: "Dashboard", href: "/admin" },
    { name: "Gala Dinner RSVP", href: "/admin/gala-dinner-rsvp" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start">
        <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
          Gala Dinner RSVP
        </Typography>
        <BreadcrumbGroup items={breadcrumbs} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total RSVP" value={meta?.total ?? rows.length} />
        <SummaryCard
          label="Attend"
          value={
            rows.filter((row) => row.attendance_confirmation === "attend")
              .length
          }
        />
        <SummaryCard
          label="Unable"
          value={
            rows.filter(
              (row) => row.attendance_confirmation === "unable_to_attend",
            ).length
          }
        />
      </div>

      <div className="flex flex-col gap-3 xl:flex-row">
        <Input
          placeholder="Search name, institution, or team..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="xl:max-w-sm"
        />
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="xl:w-[190px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Categories</SelectItem>
            <SelectItem value="delegates">Delegates</SelectItem>
            <SelectItem value="petrolida">Petrolida</SelectItem>
            <SelectItem value="spe">SPE</SelectItem>
            <SelectItem value="lovol">Lovol</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={competition}
          onValueChange={(value) => {
            setCompetition(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="xl:w-[170px]">
            <SelectValue placeholder="Competition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Competitions</SelectItem>
            {GALA_DINNER_COMPETITION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={`${take}`}
          onValueChange={(value) => {
            setTake(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="xl:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((value) => (
              <SelectItem key={value} value={`${value}`}>
                {value} Entries
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="gap-2 xl:ml-auto" onClick={handleExport}>
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <Table>
          <TableHeader className="bg-[#357182]">
            <TableRow>
              {[
                "No",
                "Full Name",
                "Participant Type",
                "Attendance",
                "Institution",
                "Competition",
                "Team",
                "Role",
                "Division",
                "Submitted At",
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
                <TableCell colSpan={10} className="h-24 text-center">
                  Loading RSVP...
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{(page - 1) * take + index + 1}</TableCell>
                  <TableCell className="min-w-[180px] font-semibold">
                    {row.full_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{toTitle(row.category)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.attendance_confirmation === "attend"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {row.attendance_confirmation === "attend"
                        ? "Attend"
                        : "Unable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[180px]">
                    {row.institution_or_university || "-"}
                  </TableCell>
                  <TableCell>{row.competition || "-"}</TableCell>
                  <TableCell>{row.team_name || "-"}</TableCell>
                  <TableCell>
                    {row.petrolida_role || row.spe_role || "-"}
                  </TableCell>
                  <TableCell>{row.petrolida_division || "-"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(row.created_at)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No RSVP found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="ghost"
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <Typography variant="p" className="text-sm text-gray-600">
          Page {page} of {totalPage}
        </Typography>
        <Button
          variant="ghost"
          disabled={page >= totalPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
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

function toTitle(value: string) {
  return value
    .replace("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
