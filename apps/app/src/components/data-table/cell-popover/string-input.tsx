import { FormField, FormItem, FormControl } from "@mapform/ui/components/form";
import { Input } from "@mapform/ui/components/input";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";

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

export default StringInput;
