"use client";

import { useGetDivision } from "@/hooks/use-master-data";
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
import { useMediaQuery } from "react-responsive";

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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { useExportOprec } from "@/hooks/use-oprec-staff";
import api from "@/lib/api";

type TableOprecStaff = {
  id: string;
  name: string;
  major: string;
  student_id: string;
  faculty: string;
  department: string;
  primary_division: string;
  secondary_division: string;
  status: "pending" | "interviewed" | "accepted" | "rejected";
  email: string;
};

interface OprecTableHookProps {
  paramList?: {
    page?: number;
    take?: number;
    sort?: string;
    sort_by?: string;
    filter?: string;
    filter_by?: string;
  };
}

export default function DataTableOprec() {
  const { exportToExcel, exportToCSV, isExportingExcel, isExportingCSV } =
    useExportOprec();

  const getData = async ({ paramList }: OprecTableHookProps) => {
    const response = await api.get("/api/v1/oprec-staff", {
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
    subdivision_value: string;
  }>({
    name_value: "",
    subdivision_value: "",
  });
  const [debouncedNameValue, setDebouncedNameValue] = React.useState<string>(
    filterValue.name_value,
  );
  const [_filterBy, _setFilterBy] = React.useState("name,subdivision");
  const [datas, setData] = React.useState<TableOprecStaff[]>();
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

  // Handle the Select change directly in state
  const handleSubdivisionChange = (newSubdivision: string) => {
    setFilterValue((prev) => ({
      ...prev,
      subdivision_value: newSubdivision,
    }));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue((prev) => ({
      ...prev,
      name_value: event.target.value,
    }));
  };

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (
        filterValue.name_value.length >= 3 ||
        filterValue.name_value.length === 0
      ) {
        setDebouncedNameValue(filterValue.name_value);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filterValue.name_value]);

  React.useEffect(() => {
    const getDatas = async (param: object) => {
      const res = await getData(param);
      const dtRes = res.data == null ? undefined : res.data;
      setMeta(dtRes?.meta || {});
      setData(dtRes?.data || []);
      setIsLoading(false);
    };

    const sortingHandler =
      sorting.length == 0 ? "" : sorting[0].desc ? "desc" : "asc";
    const sortingByHandler = sorting.length == 0 ? "" : sorting[0].id || "";

    const debounceApiCall = setTimeout(() => {
      if (debouncedNameValue.length >= 3 || debouncedNameValue.length === 0) {
        getDatas({
          paramList: {
            page: page,
            take: rowsPerPage,
            sort: sortingHandler !== "" ? sortingHandler : sort,
            sort_by: sortingByHandler !== "" ? sortingByHandler : sortBy,
            filter: `${debouncedNameValue},${filterValue.subdivision_value}`,
            filter_by: "name,subdivision",
          },
        });
      }
    }, 500);

    return () => {
      setIsLoading(true);
      clearTimeout(debounceApiCall);
    };
  }, [
    debouncedNameValue,
    filterValue.subdivision_value,
    rowsPerPage,
    page,
    sort,
    sortBy,
    sorting,
  ]);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const columns = React.useMemo<ColumnDef<TableOprecStaff>[]>(
    () =>
      isMobile
        ? [
            {
              header: "Registrant Info",
              cell: ({ row }) => {
                return (
                  <div className="grid grid-cols-3">
                    <div className="col-span-1">
                      <p className="font-medium">Name</p>
                      <p className="font-medium">Student Id</p>
                      <p className="font-medium">Faculty</p>
                      <p className="font-medium">Department</p>
                      <p className="font-medium">Primary</p>
                      <p className="font-medium">Secondary</p>
                      <p className="font-medium">Status</p>
                    </div>
                    <div className="col-span-2">
                      <p>: {row.original.name}</p>
                      <p>: {row.original.student_id}</p>
                      <p>: {row.original.faculty}</p>
                      <p>: {row.original.department}</p>
                      <p>: {row.original.primary_division}</p>
                      <p>: {row.original.secondary_division}</p>
                      <p>
                        :
                        <Badge
                          className="ml-1"
                          variant={
                            row.original.status === "pending"
                              ? "secondary"
                              : row.original.status == "interviewed"
                                ? "primary"
                                : row.original.status == "accepted"
                                  ? "success"
                                  : "destructive"
                          }
                        >
                          {row.original.status == "pending"
                            ? "Pending"
                            : row.original.status == "interviewed"
                              ? "Interviewed"
                              : row.original.status == "accepted"
                                ? "Accepted"
                                : "Rejected"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                );
              },
            },
            {
              header: "Action",
              accessorKey: "id",
              cell: (info) => (
                <Link
                  href={("/admin/oprec-staff/" + info.renderValue()) as string}
                >
                  <Button variant="ghost" size="sm" className="!text-sm">
                    View Detail
                  </Button>
                </Link>
              ),
            },
          ]
        : [
            {
              header: "No",
              cell: (info) => info.row.index + 1,
            },
            {
              header: "Name",
              accessorKey: "name",
            },
            {
              header: "NRP",
              accessorKey: "student_id",
            },
            {
              header: "Faculty",
              accessorKey: "faculty",
            },
            {
              header: "Department",
              accessorKey: "department",
            },
            {
              header: "Primary",
              accessorKey: "primary_division",
            },
            {
              header: "Secondary",
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
                    status.getValue() == "pending"
                      ? "secondary"
                      : status.getValue() == "interviewed"
                        ? "primary"
                        : status.getValue() == "accepted"
                          ? "success"
                          : "destructive"
                  }
                >
                  {status.getValue() == "pending"
                    ? "Pending"
                    : status.getValue() == "interviewed"
                      ? "Interviewed"
                      : status.getValue() == "accepted"
                        ? "Accepted"
                        : "Rejected"}
                </Badge>
              ),
            },
            {
              header: "Action",
              accessorKey: "id",
              cell: (info) => (
                <Link
                  href={("/admin/oprec-staff/" + info.renderValue()) as string}
                >
                  <Button variant="ghost" size="sm" className="!text-sm">
                    View Detail
                  </Button>
                </Link>
              ),
            },
          ],
    [isMobile],
  );

  const { divisionList: SUBDIVITION } = useGetDivision();

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

            <div className="grow xl:w-[300px] xl:grow-0">
              <Select
                value={filterValue.subdivision_value}
                onValueChange={handleSubdivisionChange}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={" "}>All</SelectItem>
                  {SUBDIVITION?.map((e) => (
                    <SelectGroup key={e.id}>
                      <SelectLabel>{e.division}</SelectLabel>
                      {e.subdivisions.map((e) => (
                        <SelectItem key={e.id} value={e.name}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
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
                        <TableCell key={cell.id}>
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
            {meta.total_page == 0 ? 0 : page} of {meta.total_page} total page
          </div>
          <div className="space-x-2">
            <Button
              variant={page == 1 ? "disabled" : "primary"}
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page == 1}
            >
              Previous
            </Button>
            <Button
              variant={
                page == meta.total_page || meta.total_page == 0
                  ? "disabled"
                  : "primary"
              }
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page == meta.total_page || meta.total_page == 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
