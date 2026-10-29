"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useExportLovol } from "@/hooks/use-lovol";
import api from "@/lib/api";

type TableLovol = {
  id: string;
  name: string;
  student_id: string;
  major: string;
  primary_division: string;
  secondary_division: string;
  status: string;
  detail: string;
};

interface LovolTableHookProps {
  paramList?: {
    page?: number;
    take?: number;
    sort?: string;
    sort_by?: string;
    filter?: string;
    filter_by?: string;
  };
}

export default function DataTableLovol() {
  const { exportToExcel, exportToCSV, isExportingExcel, isExportingCSV } =
    useExportLovol();

  const getData = async ({ paramList }: LovolTableHookProps) => {
    const response = await api.get("/api/v1/oprec-lovol", {
      params: paramList,
    });
    return response;
  };

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sort, _setSort] = React.useState("asc");
  const [sortBy, _setSortBy] = React.useState("created_at");
  const [filterValue, setFilterValue] = React.useState<{
    name_value: string;
  }>({
    name_value: "",
  });
  const [debouncedNameValue, setDebouncedNameValue] = React.useState<string>(
    filterValue.name_value,
  );
  // const [_filterBy, _setFilterBy] = React.useState("name");
  const [datas, setData] = React.useState<TableLovol[]>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [meta, setMeta] = React.useState({
    take: 0,
    page: 0,
    sort: "",
    filter: "",
    filter_by: "",
    total: 0,
    total_page: 0,
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue((prev) => ({
      ...prev,
      name_value: event.target.value,
    }));
  };

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNameValue(filterValue.name_value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filterValue.name_value]);

  // Reset page when search term or rows per page changes
  React.useEffect(() => {
    setPage(1);
  }, [debouncedNameValue, rowsPerPage]);

  React.useEffect(() => {
    const getDatas = async (param: object) => {
      setIsLoading(true);
      try {
        const res = await getData(param);

        const dtRes = res.data;

        // Handle potential nested structure
        let metaData = dtRes?.meta;
        let listData = dtRes?.data;

        // API returns meta as array [{ ... }], extract first element
        if (Array.isArray(metaData) && metaData.length > 0) {
          metaData = metaData[0];
        }

        if (!metaData && dtRes?.data?.meta) {
          const nestedMeta = dtRes.data.meta;
          metaData =
            Array.isArray(nestedMeta) && nestedMeta.length > 0
              ? nestedMeta[0]
              : nestedMeta;
          listData = dtRes.data.data;
        }

        // Extract total count - API uses total_data
        const totalCount =
          metaData?.total_data ?? metaData?.total ?? metaData?.count ?? 0;

        // Calculate total pages client-side based on actual rowsPerPage
        const calculatedTotalPage =
          totalCount > 0 ? Math.ceil(totalCount / rowsPerPage) : 1;

        setMeta({
          take: metaData?.take ?? rowsPerPage,
          page: metaData?.page ?? page,
          sort: metaData?.sort ?? "",
          filter: metaData?.filter ?? "",
          filter_by: metaData?.filter_by ?? "",
          total: totalCount,
          total_page: calculatedTotalPage,
        });
        setData(listData || []);
      } catch (error) {
        console.error("Error fetching lovol data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const sortingHandler =
      sorting.length === 0 ? "" : sorting[0].desc ? "desc" : "asc";
    const sortingByHandler = sorting.length === 0 ? "" : sorting[0].id || "";

    getDatas({
      paramList: {
        page: page,
        take: rowsPerPage,
        sort: sortingHandler !== "" ? sortingHandler : sort,
        sort_by: sortingByHandler !== "" ? sortingByHandler : sortBy,
        filter: debouncedNameValue,
        filter_by: "name",
      },
    });
  }, [debouncedNameValue, rowsPerPage, page, sort, sortBy, sorting]);

  const columns = React.useMemo<ColumnDef<TableLovol>[]>(
    () => [
      {
        header: "No",
        cell: (info) => (page - 1) * rowsPerPage + info.row.index + 1,
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Student ID",
        accessorKey: "student_id",
      },
      {
        header: "Major",
        accessorKey: "major",
      },
      {
        header: "Primary Division",
        accessorKey: "primary_division",
      },
      {
        header: "Secondary Division",
        accessorKey: "secondary_division",
      },
      {
        header: ({ column }) => {
          return (
            <Button
              variant="disabled"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              size="sm"
              className="bg-default-50/20 !text-sm text-default-800"
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        accessorKey: "status",
        cell: (status) => (
          <Badge
            variant={
              status.getValue() == "rejected"
                ? "destructive"
                : status.getValue() == "interviewed"
                  ? "primary"
                  : status.getValue() == "accepted"
                    ? "success"
                    : "secondary"
            }
          >
            {status.getValue() == "rejected"
              ? "Rejected"
              : status.getValue() == "interviewed"
                ? "Interviewed"
                : status.getValue() == "accepted"
                  ? "Accepted"
                  : "Unverified"}
          </Badge>
        ),
      },
      {
        header: "Detail",
        accessorKey: "id",
        cell: (info) => (
          <Link href={("/admin/lovol/" + info.renderValue()) as string}>
            <Button variant="ghost" size="sm" className="!text-sm">
              View Detail
            </Button>
          </Link>
        ),
      },
    ],
    [page, rowsPerPage],
  );

  const data = datas || [];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="mt-9 w-full max-lg:mt-0">
        <div className="flex items-center justify-between gap-3 py-4 max-xl:flex-col">
          <Input
            placeholder="Find name"
            value={filterValue.name_value}
            onChange={handleNameChange}
            className="xl:max-w-sm"
          />
          <div className="flex w-full justify-end gap-3">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isExportingExcel || isExportingCSV}
                >
                  {isExportingExcel || isExportingCSV ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => exportToExcel()}
                  disabled={isExportingExcel}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  {isExportingExcel ? "Exporting..." : "Export to Excel"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportToCSV()}
                  disabled={isExportingCSV}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isExportingCSV ? "Exporting..." : "Export to CSV"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="grow xl:w-[200px] xl:grow-0">
              <Select
                value={`${rowsPerPage}`}
                onValueChange={(e) => {
                  setRowsPerPage(Number(e));
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder={rowsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((e) => (
                    <SelectItem key={e} value={`${e}`}>
                      {e} Entries
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
                    {headerGroup.headers.map((header) => {
                      return (
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
                      );
                    })}
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
            {meta.total_page === 0 || meta.total_page === undefined ? 0 : page}{" "}
            of {meta.total_page ?? 0} total page
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
                page === meta.total_page ||
                meta.total_page === 0 ||
                meta.total_page === undefined
                  ? "disabled"
                  : "primary"
              }
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={
                page === meta.total_page ||
                meta.total_page === 0 ||
                meta.total_page === undefined
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
