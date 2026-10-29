import { RowData, Table } from "@tanstack/react-table";
import * as React from "react";

import { cn } from "@/lib/utils";
import { CircleX, Search as FiSearch } from "lucide-react";

type SearchProps<T extends RowData> = {
  table: Table<T>;
  placeholder?: string;
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
} & React.ComponentPropsWithoutRef<"div">;

export default function Search<T extends RowData>({
  className,
  table,
  placeholder = "Search",
  setPagination,
  ...rest
}: SearchProps<T>) {
  const [Search, setSearch] = React.useState("");

  const handleClearSearch = () => {
    table.setGlobalFilter("");
    setSearch("");
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(Search);
      setPagination((pre) => ({
        ...pre,
        pageIndex: 0,
      }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [Search, table, setPagination]);

  return (
    <div className={cn("relative mt-1 self-start", className)} {...rest}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FiSearch className="text-neutral-30 w-6 " />
      </div>
      <input
        type="text"
        value={Search ?? ""}
        onChange={(e) => {
          setSearch(String(e.target.value));
        }}
        className={cn(
          "rounded-lg py-2 pl-10 text-base transition duration-100 max-md:w-full border",
          "border-white-50 py-2.5 caret-gray-900 ",
          "placeholder:text-neutral-40",
          className,
          //   "caret-warmPaleTaupe-900"
        )}
        placeholder={placeholder}
      />
      {table.getState().globalFilter !== "" && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button type="button" onClick={handleClearSearch} className="p-1">
            <CircleX className="text-black-400 text-xl" />
          </button>
        </div>
      )}
    </div>
  );
}
