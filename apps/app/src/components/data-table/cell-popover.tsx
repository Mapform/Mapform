import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import type { Cell } from "@tanstack/react-table";
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
  const value = cell.getValue();
  const type = dataset.columns.find(
    (column) => column.id === cell.column.id,
  )?.type;

  return (
    <PopoverContent align="start">
      {value && value.toString()} {type}
    </PopoverContent>
  );
}
