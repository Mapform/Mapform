/* eslint-disable react/no-unstable-nested-components */
"use client";

import { memo, useMemo } from "react";
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
import { CopyIcon, Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteRows } from "~/data/rows/delete-rows";
import { duplicateRows } from "~/data/rows/duplicate-rows";
import { COLUMN_ICONS } from "~/constants/column-icons";
import type { GetDataset } from "~/data/datasets/get-dataset";

interface TableProps {
  dataset: GetDataset;
}

export const DataTable = memo(function DataTable({ dataset }: TableProps) {
  const { execute: executeDeleteRows } = useAction(deleteRows);
  const { execute: executeDuplicateRows } = useAction(duplicateRows);
  const columns = useMemo(() => getColumns(dataset), [dataset]);
  const rows = useMemo(
    () =>
      dataset.rows.map((row) => {
        const rowCells = row.cells;

        return rowCells.reduce<
          Record<string, GetDataset["rows"][number]["cells"][number]>
        >((acc, cell) => {
          acc["rowId"] = row.id;
          acc[cell.columnId] =
            cell.stringCell?.value ??
            cell.numberCell?.value ??
            cell.booleanCell?.value ??
            cell.dateCell?.value ??
            (cell.pointCell && {
              x: cell.pointCell.x,
              y: cell.pointCell.y,
            });

          return acc;
        }, {});
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
    <div className="relative flex flex-1 flex-col overflow-auto p-4 pt-0">
      <Table>
        {/* Top bar */}
        {/* <div className="sticky-0 box-content flex h-8 items-center gap-2 border-b bg-white pb-2 pt-4">
          <div className="text-muted-foreground text-sm">
            {numberOfSelectedRows} of {totalNumberOfRows} row(s) selected.
          </div>
          {numberOfSelectedRows > 0 ? (
            <>
              <Button
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
        </div> */}
        <TableHeader className="sticky top-0 z-10 border-b bg-white">
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
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                data-state={row.getIsSelected() && "selected"}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
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
    </div>
  );
});

const getColumns = (dataset: GetDataset) => {
  return [
    {
      id: "select",
      header: ({ table }) => (
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
      cell: ({ row }) => (
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
    ...dataset.columns.map((column) => {
      const Icon = COLUMN_ICONS[column.type];

      return {
        accessorKey: column.id,
        header: () => (
          <span className="flex items-center gap-1.5">
            <Icon className="size-4" /> {column.name}
          </span>
        ),
        cell: (props) => {
          const value = props.getValue();

          if (column.type === "point") {
            const pointVal =
              value as GetDataset["rows"][number]["cells"][number]["pointCell"];

            if (!pointVal) {
              return null;
            }

            return (
              <span className="font-mono">
                {pointVal.x},{pointVal.y}
              </span>
            );
          }

          return value;
        },
      };
    }),
  ];
};
