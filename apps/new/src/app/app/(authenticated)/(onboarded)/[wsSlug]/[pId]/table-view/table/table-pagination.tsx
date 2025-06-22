import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@mapform/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mapform/ui/components/select";
import { cn } from "@mapform/lib/classnames";
import { useQueryStates } from "nuqs";
import { projectSearchParams, projectSearchParamsUrlKeys } from "../../params";

interface TablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function TablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: TablePaginationProps<TData>) {
  const [{ perPage, page }, setProjectSearchParams] = useQueryStates(
    projectSearchParams,
    {
      urlKeys: projectSearchParamsUrlKeys,
      shallow: false,
    },
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
        className,
      )}
      {...props}
    >
      <div className="text-muted-foreground flex-1 whitespace-nowrap text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              void setProjectSearchParams(
                {
                  perPage: Number(value),
                },
                {
                  shallow: false,
                },
              );
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => {
              void setProjectSearchParams(
                {
                  perPage,
                  page: 0,
                },
                {
                  shallow: false,
                },
              );
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="size-5" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => {
              void setProjectSearchParams(
                {
                  perPage,
                  page: page - 1,
                },
                {
                  shallow: false,
                },
              );
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => {
              void setProjectSearchParams(
                {
                  perPage,
                  page: page + 1,
                },
                {
                  shallow: false,
                },
              );
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-5" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => {
              void setProjectSearchParams(
                {
                  perPage,
                  page: table.getPageCount() - 1,
                },
                {
                  shallow: false,
                },
              );
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
