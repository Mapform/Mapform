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
  CustomBlockContext,
} from "@mapform/blocknote";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  upsertCellSchema,
  type UpsertCellSchema,
} from "@mapform/backend/data/cells/upsert-cell/schema";
import { EmojiPicker } from "@mapform/ui/components/emoji-picker";
import type { GetDataset } from "@mapform/backend/data/datasets/get-dataset";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { compressImage } from "~/lib/compress-image";
import { uploadImageAction } from "~/data/images";
import { toast } from "@mapform/ui/components/toaster";
import { a } from "node_modules/next-safe-action/dist/index.types-B2iGkRfD.mjs";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

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
  const { execute: executeUpsertCell } = useAction(upsertCellAction);
  const [open, setOpen] = useState(false);

  const onSubmit = (values: UpsertCellSchema) => {
    setOpen(false);

    if (originalValue !== values.value) {
      executeUpsertCell(values);
    }
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

function StringInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "string" }>>;
}) {
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

function EmojiInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "icon" }>>;
}) {
  return (
    <FormField
      control={form.control}
      name="value"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <EmojiPicker
              onIconChange={(icon) => {
                field.onChange(icon);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function NumberInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "number" }>>;
}) {
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

function DateInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "date" }>>;
}) {
  return (
    <FormField
      control={form.control}
      name="value"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <DateTimePicker
              onChange={field.onChange}
              value={field.value ?? undefined}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function RichtextInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "richtext" }>>;
}) {
  const editor = useCreateBlockNote({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Block types still need work
    initialContent: form.getValues().value?.content as any,
    placeholders: {
      default: "Write, or press '/' for commands...",
    },
    animations: false,
    schema,
  });
  const uploadImageServer = useAction(uploadImageAction, {
    onError: (response) => {
      if (
        response.error.validationErrors &&
        "image" in response.error.validationErrors
      ) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: response.error.validationErrors.image?._errors?.[0],
        });

        return;
      }

      toast({
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while uploading the image.",
      });
    },
  });

  return (
    <CustomBlockContext.Provider
      value={{
        isEditing: true,
        onImageUpload: async (file: File) => {
          const compressedFile = await compressImage(
            file,
            0.8,
            2000,
            2000,
            1000,
          );
          const formData = new FormData();
          formData.append("image", compressedFile);

          const response = await uploadImageServer.executeAsync(formData);

          if (response?.serverError) {
            return null;
          }

          return response?.data?.url || null;
        },
      }}
    >
      <div className="h-[360px] w-[360px] overflow-y-auto">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <BlocknoteEditor
                  isEditing
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
    </CustomBlockContext.Provider>
  );
}

function PointInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "point" }>>;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      center: {
        lng: form.getValues().value?.x || 0,
        lat: form.getValues().value?.y || 0,
      },
      zoom: form.getValues().value ? 9 : 0,
      container: mapContainerRef.current ?? "",
      pitchWithRotate: false,
      dragRotate: false,
      doubleClickZoom: false,
      scrollZoom: {
        around: "center",
      },
    });

    map.on("dblclick", () => {
      // Prevent the default double-click zoom behavior
      map.doubleClickZoom.disable();

      // Zoom in by increasing the zoom level, preserving the clicked location
      map.zoomTo(map.getZoom() + 1, {
        duration: 300, // Optional: set the animation duration
      });
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
  }, [form]);

  return (
    <div className="relative h-[280px] w-full">
      <div className="absolute left-2 right-2 top-2 z-10 rounded bg-white/70 px-4 py-2 font-mono text-xs backdrop-blur-md">
        Lng: {center[0]?.toFixed(4)} | Lat: {center[1]?.toFixed(4)}
      </div>
      <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex size-3 -translate-x-1/2 -translate-y-1/2 transform">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex size-3 rounded-full bg-red-500" />
      </span>
      <div className="h-full w-full" ref={mapContainerRef} />
    </div>
  );
}
