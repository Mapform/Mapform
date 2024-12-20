import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  type UseFormReturn,
} from "@mapform/ui/components/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@mapform/ui/components/select";
import type { UpsertLayerSchema } from "@mapform/backend/data/layers/upsert-layer/schema";

interface TypePopoverProps {
  form: UseFormReturn<UpsertLayerSchema>;
}

export function TypePopover({ form }: TypePopoverProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <>
          <FormLabel htmlFor="layerSelect">Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger id="layerSelect" s="sm" variant="filled">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="capitalize" value="point">
                  Point
                </SelectItem>
                <SelectItem className="capitalize" value="marker">
                  Marker
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </>
      )}
    />
  );
}
