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
import { CopyIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";

export function Table() {
  const { project } = useProject();

  console.log(1111, project?.rows);

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

  console.log(2222, rows);

  const columns = useMemo(() => {
    const columns = [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
    ];

    return [
      {
        id: "select",
        size: 50,
        minSize: 50,
        maxSize: 50,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Not worth creating a workaround type
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Not worth creating a workaround type
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
    ];
  }, [project?.columns]);

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

  console.log(3333, table.getRowModel().rows);

  return (
    <div className="relative flex flex-1 flex-col overflow-auto bg-white p-4 pt-0">
      {/* Top bar */}
      <div className="sticky left-0 top-0 z-20 mb-0 box-content flex h-8 flex-shrink-0 items-center gap-2 border-b bg-white pb-2 pt-4">
        <div className="text-muted-foreground text-sm">
          {numberOfSelectedRows} of {totalNumberOfRows} row(s) selected.
        </div>
        {numberOfSelectedRows > 0 ? (
          <>
            <Button
              // disabled={statusDeleteRows === "executing"}
              onClick={() => {
                const selectedRowIds = table
                  .getFilteredSelectedRowModel()
                  .flatRows.map((row) => row.id);

                // executeDeleteRows({
                //   rowIds: selectedRowIds,
                // });
              }}
              size="sm"
              variant="outline"
            >
              <Trash2Icon className="mr-2 size-4" /> Delete
            </Button>
            <Button
              // disabled={statusDuplicateRows === "executing"}
              onClick={() => {
                const selectedRowIds = table
                  .getFilteredSelectedRowModel()
                  .flatRows.map((row) => row.id);

                // executeDuplicateRows({
                //   rowIds: selectedRowIds,
                // });
              }}
              size="sm"
              variant="outline"
            >
              <CopyIcon className="mr-2 size-4" /> Duplicate
            </Button>
          </>
        ) : null}
      </div>
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
                      {typeof cell.getValue() === "object"
                        ? JSON.stringify(cell.getValue())
                        : String(cell.getValue() ?? "")}
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
