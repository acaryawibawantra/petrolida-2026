"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AxiosError, AxiosResponse } from "axios";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { serialize } from "object-to-formdata";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import { FormShortLinkSchema } from "@/validation/shortlink";
import { toast } from "sonner";

export type TableShortLink = {
  id: string;
  name: string;
  original_link: string;
  shorten_link: string;
  visited: number;
};

function normalizeShortLinkPreview(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface LinkTableHookProps {
  paramList?: {
    page?: number;
    take?: number;
    sort?: string;
    sort_by?: string;
    filter?: string;
    filter_by?: string;
  };
}

export function DataTableShortLink() {
  // Create Short Link
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormShortLinkSchema>>({
    mode: "onBlur",
    resolver: zodResolver(FormShortLinkSchema),
    defaultValues: {},
  });
  function onSubmit(data: z.infer<typeof FormShortLinkSchema>) {
    const payload = {
      ...data,
    };
    handleCreateShortlink(serialize(payload));
  }

  const { mutate: handleCreateShortlink } = useMutation<
    AxiosResponse<ApiResponse<TableShortLink>>,
    AxiosError<ApiError>,
    FormData
  >({
    mutationFn: async (data) => await api.post("/api/v1/link", data),
    onSuccess: () => {
      toast.success("Success To Create Short Link");
      router.push("/admin/shortlink");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message ?? "Please retry");
    },
  });

  // ======= GET PAGINATED SHORT LINK
  const [datas, setDatas] = React.useState<TableShortLink[]>();
  const [meta, setMeta] = React.useState({
    take: 0,
    page: 0,
    sort: "",
    filter: "",
    filter_by: "",
    total: 0,
    total_page: 0,
  });
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterValue, setFilterValue] = React.useState<{
    name_value: string;
  }>({
    name_value: "",
  });
  const [debouncedNameValue, setDebouncedNameValue] = React.useState<string>(
    filterValue.name_value,
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const getData = async ({ paramList }: LinkTableHookProps) => {
    const response = await api.get("/api/v1/link", {
      params: paramList,
    });

    return response;
  };

  // Handle name input change directly in state
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue((prev) => ({
      ...prev,
      name_value: event.target.value,
    }));
  };

  // Apply debouncing effect
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (
        filterValue.name_value.length >= 3 ||
        filterValue.name_value.length === 0
      ) {
        setDebouncedNameValue(filterValue.name_value);
      }
    }, 500); // 500ms debounce time

    // Clean up timeout if input changes before timeout finishes
    return () => {
      clearTimeout(handler);
    };
  }, [filterValue.name_value]);

  React.useEffect(() => {
    const getDatas = async (param: object) => {
      const res = await getData(param);
      const dtRes = res.data == null ? undefined : res.data;
      setMeta(dtRes?.meta || {});
      setDatas(dtRes?.data || []);
      setIsLoading(false);
    };

    const debounceApiCall = setTimeout(() => {
      if (debouncedNameValue.length >= 3 || debouncedNameValue.length === 0) {
        getDatas({
          paramList: {
            page: page,
            take: rowsPerPage,
            sort: "asc",
            sort_by: "created_at",
            filter: `${debouncedNameValue}`,
            filter_by: "name",
          },
        });
      }
    }, 500);
    return () => {
      setIsLoading(true);
      clearTimeout(debounceApiCall);
    };
  }, [page, rowsPerPage, debouncedNameValue]);

  const data = datas || [];

  // ========= Delete Shortlink
  const { mutate: handleDeleteShortlink } = useMutation({
    mutationFn: async ({ shortlinkId }: { shortlinkId: string }) =>
      await api.delete(`/api/v1/link/${shortlinkId}`),
    onSuccess: () => {
      router.push("/admin/shortlink");
      toast.success("Success To Delete Short Link");
      queryClient.invalidateQueries({ queryKey: ["shortlinkId"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message ?? "Please retry");
    },
  });

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const columns = React.useMemo<ColumnDef<TableShortLink>[]>(
    () =>
      isMobile
        ? [
            {
              header: "Short Link",
              cell: ({ row }) => {
                return (
                  <>
                    <p>
                      <span className="font-bold">Name:</span>{" "}
                      {row.original.name}
                    </p>
                    <p>
                      <span className="font-bold">Original Link:</span>{" "}
                      {row.original.original_link}
                    </p>
                    <p>
                      <span className="font-bold">Shorten Link:</span>{" "}
                      petrolida.com/link/{row.original.shorten_link}
                    </p>
                    <p>
                      <span className="font-bold">Visited:</span>{" "}
                      {row.original.visited}
                    </p>
                  </>
                );
              },
            },
            {
              header: "Action",
              accessorKey: "id",
              cell: ({ row }) => {
                const data = row.original;
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="disabled"
                        className="h-8 w-8 p-0"
                        rightIcon={EllipsisVertical}
                      >
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/shortlink/${data.id}`}>Detail</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        color="danger"
                        onClick={() => {
                          handleDeleteShortlink({ shortlinkId: data.id });
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ]
        : [
            {
              header: "No",
              cell: (info) => info.row.index + 1,
              meta: { className: "hidden lg:flex" },
            },

            {
              header: "Name",
              accessorKey: "name",
            },
            {
              header: "Shorten Link",
              accessorKey: "shorten_link",
              cell: ({ row }) => {
                return <p>petrolida.com/link/{row.original.shorten_link}</p>;
              },
            },

            {
              header: "Original Link",
              accessorKey: "original_link",
            },
            {
              header: "Visited",
              accessorKey: "visited",
            },

            {
              header: "Action",
              accessorKey: "id",
              cell: ({ row }) => {
                const data = row.original;
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="disabled"
                        className="h-8 w-8 p-0"
                        rightIcon={EllipsisVertical}
                      >
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/shortlink/${data.id}`}>Detail</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        color="danger"
                        onClick={() => {
                          handleDeleteShortlink({ shortlinkId: data.id });
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ],
    [handleDeleteShortlink, isMobile],
  );

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
        {/* head */}
        <div className="flex flex-col items-start justify-start py-4 max-lg:w-full lg:flex-row lg:items-center lg:justify-between">
          <Input
            placeholder="Find name"
            value={filterValue.name_value}
            onChange={handleNameChange}
            className="xl:max-w-sm"
          />
          <div className="flex flex-col gap-3 max-lg:w-full lg:flex-row">
            <div className="mt-4 w-[200px] max-lg:w-full lg:mt-0">
              <Select
                value={`${rowsPerPage}`}
                onValueChange={(e) => {
                  setRowsPerPage(Number(e));
                }}
              >
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize} Entries
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="max-lg:w-full"
                  >
                    Create New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className=" max-w-xl space-y-6"
                    >
                      <DialogHeader>
                        <DialogTitle>Create new shortlink</DialogTitle>
                        <DialogDescription>
                          Simplify link sharing with a personalized shortlink.
                          Boost clicks and track performance
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Name <span className="text-red-600">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter shortlink name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="original_link"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Original Link{" "}
                                <span className="text-red-600">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter original link name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shorten_link"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Shorten Link{" "}
                                <span className="text-red-600">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="flex items-center rounded-md border px-3 py-3">
                                  <Typography variant="p" className="!text-sm">
                                    Petrolida.com/link/
                                  </Typography>
                                  <Input
                                    className="ml-1 h-auto border-none p-0 focus-visible:ring-0"
                                    placeholder="Enter shorten link name"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <Typography
                                variant="p"
                                className="text-xs text-gray-500"
                              >
                                Auto-sanitized. Space becomes `-`, special chars
                                removed.
                              </Typography>
                              {field.value ? (
                                <Typography
                                  variant="p"
                                  className="text-xs text-gray-600"
                                >
                                  Preview:{" "}
                                  <span className="font-semibold">
                                    {normalizeShortLinkPreview(field.value) ||
                                      "(empty after sanitize)"}
                                  </span>
                                </Typography>
                              ) : null}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          onClick={() => {
                            setOpen(false);
                          }}
                          type="submit"
                          size="sm"
                        >
                          Save changes
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        {/* table body */}
        {!isLoading ? (
          <div className="overflow-x-auto">
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
        {/* pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <br />
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
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
