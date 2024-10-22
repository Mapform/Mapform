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
import type { UpsertLayerSchema } from "~/data/layers/upsert-layer/schema";

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
            <Select
              name={field.name}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger id="layerSelect" s="sm" variant="filled">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent ref={field.ref}>
                <SelectItem className="capitalize" value="point">
                  Point
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
