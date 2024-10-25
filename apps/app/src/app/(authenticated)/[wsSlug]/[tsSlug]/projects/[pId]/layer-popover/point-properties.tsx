import type { UseFormReturn } from "@mapform/ui/components/form";
import { FormField, FormLabel } from "@mapform/ui/components/form";
import { useCallback, useEffect, useState } from "react";
import type { Column } from "@mapform/db/schema";
import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { ChevronsUpDownIcon, PlusIcon, CheckIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import type { UpsertLayerSchema } from "~/data/layers/upsert-layer/schema";
import type { ListAvailableDatasets } from "~/data/datasets/list-available-datasets";
import { createColumn } from "~/data/datasets/create-column";
import { usePage } from "../page-context";
import { toast } from "@mapform/ui/components/toaster";

interface PointPropertiesProps {
  form: UseFormReturn<UpsertLayerSchema>;
}

export function PointProperties({ form }: PointPropertiesProps) {
  const { availableDatasets } = usePage();
  const datasetId = form.watch("datasetId");
  const type = form.watch("type");
  const dataset = availableDatasets.find((ds) => ds.id === datasetId);

  const getAvailableColumns = useCallback(
    (t: Column["type"]) => {
      if (!dataset || !type) {
        return null;
      }

      return dataset.columns.filter((column) => {
        return column.type === t;
      });
    },
    [dataset, type],
  );

  useEffect(() => {
    if (type === "point") {
      form.setValue(
        "pointProperties.pointColumnId",
        getAvailableColumns("point")?.find((c) => c.type === "point")?.id ?? "",
      );

      form.setValue(
        "pointProperties.titleColumnId",
        getAvailableColumns("string")?.find((c) => c.type === "string")?.id ??
          "",
      );

      form.setValue(
        "pointProperties.descriptionColumnId",
        getAvailableColumns("richtext")?.find((c) => c.type === "richtext")
          ?.id ?? "",
      );
    }
  }, [dataset, form, type, getAvailableColumns]);

  const availablePointColumns = getAvailableColumns("point");
  const availableStringColumns = getAvailableColumns("string");
  const availableRichtextColumns = getAvailableColumns("richtext");

  return (
    <>
      <div className="col-span-2 mt-1 w-full border-t pt-3">
        <h3 className="-mb-2 text-xs font-semibold leading-6 text-stone-400">
          Data
        </h3>
      </div>
      <DataColField
        availableColumns={availablePointColumns ?? []}
        form={form}
        label="Location"
        name="pointProperties.pointColumnId"
        type="point"
      />
      <DataColField
        availableColumns={availableStringColumns ?? []}
        form={form}
        label="Title"
        name="pointProperties.titleColumnId"
        type="string"
      />
      <DataColField
        availableColumns={availableRichtextColumns ?? []}
        form={form}
        label="Description"
        name="pointProperties.descriptionColumnId"
        type="richtext"
      />
    </>
  );
}

function DataColField({
  name,
  form,
  label,
  type,
  availableColumns,
}: {
  name: any;
  form: UseFormReturn<UpsertLayerSchema>;
  label: string;
  type: Column["type"];
  availableColumns: ListAvailableDatasets[number]["columns"];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { executeAsync } = useAction(createColumn, {
    onSuccess: ({ data, input }) => {
      if (!data?.id) return;

      input.type === "point" &&
        form.setValue("pointProperties.pointColumnId", data.id);

      input.type === "string" &&
        form.setValue("pointProperties.titleColumnId", data.id);

      input.type === "richtext" &&
        form.setValue("pointProperties.descriptionColumnId", data.id);
    },

    onError: () => {
      toast("Failed to create column.");
    },
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Popover modal onOpenChange={setOpen} open={open}>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <div className="flex w-full flex-shrink-0 justify-end">
            <PopoverTrigger asChild>
              <Button
                className="ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-7 w-full items-center justify-between whitespace-nowrap rounded-md border-0 bg-stone-100 px-2 py-0.5 text-sm font-normal shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                id={name}
                size="icon-xs"
                variant="ghost"
              >
                {availableColumns.find((col) => col.id === field.value)?.name ??
                  "Select..."}
                <ChevronsUpDownIcon className="size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[200px] p-0"
              side="right"
            >
              <Command
                filter={(value, search, keywords) => {
                  if (value.includes("Create")) return 1;
                  if (
                    value
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  )
                    return 1;
                  if (
                    keywords?.some((k) =>
                      k
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase()),
                    )
                  )
                    return 1;
                  return 0;
                }}
              >
                <CommandInput
                  onValueChange={(v: string) => {
                    setQuery(v);
                  }}
                  placeholder="Create or search..."
                  value={query}
                />
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      disabled={query.length === 0}
                      onSelect={async () => {
                        await executeAsync({
                          name: query,
                          datasetId: form.watch("datasetId"),
                          type,
                        });
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center overflow-hidden">
                        <p className="flex items-center font-semibold">
                          <PlusIcon className="mr-2 size-4" />
                          Create
                        </p>
                        <p className="text-primary ml-1 block truncate">
                          {query}
                        </p>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  {availableColumns.length > 0 ? (
                    <CommandGroup heading="Properties">
                      {availableColumns.map((col) => (
                        <CommandItem
                          key={col.id}
                          keywords={[col.name]}
                          onSelect={(currentValue) => {
                            form.setValue(
                              name,
                              currentValue === field.value ? "" : currentValue,
                            );
                            setOpen(false);
                          }}
                          value={col.id}
                        >
                          {col.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto size-4",
                              field.value === col.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                </CommandList>
              </Command>
            </PopoverContent>
          </div>
        </Popover>
      )}
    />
  );
}
