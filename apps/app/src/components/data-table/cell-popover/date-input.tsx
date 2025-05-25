import { FormField, FormItem, FormControl } from "@mapform/ui/components/form";
import { DateTimePicker } from "@mapform/ui/components/datetime-picker";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";

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

export default DateInput;
