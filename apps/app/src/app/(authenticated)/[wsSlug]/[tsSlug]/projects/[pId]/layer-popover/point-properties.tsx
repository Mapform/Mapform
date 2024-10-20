import type { UseFormReturn } from "@mapform/ui/components/form";
import {
  FormField,
  FormItem,
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
import type { CreateLayerSchema } from "~/data/layers/create-layer/schema";
import { usePage } from "../page-context";

interface PointPropertiesProps {
  form: UseFormReturn<CreateLayerSchema>;
}

export function PointProperties({ form }: PointPropertiesProps) {
  const { availableDatasets } = usePage();

  const getAvailableColumns = () => {
    const type = form.watch("type");
    const datasetId = form.watch("datasetId");
    const dataset = availableDatasets.find((ds) => ds.id === datasetId);

    if (!dataset || !type) {
      return null;
    }

    return dataset.columns.filter((column) => {
      return column.type === type;
    });
  };

  const availableCols = getAvailableColumns();

  return (
    <>
      <div className="col-span-2 mt-1 w-full border-t pt-3">
        <h3 className="-mb-2 text-xs font-semibold leading-6 text-stone-400">
          Properties
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
                  {availableCols?.map((column) => (
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
            <FormLabel htmlFor="locationSelect">Title</FormLabel>
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
                  {availableCols?.map((column) => (
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
