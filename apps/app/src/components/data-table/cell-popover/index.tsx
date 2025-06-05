import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useForm,
  zodResolver,
  type UseFormReturn,
} from "@mapform/ui/components/form";
import { Badge } from "@mapform/ui/components/badge";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@mapform/ui/components/popover";
import "mapbox-gl/dist/mapbox-gl.css";
import { Switch } from "@mapform/ui/components/switch";
import { TableCell } from "@mapform/ui/components/table";
import { flexRender, type Cell } from "@tanstack/react-table";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useRef, useState } from "react";
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  upsertCellSchema,
  type UpsertCellSchema,
} from "@mapform/backend/data/cells/upsert-cell/schema";
import type { GetDataset } from "@mapform/backend/data/datasets/get-dataset";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import StringInput from "./string-input";
import EmojiInput from "./emoji-input";
import NumberInput from "./number-input";
import DateInput from "./date-input";
import RichtextInput from "./richtext-input";
import PointInput from "./point-input";
import LineInput from "./line-input";
import PolygonInput from "./polygon-input";

export function CellPopover({
  cell,
  dataset,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We don't need the full cell definition
  cell: Cell<any, any>;
  dataset: NonNullable<GetDataset["data"]>;
}) {
  const cellEl = useRef<HTMLTableCellElement>(null);
  const type = dataset.columns.find(
    (column) => column.id === cell.column.id,
  )?.type;
  const originalValue =
    type === "number" ? cell.getValue()?.toString() : cell.getValue();

  const form = useForm<UpsertCellSchema>({
    defaultValues: {
      rowId: cell.row.id,
      columnId: cell.column.id,
      value: originalValue,
      type,
    },
    resolver: zodResolver(upsertCellSchema),
  });
  const { execute: executeUpsertCell, isPending } = useAction(upsertCellAction);
  const [open, setOpen] = useState(false);

  usePreventPageUnload(isPending);

  const onSubmit = (values: UpsertCellSchema) => {
    setOpen(false);

    if (originalValue !== values.value) {
      executeUpsertCell(values);
    }
  };

  const renderCellContent = useCallback(() => {
    const v = form.getValues();
    const result = upsertCellSchema.safeParse(v);
    if (!result.success) {
      return null;
    }
    const { type: parsedType, value } = result.data;

    if (parsedType === "point") {
      if (!value) {
        return null;
      }
      return (
        <span className="font-mono">
          {value.x.toFixed(4)},{value.y.toFixed(4)}
        </span>
      );
    }

    if (parsedType === "line") {
      if (!value || !Array.isArray(value.coordinates)) {
        return null;
      }
      return `Line: ${value.coordinates.length} points`;
    }

    if (parsedType === "polygon") {
      if (!value || !Array.isArray(value.coordinates)) {
        return null;
      }
      return `Polygon: ${value.coordinates[0]?.length ?? 0} vertices`;
    }

    if (parsedType === "richtext") {
      if (!value) {
        return null;
      }
      return (
        <Badge className="cursor-pointer" variant="secondary">
          Click to view
        </Badge>
      );
    }

    if (parsedType === "date") {
      if (!value) {
        return null;
      }
      return format(new Date(value), "PP hh:mm b", { locale: enUS });
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
      return (
        <StringInput
          form={
            form as UseFormReturn<Extract<UpsertCellSchema, { type: "string" }>>
          }
        />
      );
    }

    if (type === "number") {
      return (
        <NumberInput
          form={
            form as UseFormReturn<Extract<UpsertCellSchema, { type: "number" }>>
          }
        />
      );
    }

    if (type === "date") {
      return (
        <DateInput
          form={
            form as UseFormReturn<Extract<UpsertCellSchema, { type: "date" }>>
          }
        />
      );
    }

    if (type === "point") {
      return (
        <PointInput
          form={
            form as UseFormReturn<Extract<UpsertCellSchema, { type: "point" }>>
          }
        />
      );
    }

    if (type === "icon") {
      return (
        <EmojiInput
          form={
            form as UseFormReturn<Extract<UpsertCellSchema, { type: "icon" }>>
          }
        />
      );
    }

    if (type === "line") {
      return (
        <LineInput
          form={
            form as UseFormReturn<Extract<UpsertCellSchema, { type: "line" }>>
          }
        />
      );
    }

    if (type === "polygon") {
      return (
        <PolygonInput
          form={
            form as UseFormReturn<
              Extract<UpsertCellSchema, { type: "polygon" }>
            >
          }
        />
      );
    }

    return (
      <RichtextInput
        form={
          form as UseFormReturn<Extract<UpsertCellSchema, { type: "richtext" }>>
        }
      />
    );
  };

  return (
    <TableCell
      onClick={() => {
        setOpen(true);
      }}
      onKeyDown={(e) => {
        if (!open && e.key === "Enter") {
          setOpen(true);
        }
      }}
      ref={cellEl}
      tabIndex={0}
    >
      <Form {...form}>
        <form
          onKeyDown={(e) => {
            const ignoreEnterTypes = ["richtext", "line", "polygon"];

            if (!ignoreEnterTypes.includes(type) && e.key === "Enter") {
              onSubmit(form.getValues());
              cellEl.current?.focus();
            }

            if (e.key === "Escape") {
              setOpen(false);
              cellEl.current?.focus();
            }

            if (type === "point" && e.key === "Backspace") {
              form.setValue("value", null);
              onSubmit(form.getValues());
              cellEl.current?.focus();
            }
          }}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Popover
            onOpenChange={(val) => {
              setOpen(val);
              const formVal = form.getValues();

              if (!val) {
                onSubmit(formVal);
              }
            }}
            open={open}
          >
            {renderCellContent()}
            <PopoverAnchor />
            <PopoverContent
              align="start"
              className="w-full min-w-72 overflow-hidden p-0"
              side="top"
            >
              {renderField()}
            </PopoverContent>
          </Popover>
        </form>
      </Form>
    </TableCell>
  );
}
