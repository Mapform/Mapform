import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { useAction } from "next-safe-action/hooks";
import { useCallback, useRef, useState } from "react";
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
  const cellEl = useRef<HTMLTableCellElement>(null);
  const type = dataset.columns.find(
    (column) => column.id === cell.column.id,
  )?.type;

  const form = useForm<UpsertCellSchema>({
    defaultValues: {
      rowId: cell.row.id,
      columnId: cell.column.id,
      value:
        type === "number"
          ? cell.getValue()?.toString()
          : (cell.getValue() as any),
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

  const renderCellContent = useCallback(() => {
    const v = form.getValues();
    const { type: parsedType, value } = upsertCellSchema.parse(v);

    if (parsedType === "point") {
      if (!value) {
        return null;
      }

      return (
        <span className="font-mono">
          {value.x},{value.y}
        </span>
      );
    }

    if (parsedType === "richtext") {
      if (!value) {
        return null;
      }

      return <span>TODO: rich text</span>;
    }

    if (parsedType === "date") {
      if (!value) {
        return null;
      }

      return <span>{new Date(value).toLocaleDateString()}</span>;
    }

    return value;
  }, [form]);

  // Used for radio buttons
  if (!type) {
    return (
      <TableCell>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  }

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

  const renderField = () => {
    if (type === "string") {
      return <StringInput form={form} />;
    }

    if (type === "number") {
      return <NumberInput form={form} />;
    }
  };

  return (
    <TableCell
      onClick={() => {
        setOpen(true);
      }}
      onKeyDown={(e) => {
        if (!open) {
          e.key === "Enter" && setOpen(true);
        }
      }}
      ref={cellEl}
      tabIndex={0}
    >
      <Form {...form}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- it's good */}
        <form
          onKeyDown={(e) => {
            e.key === "Enter" && onSubmit(form.getValues());
            cellEl.current?.focus();
          }}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Popover
            onOpenChange={(val) => {
              setOpen(val);
              const formVal = form.getValues();

              if (!val) {
                if (type === "string" || type === "number") {
                  onSubmit(formVal);
                }
              }
            }}
            open={open}
          >
            {renderCellContent()}
            <PopoverAnchor />
            <PopoverContent align="start" className="p-0" side="top">
              {renderField()}
            </PopoverContent>
          </Popover>
        </form>
      </Form>
    </TableCell>
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
