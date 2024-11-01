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
import { Switch } from "@mapform/ui/components/switch";
import { TableCell } from "@mapform/ui/components/table";
import { flexRender, type Cell } from "@tanstack/react-table";
import { set } from "date-fns";
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
    setOpen(false);
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

  const renderField = () => {
    if (type === "string") {
      return <StringInput form={form} />;
    }

    if (type === "number") {
      return <NumberInput form={form} />;
    }
  };

  if (type === "bool") {
    return (
      <TableCell>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Switch
                      checked={Boolean(field.value)}
                      name={field.name}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                        const formVal = form.getValues();
                        executeUpsertCell(formVal);
                      }}
                      size="sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </TableCell>
    );
  }

  const renderCellContent = () => {
    const value = form.getValues().value;

    if (type === "point") {
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
  };

  return (
    <Popover
      onOpenChange={(val) => {
        setOpen(val);
        const formVal = form.getValues();

        if (!val) {
          if (type === "string" || type === "number") {
            executeUpsertCell(formVal);
          }
        }
      }}
      open={open}
    >
      <TableCell
        onClick={() => {
          setOpen(true);
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {renderCellContent()}
            <PopoverAnchor />
            <PopoverContent align="start" className="p-0" side="top">
              {renderField()}
            </PopoverContent>
          </form>
        </Form>
      </TableCell>
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
              value={(field.value as string | null) || ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function NumberInput({ form }: { form: UseFormReturn<UpsertCellSchema> }) {
  return (
    <FormField
      control={form.control}
      name="value"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <Input
              className="5 border-none outline-0 !ring-0 !ring-transparent !ring-opacity-0 !ring-offset-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              disabled={field.disabled}
              name={field.name}
              onChange={field.onChange}
              ref={field.ref}
              type="number"
              value={(field.value as string | null) || ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
