import { Button } from "@mapform/ui/components/button";
import type { Table } from "@tanstack/react-table";
import { Trash2Icon, CopyIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteRowsAction } from "~/data/rows/delete-rows";
import { duplicateRowsAction } from "~/data/rows/dupliate-rows";

interface TopBarProps {
  table: Table<any>;
  numberOfSelectedRows: number;
  totalNumberOfRows: number;
}

export function TopBar({
  table,
  numberOfSelectedRows,
  totalNumberOfRows,
}: TopBarProps) {
  const { execute: executeDeleteRows, isPending: isPendingDeleteRows } =
    useAction(deleteRowsAction);
  const { execute: executeDuplicateRows, isPending: isPendingDuplicateRows } =
    useAction(duplicateRowsAction);

  return (
    <div className="sticky left-0 top-0 z-20 mb-0 box-content flex h-8 flex-shrink-0 items-center gap-2 border-b bg-white pb-2 pt-4">
      <div className="text-muted-foreground text-sm">
        {numberOfSelectedRows} of {totalNumberOfRows} row(s) selected.
      </div>
      {numberOfSelectedRows > 0 ? (
        <>
          <Button
            disabled={isPendingDeleteRows}
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
            disabled={isPendingDuplicateRows}
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
  );
}
