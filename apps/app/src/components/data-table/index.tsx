"use client";

import { useMemo } from "react";
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
import {
  BoxIcon,
  CopyIcon,
  LinkIcon,
  LockIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createRowAction } from "~/data/rows/create-row";
import { deleteRowsAction } from "~/data/rows/delete-rows";
import { duplicateRowsAction } from "~/data/rows/duplicate-rows";
import { ColumnAdder } from "./column-adder";
import { CellPopover } from "./cell-popover";
import { ColumnEditor } from "./column-editor";
import { toast } from "@mapform/ui/components/toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";

interface TableProps {
  dataset: NonNullable<GetDataset["data"]>;
}

export const DataTable = function DataTable({ dataset }: TableProps) {
  const { execute: executeDeleteRows, status: statusDeleteRows } =
    useAction(deleteRowsAction);
  const { execute: executeDuplicateRows, status: statusDuplicateRows } =
    useAction(duplicateRowsAction, {
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
  const { execute: executeCreateRow, status: statusCreateRow } = useAction(
    createRowAction,
    {
      onError: ({ error }) => {
        if (error.serverError) {
          toast({
            title: "Uh oh! Something went wrong.",
            description: error.serverError,
          });
          return;
        }
      },
    },
  );
  const columns = useMemo(() => getColumns(dataset), [dataset]);
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

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => {
      return row.rowId;
    },
  });

  const numberOfSelectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalNumberOfRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="relative flex flex-1 flex-col overflow-auto bg-white p-4 pt-0">
      {/* Top bar */}
      <div className="sticky top-0 z-20 -mb-1 box-content flex h-8 flex-shrink-0 items-center gap-2 border-b bg-white pb-2 pt-4">
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
          className="sticky top-[53px] z-10 bg-white"
          style={{
            boxShadow: "inset 0 -1px 0 #e5e7eb",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border-none" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="truncate" key={header.id}>
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

const getColumns = (dataset: NonNullable<GetDataset["data"]>) => {
  return [
    {
      id: "select",
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
    ...dataset.columns
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((column) => {
        return {
          accessorKey: column.id,
          header: () => (
            <ColumnEditor
              columnId={column.id}
              columnName={column.name}
              columnType={column.type}
            />
          ),
        };
      }),

    // Add column
    {
      id: "create-column",
      header: () => <ColumnAdder datasetId={dataset.id} />,
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
