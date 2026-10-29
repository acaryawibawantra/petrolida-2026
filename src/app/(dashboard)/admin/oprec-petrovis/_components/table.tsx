"use client";

import clsxm from "@/lib/clsxm";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { useExportPetrovis } from "../hooks/use-petrovis-admin";

type TablePetrovis = {
  id: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  batch: string;
  student_id_number: string;
  phone_number: string;
  motivation_joining_company_visit: string;
  have_you_ever_participated_company_visit: string;
  how_did_hear_this_event: string;
  proof_of_payment: string;
  student_id_card: string;
  created_at: string;
};

interface PetrovisTableHookProps {
  paramList?: {
    page?: number;
    take?: number;
    sort?: string;
    sort_by?: string;
    filter?: string;
    filter_by?: string;
  };
}

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DetailsSheet = ({ data }: { data: TablePetrovis }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <span className="sr-only">Open details</span>
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Applicant Details</SheetTitle>
          <SheetDescription>Full details for {data.name}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <Typography
              variant="h6"
              className="text-muted-foreground text-xs uppercase tracking-wider"
            >
              Personal Info
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Name
                </Typography>
                <Typography variant="p" className="text-sm">
                  {data.name}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Email
                </Typography>
                <Typography variant="p" className="text-sm break-all">
                  {data.email}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Phone
                </Typography>
                <Typography variant="p" className="text-sm">
                  {data.phone_number}
                </Typography>
              </div>
            </div>
          </div>

          <div className="space-y-1 mt-4">
            <Typography
              variant="h6"
              className="text-muted-foreground text-xs uppercase tracking-wider"
            >
              Academic
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Institution
                </Typography>
                <Typography variant="p" className="text-sm">
                  {data.institution}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Department
                </Typography>
                <Typography variant="p" className="text-sm">
                  {data.department}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Batch
                </Typography>
                <Typography variant="p" className="text-sm">
                  {data.batch}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  NIM/Student ID
                </Typography>
                <Typography variant="p" className="text-sm">
                  {data.student_id_number}
                </Typography>
              </div>
            </div>
          </div>

          <div className="space-y-1 mt-4">
            <Typography
              variant="h6"
              className="text-muted-foreground text-xs uppercase tracking-wider"
            >
              Application
            </Typography>
            <div className="space-y-3">
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Participation History
                </Typography>
                <Typography variant="p" className="text-sm">
                  {data.have_you_ever_participated_company_visit}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Found via
                </Typography>
                <Typography variant="p" className="text-sm">
                  {data.how_did_hear_this_event}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="font-semibold text-sm">
                  Motivation
                </Typography>
                <div className="p-3 bg-muted rounded-md mt-1">
                  <Typography
                    variant="p"
                    className="text-sm whitespace-pre-wrap"
                  >
                    {data.motivation_joining_company_visit}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1 mt-4">
            <Typography
              variant="h6"
              className="text-muted-foreground text-xs uppercase tracking-wider"
            >
              Documents
            </Typography>
            <div className="flex flex-col gap-2">
              {data.student_id_card && (
                <Link
                  href={data.student_id_card}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsxm(
                    "inline-flex items-center rounded-lg font-medium",
                    "focus:outline-none focus-visible:ring",
                    "shadow-sm transition-colors duration-75",
                    "min-h-[1.75rem] px-2 md:min-h-[2rem] text-xs md:text-sm", // size sm
                    "text-black border border-gray-300 hover:bg-slate-200", // variant outline
                    "w-full justify-start",
                  )}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Student ID Card
                </Link>
              )}
              {data.proof_of_payment && (
                <Link
                  href={data.proof_of_payment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsxm(
                    "inline-flex items-center rounded-lg font-medium",
                    "focus:outline-none focus-visible:ring",
                    "shadow-sm transition-colors duration-75",
                    "min-h-[1.75rem] px-2 md:min-h-[2rem] text-xs md:text-sm", // size sm
                    "text-black border border-gray-300 hover:bg-slate-200", // variant outline
                    "w-full justify-start",
                  )}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Proof of Payment
                </Link>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default function DataTablePetrovis() {
  const { exportToExcel, exportToCSV, isExportingExcel, isExportingCSV } =
    useExportPetrovis();

  const getData = async ({ paramList }: PetrovisTableHookProps) => {
    const response = await api.get("/api/v1/oprec-petrovis", {
      params: paramList,
    });
    return response;
  };

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sort, _setSort] = React.useState("desc");
  const [sortBy, _setSortBy] = React.useState("created_at");
  const [filterValue, setFilterValue] = React.useState<{
    name_value: string;
  }>({
    name_value: "",
  });
  const [debouncedNameValue, setDebouncedNameValue] = React.useState<string>(
    filterValue.name_value,
  );
  const [datas, setData] = React.useState<TablePetrovis[]>();
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
        console.error("Error fetching petrovis data:", error);
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

  const columns = React.useMemo<ColumnDef<TablePetrovis>[]>(
    () => [
      {
        header: "No",
        cell: (info) => (page - 1) * rowsPerPage + info.row.index + 1,
        size: 50,
      },
      {
        header: "Date",
        accessorKey: "created_at",
        cell: (info) => (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {formatDate(info.getValue() as string)}
          </span>
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium">{info.getValue() as string}</span>
            <span className="text-xs text-muted-foreground">
              {info.row.original.email}
            </span>
          </div>
        ),
      },
      {
        header: "Institution",
        accessorKey: "institution",
        cell: (info) => (
          <div className="flex flex-col max-w-[150px]">
            <span className="truncate" title={info.getValue() as string}>
              {info.getValue() as string}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {info.row.original.department}
            </span>
          </div>
        ),
      },
      {
        header: "Phone",
        accessorKey: "phone_number",
      },
      {
        header: "Files",
        id: "files",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {row.original.student_id_card && (
              <Link
                href={row.original.student_id_card}
                target="_blank"
                className="text-blue-500 hover:text-blue-700"
                title="ID Card"
              >
                <FileText size={16} />
              </Link>
            )}
            {row.original.proof_of_payment && (
              <Link
                href={row.original.proof_of_payment}
                target="_blank"
                className="text-green-500 hover:text-green-700"
                title="Payment Proof"
              >
                <FileText size={16} />
              </Link>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => <DetailsSheet data={row.original} />,
        size: 50,
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
            placeholder="Search by name..."
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
              <TableHeader className="bg-primary hover:bg-primary/95">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="text-primary-foreground text-center whitespace-nowrap h-10 font-bold"
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
                        <TableCell
                          key={cell.id}
                          className="whitespace-normal py-3"
                        >
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
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <Typography
              variant="p"
              className="text-center font-medium text-muted-foreground"
            >
              Loading data...
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
