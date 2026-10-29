"use client";

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
import { usePetrovisList } from "@/hooks/use-petrovis-admin";
import type { PetrovisListItem } from "@/types/page/petrovis-registration";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PetrovisDataTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedInstitution, setDebouncedInstitution] = useState("");

  const { data, isLoading } = usePetrovisList({
    page,
    limit,
    name: debouncedName,
    institution: debouncedInstitution,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(name);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [name]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInstitution(institution);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [institution]);

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      paid: "default",
      verified: "default",
      pending: "secondary",
      cancelled: "destructive",
    };

    return (
      <Badge variant={variants[normalizedStatus] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const columns: ColumnDef<PetrovisListItem>[] = [
    {
      header: "No",
      cell: (info) => (page - 1) * limit + info.row.index + 1,
    },
    {
      header: "SPE Organization",
      accessorKey: "spe",
      cell: (info) => info.getValue<string>() || "-",
    },
    {
      header: "Registrant Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Institution",
      accessorKey: "institution",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => getStatusBadge(info.getValue() as string),
    },
    {
      header: "Detail",
      accessorKey: "id",
      cell: (info) => (
        <Link href={`/admin/petrovis/${info.getValue()}`}>
          <Button variant="ghost" size="sm" className="!text-sm">
            View Detail
          </Button>
        </Link>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-9 w-full max-lg:mt-0">
      <div className="flex items-center justify-between gap-3 py-4 max-xl:flex-col">
        <div className="grid w-full gap-3 xl:max-w-3xl xl:grid-cols-2">
          <Input
            placeholder="Search by registrant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Filter by institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-end gap-3">
          <div className="grow xl:w-[200px] xl:grow-0">
            <Select
              value={`${limit}`}
              onValueChange={(e) => setLimit(Number(e))}
            >
              <SelectTrigger>
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((entry) => (
                  <SelectItem key={entry} value={`${entry}`}>
                    {entry} Entries
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {!isLoading ? (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader className="bg-[#357182]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap border-x-[1px] border-[#9D9D9D] text-center text-white"
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
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
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
          {data?.meta.page || 0} of {data?.meta.total_page || 0} total page
        </div>
        <div className="space-x-2">
          <Button
            variant={page === 1 ? "disabled" : "primary"}
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant={
              page === data?.meta.total_page || !data?.meta.total_page
                ? "disabled"
                : "primary"
            }
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === data?.meta.total_page || !data?.meta.total_page}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
