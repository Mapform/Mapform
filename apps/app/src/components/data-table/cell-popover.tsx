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
import { Badge } from "@mapform/ui/components/badge";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@mapform/ui/components/popover";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Switch } from "@mapform/ui/components/switch";
import { TableCell } from "@mapform/ui/components/table";
import { DateTimePicker } from "@mapform/ui/components/datetime-picker";
import { flexRender, type Cell } from "@tanstack/react-table";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  schema,
  BlocknoteEditor,
  useCreateBlockNote,
} from "@mapform/blocknote";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  upsertCellSchema,
  type UpsertCellSchema,
} from "@mapform/backend/cells/upsert-cell/schema";
import type { GetDataset } from "@mapform/backend/datasets/get-dataset";
import { upsertCellAction } from "~/data/cells/upsert-cell";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

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
  const { execute: executeUpsertCell } = useAction(upsertCellAction, {
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

    const { success, data } = upsertCellSchema.safeParse(v);

    // This shouldn't ever happen
    if (!success) {
      console.error("Failed to parse form values", v);
      return null;
    }

    const parsedType = data.type;
    const value = data.value;

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
      return <StringInput form={form} />;
    }

    if (type === "number") {
      return <NumberInput form={form} />;
    }

    if (type === "date") {
      return <DateInput form={form} />;
    }

    if (type === "point") {
      return <PointInput form={form} />;
    }

    return <RichtextInput form={form} />;
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
            if (type !== "richtext" && e.key === "Enter") {
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
            modal
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
              className="overflow-hidden p-0"
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

function DateInput({ form }: { form: UseFormReturn<UpsertCellSchema> }) {
  return (
    <FormField
      control={form.control}
      name="value"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <DateTimePicker onChange={field.onChange} value={field.value} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function RichtextInput({ form }: { form: UseFormReturn<UpsertCellSchema> }) {
  const editor = useCreateBlockNote({
    initialContent: form.getValues().value?.content,
    placeholders: {
      default: "Write, or press '/' for commands...",
    },
    schema,
  });

  return (
    <div className="h-[300px] w-full">
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <BlocknoteEditor
                editor={editor}
                includeFormBlocks={false}
                onChange={() => {
                  field.onChange({ content: editor.document });
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

const INITIAL_CENTER = [0, 0];

function PointInput({ form }: { form: UseFormReturn<UpsertCellSchema> }) {
  const mapContainerRef = useRef<HTMLElement | null>(null);
  const [center, setCenter] = useState(INITIAL_CENTER);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      center: {
        lng: form.getValues().value?.x || INITIAL_CENTER[0]!,
        lat: form.getValues().value?.y || INITIAL_CENTER[1]!,
      },
      zoom: form.getValues().value ? 9 : 0,
      container: mapContainerRef.current ?? "",
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false,
    });

    map.on("move", () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = map.getCenter();

      // update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      form.setValue("value", {
        x: mapCenter.lng,
        y: mapCenter.lat,
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="relative h-[280px] w-full">
      <div className="absolute left-2 right-2 top-2 z-10 rounded bg-white/70 px-4 py-2 font-mono text-xs backdrop-blur-md">
        Lng: {center[0]?.toFixed(4)} | Lat: {center[1]?.toFixed(4)}
      </div>
      {/* <CircleDot className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform animate-ping text-red-600" /> */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex size-3 -translate-x-1/2 -translate-y-1/2 transform">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex size-3 rounded-full bg-red-500" />
      </span>
      <div className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}
