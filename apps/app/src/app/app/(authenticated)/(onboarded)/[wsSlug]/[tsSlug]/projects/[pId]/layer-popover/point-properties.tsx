import type { UseFormReturn, FieldPath } from "@mapform/ui/components/form";
import { FormField, FormLabel } from "@mapform/ui/components/form";
import { useCallback, useEffect, useState } from "react";
import type { Column } from "@mapform/db/schema";
import { Button } from "@mapform/ui/components/button";
import type { ListTeamspaceDatasets } from "@mapform/backend/data/datasets/list-teamspace-datasets";
import { ChevronsUpDownIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import type { UpsertLayerSchema } from "@mapform/backend/data/layers/upsert-layer/schema";
import { toast } from "@mapform/ui/components/toaster";
import { createColumnAction } from "~/data/columns/create-column";
import { useProject } from "../project-context";
import { ColorPicker } from "./color-picker";
import {
  PropertyPopover,
  PropertyPopoverTrigger,
  PropertyPopoverContent,
} from "~/components/property-popover";

interface PointPropertiesProps {
  form: UseFormReturn<UpsertLayerSchema>;
}

export function PointProperties({ form }: PointPropertiesProps) {
  const { availableDatasets } = useProject();
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
      const currentPointColumnId = form.getValues(
        "pointProperties.pointColumnId",
      );
      const currentTitleColumnId = form.getValues(
        "pointProperties.titleColumnId",
      );
      const currentDescriptionColumnId = form.getValues(
        "pointProperties.descriptionColumnId",
      );
      const currentIconColumnId = form.getValues(
        "pointProperties.iconColumnId",
      );

      if (currentPointColumnId === undefined || currentPointColumnId === "") {
        form.setValue(
          "pointProperties.pointColumnId",
          getAvailableColumns("point")?.find((c) => c.type === "point")?.id ??
            "",
        );
      }

      if (currentTitleColumnId === undefined || currentTitleColumnId === "") {
        form.setValue(
          "pointProperties.titleColumnId",
          getAvailableColumns("string")?.find((c) => c.type === "string")?.id ??
            "",
        );
      }

      if (
        currentDescriptionColumnId === undefined ||
        currentDescriptionColumnId === ""
      ) {
        form.setValue(
          "pointProperties.descriptionColumnId",
          getAvailableColumns("richtext")?.find((c) => c.type === "richtext")
            ?.id ?? "",
        );
      }

      if (currentIconColumnId === undefined || currentIconColumnId === "") {
        form.setValue(
          "pointProperties.iconColumnId",
          getAvailableColumns("icon")?.find((c) => c.type === "icon")?.id ?? "",
        );
      }
    }
  }, [dataset, form, type, getAvailableColumns]);

  const availablePointColumns = getAvailableColumns("point");
  const availableStringColumns = getAvailableColumns("string");
  const availableRichtextColumns = getAvailableColumns("richtext");
  const availableIconColumns = getAvailableColumns("icon");

  return (
    <>
      <div className="col-span-2 mt-1 w-full border-t pt-3">
        <h3 className="-mb-2 text-xs font-semibold leading-6 text-stone-400">
          Properties
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
      <DataColField
        availableColumns={availableIconColumns ?? []}
        form={form}
        label="Icon"
        name="pointProperties.iconColumnId"
        type="icon"
      />
      <div className="col-span-2 mt-1 w-full border-t pt-3">
        <h3 className="-mb-2 text-xs font-semibold leading-6 text-stone-400">
          Styles
        </h3>
      </div>
      <ColorPicker form={form} label="Color" name="pointProperties.color" />
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
  name: FieldPath<UpsertLayerSchema>;
  form: UseFormReturn<UpsertLayerSchema>;
  label: string;
  type: Column["type"];
  availableColumns: NonNullable<
    ListTeamspaceDatasets["data"]
  >[number]["columns"];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { executeAsync } = useAction(createColumnAction, {
    onSuccess: ({ data, input }) => {
      if (!data?.id) return;

      if (input.type === "point") {
        form.setValue("pointProperties.pointColumnId", data.id);
      }

      if (input.type === "string") {
        form.setValue("pointProperties.titleColumnId", data.id);
      }

      if (input.type === "richtext") {
        form.setValue("pointProperties.descriptionColumnId", data.id);
      }

      if (input.type === "icon") {
        form.setValue("pointProperties.iconColumnId", data.id);
      }
    },

    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was an error creating the column.",
      });
    },
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <PropertyPopover modal onOpenChange={setOpen} open={open}>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <div className="flex w-full flex-shrink-0 justify-end">
            <PropertyPopoverTrigger asChild>
              <Button
                className="ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-7 w-full items-center justify-between whitespace-nowrap rounded-md border-0 bg-stone-100 px-2 py-0.5 text-sm font-normal shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                id={name}
                size="icon-xs"
                variant="ghost"
              >
                <span className="flex-1 truncate text-left">
                  {availableColumns.find((col) => col.id === field.value)
                    ?.name ?? "Select..."}
                </span>
                <ChevronsUpDownIcon className="size-4 flex-shrink-0 opacity-50" />
              </Button>
            </PropertyPopoverTrigger>
            <PropertyPopoverContent
              align="start"
              side="right"
              value={field.value as string | null}
              query={query}
              setQuery={setQuery}
              availableItems={availableColumns}
              onSelect={(value) => {
                form.setValue(name, value as string | null);
                setOpen(false);
              }}
              onCreate={(name) => {
                void executeAsync({
                  name,
                  datasetId: form.watch("datasetId"),
                  type,
                });
                setQuery("");
                setOpen(false);
              }}
            />
          </div>
        </PropertyPopover>
      )}
    />
  );
}
