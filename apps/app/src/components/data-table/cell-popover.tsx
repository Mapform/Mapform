import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
  zodResolver,
  type UseFormReturn,
} from "@mapform/ui/components/form";
import { Input } from "@mapform/ui/components/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { TableCell } from "@mapform/ui/components/table";
import { flexRender, type Cell } from "@tanstack/react-table";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { upsertCell } from "~/data/cells/upsert-cell";
import type { UpsertCellSchema } from "~/data/cells/upsert-cell/schema";
import { upsertCellSchema } from "~/data/cells/upsert-cell/schema";
import type { GetDataset } from "~/data/datasets/get-dataset";

export function CellPopover({
  cell,
  dataset,
}: {
  cell: Cell<unknown, unknown>;
  dataset: GetDataset;
}) {
  const type = dataset.columns.find(
    (column) => column.id === cell.column.id,
  )?.type;

  const form = useForm<UpsertCellSchema>({
    defaultValues: {
      rowId: cell.row.id,
      columnId: cell.column.id,
      value: cell.getValue() as any,
      type,
    },
    resolver: zodResolver(upsertCellSchema),
  });
  const { execute: executeUpsertCell } = useAction(upsertCell, {
    onError: (error) => {
      console.error("Failed to upsert cell", error);
    },
  });
  const [open, setOpen] = useState(false);

  const onSubmit = (values: UpsertCellSchema) => {
    executeUpsertCell(values);
  };

  // Used for radio buttons
  if (!type) {
    return (
      <TableCell>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  }

  return (
    <Popover
      onOpenChange={(val) => {
        setOpen(val);

        if (!val) {
          executeUpsertCell(form.getValues());
        }
      }}
      open={open}
    >
      <TableCell
        onClick={() => {
          setOpen(true);
        }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
        <PopoverAnchor />
      </TableCell>
      <PopoverContent align="start" className="p-0" side="top">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {type === "string" && <StringInput form={form} />}
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

function StringInput({ form }: { form: UseFormReturn<UpsertCellSchema> }) {
  return (
    <FormField
      control={form.control}
      name="value"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <Input
              className="border-none outline-0 !ring-0 !ring-transparent !ring-opacity-0 !ring-offset-0"
              disabled={field.disabled}
              name={field.name}
              onChange={field.onChange}
              ref={field.ref}
              value={field.value as string}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NumberInput({ cell }: { cell: Cell<unknown, unknown> }) {
  const initialValue = cell.getValue()?.toString() ?? "";
  const [value, setValue] = useState<string>(initialValue);
  const { execute: executeUpsertCell } = useAction(upsertCell);

  return (
    <Input
      className="border-none outline-0 !ring-0 !ring-transparent !ring-opacity-0 !ring-offset-0"
      onChange={(e) => {
        setValue(e.target.value);
        executeUpsertCell({
          rowId: cell.row.id,
          columnId: cell.column.id,
          value: e.target.value,
          type: "string",
        });
      }}
      type="number"
      value={value}
    />
  );
}
