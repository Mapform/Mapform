import { Input } from "@mapform/ui/components/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import type { Cell } from "@tanstack/react-table";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { upsertCell } from "~/data/cells/upsert-cell";
import type { GetDataset } from "~/data/datasets/get-dataset";

export const CellPopover = Popover;

export const CellPopoverTrigger = PopoverTrigger;

export const CellAnchor = PopoverAnchor;

export function CellPopoverContent({
  cell,
  dataset,
}: {
  cell: Cell<unknown, unknown>;
  dataset: GetDataset;
}) {
  const { execute: executeUpsertCell } = useAction(upsertCell);
  const [value, setValue] = useState<string>(cell.getValue() ?? "");
  const type = dataset.columns.find(
    (column) => column.id === cell.column.id,
  )?.type;

  if (!type) {
    return null;
  }

  return (
    <PopoverContent align="start" className="p-0" side="bottom">
      {/* {value ? value.toString() : null} {type} */}
      <Input
        className="border-none outline-0 !ring-0 !ring-transparent !ring-opacity-0 !ring-offset-0"
        onChange={(e) => {
          setValue(e.target.value);
          executeUpsertCell({
            rowId: cell.row.id,
            columnId: cell.column.id,
            value: e.target.value,
            type,
          });
        }}
        value={value}
      />
    </PopoverContent>
  );
}
