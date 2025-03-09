"use client";

import { useMemo, memo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mapform/ui/components/table";
import { Checkbox } from "@mapform/ui/components/checkbox";
import { Button } from "@mapform/ui/components/button";
import type { GetDataset } from "@mapform/backend/data/datasets/get-dataset";
import { BoxIcon, CopyIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createRowAction } from "~/data/rows/create-row";
import { deleteRowsAction } from "~/data/rows/delete-rows";
import { duplicateRowsAction } from "~/data/rows/duplicate-rows";
import { ColumnAdder } from "./column-adder";
import { CellPopover } from "./cell-popover";
import { ColumnEditor } from "./column-editor";
import { toast } from "@mapform/ui/components/toaster";
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";

interface TableProps {
  dataset: NonNullable<GetDataset["data"]>;
}

const MemoizedColumnEditor = memo(ColumnEditor);

export const DataTable = function DataTable({ dataset }: TableProps) {
  const {
    execute: executeDeleteRows,
    status: statusDeleteRows,
    isPending: isPendingDeleteRows,
  } = useAction(deleteRowsAction);
  const {
    execute: executeDuplicateRows,
    status: statusDuplicateRows,
    isPending: isPendingDuplicateRows,
  } = useAction(duplicateRowsAction, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
        return;
      }
    },
  });
  const {
    execute: executeCreateRow,
    status: statusCreateRow,
    isPending: isPendingCreateRow,
  } = useAction(createRowAction, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
        return;
      }
    },
  });

  const columns = useMemo(() => {
    const sortedColumns = [...dataset.columns].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    return [
      {
        id: "select",
        size: 50,
        minSize: 50,
        maxSize: 50,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Not worth creating a workaround type
        header: ({ table }: any) => (
          <Checkbox
            aria-label="Select all"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(Boolean(value));
            }}
          />
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Not worth creating a workaround type
        cell: ({ row }: any) => (
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(Boolean(value));
            }}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...sortedColumns.map((column) => ({
        accessorKey: column.id,
        header: (
          <MemoizedColumnEditor
            columnId={column.id}
            columnName={column.name}
            columnType={column.type}
          />
        ),
      })),
      {
        id: "create-column",
        header: <ColumnAdder datasetId={dataset.id} />,
        enableSorting: false,
        enableHiding: false,
      },
    ];
  }, [dataset.columns, dataset.id]);

  const rows = useMemo(
    () =>
      dataset.rows.map((row) => {
        const rowCells = row.cells;

        return rowCells.reduce<
          Record<
            string,
            NonNullable<GetDataset["data"]>["rows"][number]["cells"][number]
          >
        >(
          // @ts-expect-error -- It's all gucci baby
          (acc, cell) => {
            return {
              ...acc,
              [cell.columnId]:
                cell.stringCell?.value ??
                cell.numberCell?.value ??
                cell.booleanCell?.value ??
                cell.richtextCell?.value ??
                cell.dateCell?.value ??
                cell.iconCell?.value ??
                (cell.pointCell && {
                  x: cell.pointCell.x,
                  y: cell.pointCell.y,
                }),
            };
          },
          {
            rowId: row.id,
          },
        );
      }),
    [dataset.rows],
  );

  usePreventPageUnload(
    isPendingCreateRow || isPendingDeleteRows || isPendingDuplicateRows,
  );

  const table = useReactTable({
    data: rows,
    // @ts-expect-error -- This is caused by not returning the headers from an
    // anonynous function above. Eg. header: () => <ColumnAdder
    // datasetId={dataset.id} /> However, returning from a function causes the
    // column headers to re-mount when data changes, causing the popovers to
    // close
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => {
      return row.rowId;
    },
    defaultColumn: {
      size: 200, //starting column size
      minSize: 200, //enforced during column resizing
      maxSize: 200, //enforced during column resizing
    },
  });

  const numberOfSelectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalNumberOfRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="relative flex flex-1 flex-col overflow-auto bg-white p-4 pt-0">
      {/* Top bar */}
      <div className="sticky left-0 top-0 z-20 mb-0 box-content flex h-8 flex-shrink-0 items-center gap-2 border-b bg-white pb-2 pt-4">
        {dataset.project ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground mr-4 flex items-center gap-1 text-sm">
                <BoxIcon className="size-4" />
                Submissions Database
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px]">
                Submissions will be logged here for your{" "}
                <strong>{dataset.project.name}</strong> project. This dataset
                cannot be deleted unless the project is deleted first.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
        <div className="text-muted-foreground text-sm">
          {numberOfSelectedRows} of {totalNumberOfRows} row(s) selected.
        </div>
        {numberOfSelectedRows > 0 ? (
          <>
            <Button
              disabled={statusDeleteRows === "executing"}
              onClick={() => {
                const selectedRowIds = table
                  .getFilteredSelectedRowModel()
                  .flatRows.map((row) => row.id);

                executeDeleteRows({
                  rowIds: selectedRowIds,
                });
              }}
              size="sm"
              variant="outline"
            >
              <Trash2Icon className="mr-2 size-4" /> Delete
            </Button>
            <Button
              disabled={statusDuplicateRows === "executing"}
              onClick={() => {
                const selectedRowIds = table
                  .getFilteredSelectedRowModel()
                  .flatRows.map((row) => row.id);

                executeDuplicateRows({
                  rowIds: selectedRowIds,
                });
              }}
              size="sm"
              variant="outline"
            >
              <CopyIcon className="mr-2 size-4" /> Duplicate
            </Button>
          </>
        ) : null}
      </div>
      <Table className="border-b">
        <TableHeader
          className="sticky top-[57px] z-10 bg-white"
          style={{
            boxShadow: "inset 0 -1px 0 #e5e7eb",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border-none" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="flex-grow-0 truncate"
                    key={header.id}
                    style={{
                      width: `${header.getSize()}px`,
                      minWidth: `${header.getSize()}px`,
                      maxWidth: `${header.getSize()}px`,
                    }}
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
        <TableBody className="overflow-auto">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                data-state={row.getIsSelected() && "selected"}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <CellPopover cell={cell} dataset={dataset} key={cell.id} />
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <button
        className="hover:bg-muted/50 sticky left-0 flex items-center p-2 text-left text-sm disabled:pointer-events-none disabled:opacity-50"
        disabled={statusCreateRow === "executing"}
        onClick={() => {
          executeCreateRow({ datasetId: dataset.id });
        }}
        type="button"
      >
        <PlusIcon className="mr-2 size-4" />
        Add row
      </button>
    </div>
  );
};
