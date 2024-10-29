/* eslint-disable react/no-unstable-nested-components */
"use client";

import { memo, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
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
import type { GetDataset } from "~/data/datasets/get-dataset";
import { COLUMN_ICONS } from "~/constants/column-icons";

interface TableProps {
  dataset: GetDataset;
}

export const DataTable = memo(function DataTable({ dataset }: TableProps) {
  const columns = useMemo(() => getColumns(dataset), [dataset]);
  const rows = useMemo(
    () =>
      dataset.rows.map((row) => {
        const rowCells = row.cells;

        return rowCells.reduce<
          Record<string, GetDataset["rows"][number]["cells"][number]>
        >((acc, cell) => {
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
  });

  return (
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
