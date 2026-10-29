"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";

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
import { useGetAllCompetitionTeams } from "@/hooks/use-competition";
import { getSalesTypeLabel } from "@/lib/competition-utils";
import type { CompetitionTeam } from "@/services/competition";

type CompetitionAdminTableProps = {
  competitionName?: string;
  eventId: string;
  slug: string;
};

export default function CompetitionAdminTable({
  eventId,
  slug,
}: CompetitionAdminTableProps) {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterValue, setFilterValue] = React.useState({
    search_value: "",
  });
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState(
    filterValue.search_value,
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data, isLoading } = useGetAllCompetitionTeams({
    page,
    limit: rowsPerPage,
    search: debouncedSearchValue,
    event_id: eventId,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue((prev) => ({
      ...prev,
      search_value: event.target.value,
    }));
  };

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(filterValue.search_value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filterValue.search_value]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearchValue, rowsPerPage, eventId]);

  const renderFinalPaymentBadge = React.useCallback((status?: string) => {
    if (!status) {
      return <span className="text-sm text-gray-400">-</span>;
    }

    const normalizedStatus = status.toLowerCase();
    const variant =
      normalizedStatus === "paid"
        ? "success"
        : normalizedStatus === "pending"
          ? "secondary"
          : normalizedStatus === "unpaid"
            ? "destructive"
            : "secondary";

    return (
      <Badge variant={variant}>
        {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
      </Badge>
    );
  }, []);

  const columns = React.useMemo<ColumnDef<CompetitionTeam>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: (info) => (page - 1) * rowsPerPage + info.row.index + 1,
      },
      {
        header: "Team Name",
        accessorKey: "team_name",
      },
      {
        header: "Institution",
        accessorKey: "university",
      },
      {
        header: "Team Leader",
        accessorKey: "leader_name",
      },
      {
        header: ({ column }) => (
          <Button
            variant="disabled"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size="sm"
            className="bg-default-50/20 !text-sm text-default-800"
          >
            Stage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        accessorKey: "stage",
        cell: (stage) => (
          <Badge variant="primary">
            {String(stage.getValue()).charAt(0).toUpperCase() +
              String(stage.getValue()).slice(1)}
          </Badge>
        ),
      },
      {
        header: ({ column }) => (
          <Button
            variant="disabled"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size="sm"
            className="bg-default-50/20 !text-sm text-default-800"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        accessorKey: "status",
        cell: (status) => (
          <Badge
            variant={
              status.getValue() == "verified"
                ? "success"
                : status.getValue() == "complete"
                  ? "primary"
                  : status.getValue() == "incomplete"
                    ? "destructive"
                    : "secondary"
            }
          >
            {String(status.getValue()).charAt(0).toUpperCase() +
              String(status.getValue()).slice(1)}
          </Badge>
        ),
      },
      {
        header: "Sales Type",
        accessorKey: "sale_type",
        cell: (salesType) => {
          const value = String(salesType.getValue() ?? "");
          if (!value) return "-";
          return <Badge variant="secondary">{getSalesTypeLabel(value)}</Badge>;
        },
      },
      {
        id: "final_stay",
        header: "Final Stay",
        cell: ({ row }) => {
          const team = row.original;
          const accommodationCount = team.accommodation_count ?? 0;
          const nonAccommodationCount = team.non_accommodation_count ?? 0;
          const participants = team.participants ?? [];

          return (
            <div className="min-w-[180px]">
              <Typography variant="p" className="text-sm font-semibold">
                {accommodationCount} accom / {nonAccommodationCount} non accom
              </Typography>
              {participants.length > 0 ? (
                <Typography variant="p" className="mt-1 text-xs text-gray-500">
                  {participants
                    .map(
                      (participant) =>
                        `${participant.name}: ${participant.final_accommodation_type?.replace("_", " ") ?? "non accom"}`,
                    )
                    .join(" | ")}
                </Typography>
              ) : null}
            </div>
          );
        },
      },
      {
        header: "Final Payment",
        accessorKey: "final_payment_status",
        cell: ({ row }) =>
          renderFinalPaymentBadge(row.original.final_payment_status),
      },
      {
        id: "submission_status",
        header: "Submission",
        cell: ({ row }) => {
          const submission = row.original.submission;
          if (!submission) {
            return <span className="text-sm text-gray-400">-</span>;
          }

          return (
            <div className="min-w-[160px] space-y-1">
              <Badge variant={submission.is_late ? "destructive" : "success"}>
                {submission.is_late ? "Late Submission" : "Submitted"}
              </Badge>
              {submission.is_late && submission.late_duration_text ? (
                <Typography variant="p" className="text-xs text-red-600">
                  {submission.late_duration_text}
                </Typography>
              ) : null}
            </div>
          );
        },
      },
      {
        id: "detail",
        header: "Detail",
        accessorKey: "id",
        cell: (info) => (
          <Link href={`/admin/competition/${slug}/${info.renderValue()}`}>
            <Button variant="ghost" size="sm" className="!text-sm">
              View Detail
            </Button>
          </Link>
        ),
      },
    ],
    [page, renderFinalPaymentBadge, rowsPerPage, slug],
  );

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  const totalPage = data?.meta.totalPage ?? 0;

  return (
    <div className="mt-9 w-full max-lg:mt-0">
      <div className="flex items-center justify-between gap-3 py-4 max-xl:flex-col">
        <Input
          placeholder="Search team name..."
          value={filterValue.search_value}
          onChange={handleSearchChange}
          className="xl:max-w-sm"
        />
        <div className="flex w-full justify-end gap-3">
          <div className="grow xl:w-[200px] xl:grow-0">
            <Select
              value={`${rowsPerPage}`}
              onValueChange={(value) => {
                setRowsPerPage(Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((value) => (
                  <SelectItem key={value} value={`${value}`}>
                    {value} Entries
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {!isLoading ? (
        <div className="rounded-xl border overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#357182]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-white text-center border-x-[1px] border-[#9D9D9D] whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-normal">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
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
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalPage === 0 ? 0 : page} of {totalPage} total page
        </div>
        <div className="space-x-2">
          <Button
            variant={page === 1 ? "disabled" : "primary"}
            size="sm"
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant={
              page === totalPage || totalPage === 0 ? "disabled" : "primary"
            }
            size="sm"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={page === totalPage || totalPage === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
