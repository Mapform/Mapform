import {
  FormField,
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
import type { CreateLayerSchema } from "~/data/layers/create-layer/schema";

interface TypePopoverProps {
  form: UseFormReturn<CreateLayerSchema>;
}

export function TypePopover({ form }: TypePopoverProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <>
          <FormControl>
            <Select
              name={field.name}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger id="layerType" s="sm" variant="filled">
                <SelectValue placeholder="Select" />
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
