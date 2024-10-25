import type { UseFormReturn } from "@mapform/ui/components/form";
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@mapform/ui/components/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@mapform/ui/components/select";
import { useCallback, useEffect } from "react";
import type { Column } from "@mapform/db/schema";
import type { UpsertLayerSchema } from "~/data/layers/upsert-layer/schema";
import { usePage } from "../page-context";

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

  return (
    <>
      <div className="col-span-2 mt-1 w-full border-t pt-3">
        <h3 className="-mb-2 text-xs font-semibold leading-6 text-stone-400">
          Data
        </h3>
      </div>
      <FormField
        control={form.control}
        name="pointProperties.pointColumnId"
        render={({ field }) => (
          <>
            <FormLabel htmlFor="locationSelect">Location</FormLabel>
            <FormControl>
              <Select
                name={field.name}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="locationSelect" s="sm" variant="filled">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent ref={field.ref}>
                  {getAvailableColumns("point")?.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </>
        )}
      />
      <FormField
        control={form.control}
        name="pointProperties.titleColumnId"
        render={({ field }) => (
          <>
            <FormLabel htmlFor="titleSelect">Title</FormLabel>
            <FormControl>
              <Select
                name={field.name}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="titleSelect" s="sm" variant="filled">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent ref={field.ref}>
                  {getAvailableColumns("string")?.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </>
        )}
      />
      <FormField
        control={form.control}
        name="pointProperties.descriptionColumnId"
        render={({ field }) => (
          <>
            <FormLabel htmlFor="descriptionSelect">Description</FormLabel>
            <FormControl>
              <Select
                name={field.name}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="descriptionSelect" s="sm" variant="filled">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent ref={field.ref}>
                  {getAvailableColumns("richtext")?.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </>
        )}
      />
    </>
  );
}
