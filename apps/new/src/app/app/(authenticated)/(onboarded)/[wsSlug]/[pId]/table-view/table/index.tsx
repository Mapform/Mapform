"use client";

import type { Row, Table } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { useMemo, useRef } from "react";
import { useProject } from "../../context";
import type { GetProject } from "@mapform/backend/data/projects/get-project";
import {
  CaseSensitiveIcon,
  CopyIcon,
  Loader2Icon,
  PlusIcon,
  SmileIcon,
  Trash2Icon,
} from "lucide-react";
import { ColumnAdder } from "./column-adder";
import { PropertyColumnEditor } from "../../properties/property-column-editor";
import { PropertyValueEditor } from "../../properties/property-value-editor";
import { TablePagination } from "./table-pagination";
import {
  TableActionBar,
  TableActionBarAction,
  TableActionBarSelection,
} from "./table-action-bar";
import { deleteRowsAction } from "~/data/rows/delete-rows";
import { duplicateRowsAction } from "~/data/rows/dupliate-rows";
import { useAction } from "next-safe-action/hooks";
import { useParamsContext } from "~/lib/params/client";

export function Table() {
  const { projectService } = useProject();
  const { execute: executeDeleteRows, isPending: isPendingDeleteRows } =
    useAction(deleteRowsAction);
  const { execute: executeDuplicateRows, isPending: isPendingDuplicateRows } =
    useAction(duplicateRowsAction);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const {
    params: { perPage, page },
  } = useParamsContext();

  const rows = useMemo(
    () =>
      projectService.optimisticState.rows.map((row) => {
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
    [projectService.optimisticState.rows],
  );

  const columns = useMemo(() => {
    const columns = [
      {
        id: "name",
        accessorKey: "name",
        header: () => (
          <div className="flex flex-grow-0 items-center gap-1.5">
            <CaseSensitiveIcon className="size-4" /> Name
          </div>
        ),
        cell: ({ row }: { row: Row<any> }) => {
          const icon = row.original.icon ?? (
            <SmileIcon className="text-muted-foreground size-4" />
          );

          return (
            <div className="flex items-center gap-2">
              {icon} {row.original.name}
            </div>
          );
        },
      },
      ...projectService.optimisticState.columns.map((column) => ({
        id: column.id,
        accessorKey: column.id,
        header: () => (
          <PropertyColumnEditor
            columnId={column.id}
            columnName={column.name}
            columnType={column.type}
          />
        ),
      })),
    ];

    return [
      {
        id: "select",
        size: 50,
        minSize: 50,
        maxSize: 50,
        header: ({ table }: { table: Table<any> }) => (
          <div className="flex flex-grow-0 items-center">
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
          </div>
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
        header: () => (
          <div className="flex flex-grow-0 items-center">
            <ColumnAdder />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ];
  }, [projectService.optimisticState.columns]);

  const table = useReactTable({
    data: rows ?? [],
    columns,
    pageCount: Math.ceil(projectService.optimisticState.rowCount / perPage),
    state: {
      pagination: {
        pageIndex: page,
        pageSize: perPage,
      },
    },
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

  return (
    <div
      className="relative flex flex-1 flex-col overflow-auto bg-white py-4"
      ref={tableContainerRef}
    >
      <TableRoot className="border-b">
        <TableHeader className="border-b">
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
                  const value = cell.getValue()?.toString();
                  const type = projectService.optimisticState.columns.find(
                    (column) => column.id === cell.column.id,
                  )?.type;

                  return (
                    <TableCell key={cell.id}>
                      {type ? (
                        <PropertyValueEditor
                          value={value ?? ""}
                          type={type}
                          rowId={row.id}
                          columnId={cell.column.id}
                        />
                      ) : (
                        <span className="text-muted-foreground">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </span>
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
      <TablePagination table={table} />
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <TableActionBar container={tableContainerRef.current} table={table}>
          <TableActionBarSelection table={table} />
          <TableActionBarAction
            disabled={isPendingDuplicateRows}
            onClick={() => {
              executeDuplicateRows({
                rowIds: table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.id),
              });
            }}
          >
            {isPendingDuplicateRows ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <CopyIcon />
            )}
            Duplicate
          </TableActionBarAction>
          <TableActionBarAction
            disabled={isPendingDeleteRows}
            onClick={() => {
              executeDeleteRows({
                rowIds: table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.id),
              });
            }}
          >
            {isPendingDeleteRows ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Trash2Icon />
            )}
            Delete
          </TableActionBarAction>
        </TableActionBar>
      )}
    </div>
  );
}
