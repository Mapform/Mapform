"use client";

import type { Row } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Table,
} from "@tanstack/react-table";
import {
  Table as TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mapform/ui/components/table";
import { Checkbox } from "@mapform/ui/components/checkbox";
import { useMemo } from "react";
import { useProject } from "../../context";
import type { GetProject } from "@mapform/backend/data/projects/get-project";
import { PlusIcon } from "lucide-react";
import { TopBar } from "./top-bar";
import { ColumnAdder } from "./column-adder";

export function Table() {
  const { project } = useProject();

  console.log(project);

  const rows = useMemo(
    () =>
      project.rows.map((row) => {
        const rowCells = row.cells;

        return {
          name: row.name,
          ...rowCells.reduce<
            Record<
              string,
              NonNullable<GetProject["data"]>["rows"][number]["cells"][number]
            >
          >(
            // @ts-expect-error -- ok
            (acc, cell) => {
              return {
                ...acc,
                [cell.columnId]:
                  cell.stringCell?.value ??
                  cell.numberCell?.value ??
                  cell.booleanCell?.value ??
                  cell.dateCell?.value ??
                  null,
              };
            },
            {
              rowId: row.id,
            },
          ),
        };
      }),
    [project.rows],
  );

  const columns = useMemo(() => {
    // TODO: Add Icon and cells
    const columns = [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      ...project.columns.map((column) => ({
        id: column.id,
        accessorKey: column.id,
        header: column.name,
      })),
    ];

    return [
      {
        id: "select",
        size: 50,
        minSize: 50,
        maxSize: 50,
        header: ({ table }: { table: Table<any> }) => (
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
        cell: ({ row }: { row: Row<any> }) => (
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
      ...columns,
      {
        id: "create-column",
        accessorKey: "create-column",
        header: () => <ColumnAdder />,
        enableSorting: false,
        enableHiding: false,
      },
    ];
  }, [project.columns]);

  const table = useReactTable({
    data: rows ?? [],
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
      <TopBar
        table={table}
        numberOfSelectedRows={numberOfSelectedRows}
        totalNumberOfRows={totalNumberOfRows}
      />
      <TableRoot className="border-b">
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
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
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
      </TableRoot>
      <div className="sticky -bottom-4 left-0 flex items-center bg-white pb-8">
        <button
          className="hover:bg-muted/50 flex h-10 flex-1 items-center text-left text-sm disabled:pointer-events-none disabled:opacity-50"
          // disabled={statusCreateRow === "executing"}
          onClick={() => {
            // executeCreateRow({ datasetId: dataset.id });
          }}
          type="button"
        >
          <PlusIcon className="mr-2 size-4" />
          Add row
        </button>
      </div>
    </div>
  );
}
