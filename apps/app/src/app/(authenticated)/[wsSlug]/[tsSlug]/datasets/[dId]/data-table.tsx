/* eslint-disable react/no-unstable-nested-components */
"use client";

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
import type { GetDataset } from "~/data/datasets/get-dataset";
import { COLUMN_ICONS } from "~/constants/column-icons";

interface TableProps {
  dataset: GetDataset;
}

export function DataTable({ dataset }: TableProps) {
  const columns: ColumnDef<GetDataset["columns"]>[] = dataset.columns.map(
    (column) => {
      const Icon = COLUMN_ICONS[column.type];

      if (column.type === "point") {
        return {
          accessorKey: column.id,
          header: () => (
            <span className="flex items-center gap-1.5">
              <Icon className="size-4" /> {column.name}
            </span>
          ),
          cell: (props) => {
            const value =
              props.getValue() as GetDataset["rows"][number]["cells"][number]["pointCell"];

            if (!value) {
              return null;
            }

            return (
              <span>
                {value.x}
                {", "}
                {value.y}
              </span>
            );
          },
        };
      }

      return {
        accessorKey: column.id,
        header: () => (
          <span className="flex items-center gap-1.5">
            <Icon className="size-4" /> {column.name}
          </span>
        ),
      };
    },
  );

  const rows = dataset.rows.map((row) => {
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
  });

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
}
