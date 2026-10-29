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
import { MerchOrder } from "@/hooks/use-merch-orders";
// Re-using pbm export hook if appropriate, or create new if endpoints differ.
// Assuming "exportToExcel" etc logic is generic or needs adaption.
// For now, I'll assume we might need new export logic or just generic placeholder if backend support isn't explicit yet.
// But user asked for "integrasikan dengan baik", so if no export endpoint provided, I will keep UI but disable or use generic.
// actually user didn't provide export endpoint. I'll mock or reuse PBM hook if compatible (unlikely for different data).
// I will comment out export functionality implementation details/hook usage to avoid errors, keeping UI elements.
import api from "@/lib/api";

interface MerchOrdersTableHookProps {
  paramList?: {
    page?: number;
    take?: number;
    sort?: string;
    sort_by?: string;
    filter?: string; // name
    status?: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "warning" },
  paid: { label: "Paid", color: "success" },
  shipped: { label: "Shipped", color: "info" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Canceled", color: "danger" },
  success: { label: "Success", color: "success" },
};

export default function DataTableMerchOrders() {
  const [isExportingExcel, _setIsExportingExcel] = React.useState(false);
  const [isExportingCSV, _setIsExportingCSV] = React.useState(false);

  // API call
  const getData = async ({ paramList }: MerchOrdersTableHookProps) => {
    const params = {
      ...paramList,
      limit: paramList?.take,
    };
    delete params.take;

    const response = await api.get("/api/v1/transactions", {
      params,
    });
    return response;
  };

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sort, _setSort] = React.useState("desc");
  const [sortBy, _setSortBy] = React.useState("created_at");
  const [filterValue, setFilterValue] = React.useState<{
    name_value: string;
    status: string;
  }>({
    name_value: "",
    status: "all",
  });
  const [debouncedNameValue, setDebouncedNameValue] = React.useState<string>(
    filterValue.name_value,
  );

  const [datas, setData] = React.useState<MerchOrder[]>();
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

  const handleStatusChange = (val: string) => {
    setFilterValue((prev) => ({
      ...prev,
      status: val,
    }));
    setPage(1);
  };

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNameValue(filterValue.name_value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filterValue.name_value]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedNameValue, rowsPerPage]);

  React.useEffect(() => {
    const getDatas = async (param: object) => {
      setIsLoading(true);
      try {
        const res = await getData(param);
        const dtRes = res.data;

        const listData = dtRes?.data || [];
        // Handle array meta or object meta
        let metaData = dtRes?.meta;
        if (Array.isArray(metaData)) {
          metaData = metaData[0];
        }

        const totalCount =
          metaData?.total_data ?? metaData?.total ?? metaData?.count ?? 0;

        setMeta({
          take: metaData?.take ?? rowsPerPage,
          page: metaData?.page ?? page,
          sort: metaData?.sort ?? "",
          filter: metaData?.filter ?? "",
          filter_by: metaData?.filter_by ?? "",
          total: totalCount,
          total_page:
            metaData?.total_page ?? Math.ceil(totalCount / rowsPerPage),
        });

        setData(listData);
      } catch (error) {
        console.error("Error fetching merch orders data:", error);
        setData([]);
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
        status: filterValue.status !== "all" ? filterValue.status : undefined,
      },
    });
  }, [
    debouncedNameValue,
    rowsPerPage,
    page,
    sort,
    sortBy,
    sorting,
    filterValue.status,
  ]);

  const columns = React.useMemo<ColumnDef<MerchOrder>[]>(
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
        header: "Item",
        accessorKey: "item",
        cell: (info) => (
          <div className="w-[150px] truncate" title={info.getValue() as string}>
            {(info.getValue() as string) || "-"}
          </div>
        ),
      },
      {
        header: "Total Price",
        accessorKey: "total_price",
        cell: (info) => `Rp ${Number(info.getValue()).toLocaleString("id-ID")}`,
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
        cell: (info) => {
          const status = info.getValue() as string;
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
          return (
            <Badge
              variant={config.color as any}
              className="capitalize text-white"
            >
              {config.label}
            </Badge>
          );
        },
      },
      {
        header: "Detail",
        accessorKey: "id",
        cell: (info) => (
          <Link href={`/admin/merch/orders/${info.renderValue()}`}>
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
            placeholder="search order by name"
            value={filterValue.name_value}
            onChange={handleNameChange}
            className="xl:max-w-sm"
          />
          <div className="flex w-full flex-wrap justify-end gap-3 xl:flex-nowrap">
            {/* Status Filter */}
            <div className="w-[180px]">
              <Select
                value={filterValue.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  onClick={() => {
                    // TODO: Implement Excel export
                  }}
                  disabled={isExportingExcel}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // TODO: Implement CSV export
                  }}
                  disabled={isExportingCSV}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export to CSV
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
                        <TableCell
                          key={cell.id}
                          className="whitespace-nowrap text-center"
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
