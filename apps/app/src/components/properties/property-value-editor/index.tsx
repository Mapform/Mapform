import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useForm,
  zodResolver,
  type UseFormReturn,
} from "@mapform/ui/components/form";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@mapform/ui/components/popover";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useRef, useState } from "react";
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  upsertCellSchema,
  type UpsertCellSchema,
} from "@mapform/backend/data/cells/upsert-cell/schema";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import type { columnTypeEnum } from "@mapform/db/schema";
import { Switch } from "@mapform/ui/components/switch";
import StringInput from "./string-input";
import NumberInput from "./number-input";
import DateInput from "./date-input";

interface ValueEditorProps {
  value: any;
  type: (typeof columnTypeEnum.enumValues)[number];
  rowId?: string;
  columnId?: string;
  emptyText?: string;
}

// Type-safe form schemas for each cell type
type StringCellSchema = Extract<UpsertCellSchema, { type: "string" }>;
type NumberCellSchema = Extract<UpsertCellSchema, { type: "number" }>;
type BoolCellSchema = Extract<UpsertCellSchema, { type: "bool" }>;
type DateCellSchema = Extract<UpsertCellSchema, { type: "date" }>;

export function PropertyValueEditor({
  value,
  type,
  rowId,
  columnId,
  emptyText = "",
}: ValueEditorProps) {
  const cellEl = useRef<HTMLTableCellElement>(null);

  const form = useForm<UpsertCellSchema>({
    defaultValues: {
      rowId,
      columnId,
      value,
      type,
    },
    resolver: zodResolver(upsertCellSchema),
  });
  const { execute: executeUpsertCell, isPending } = useAction(upsertCellAction);
  const [open, setOpen] = useState(false);

  usePreventPageUnload(isPending);

  const onSubmit = useCallback(
    (values: UpsertCellSchema) => {
      setOpen(false);

      if (value !== values.value) {
        executeUpsertCell(values);
      }
    },
    [value, executeUpsertCell],
  );

  const renderCellContent = useCallback(() => {
    const { success, data } = upsertCellSchema.safeParse(form.getValues());

    if (!success || !data.value) {
      return <span className="text-muted-foreground">{emptyText}</span>;
    }

    if (data.type === "date") {
      return format(new Date(data.value), "PP hh:mm b", { locale: enUS });
    }

    return data.value;
  }, [form, emptyText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open && e.key === "Enter") {
        setOpen(true);
      }
    },
    [open],
  );

  const handleFormKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      cellEl.current?.focus();
    }
  }, []);

  const handlePopoverOpenChange = useCallback(
    (val: boolean) => {
      setOpen(val);
      const formVal = form.getValues();

      if (!val) {
        onSubmit(formVal);
      }
    },
    [form, onSubmit],
  );

  const renderPopoverField = useCallback(() => {
    switch (type) {
      case "string":
        return <StringInput form={form as UseFormReturn<StringCellSchema>} />;
      case "number":
        return <NumberInput form={form as UseFormReturn<NumberCellSchema>} />;
      case "date":
        return <DateInput form={form as UseFormReturn<DateCellSchema>} />;
      default:
        return null;
    }
  }, [form, type]);

  // Render boolean input inline (no popover needed)
  if (type === "bool") {
    return (
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
    );
  }

  return (
    <div
      onClick={() => setOpen(true)}
      onKeyDown={handleKeyDown}
      ref={cellEl}
      tabIndex={0}
    >
      <Form {...form}>
        <form
          onKeyDown={handleFormKeyDown}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Popover onOpenChange={handlePopoverOpenChange} open={open}>
            <div className="hover:bg-muted w-full cursor-pointer rounded px-2 py-1">
              {renderCellContent()}
            </div>
            <PopoverAnchor />
            <PopoverContent
              align="start"
              className="w-full min-w-72 overflow-hidden p-0"
              side="top"
            >
              {renderPopoverField()}
            </PopoverContent>
          </Popover>
        </form>
      </Form>
    </div>
  );
}
