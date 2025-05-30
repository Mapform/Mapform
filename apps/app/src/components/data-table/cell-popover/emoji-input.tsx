import { FormField, FormItem, FormControl } from "@mapform/ui/components/form";
import { EmojiPicker } from "@mapform/ui/components/emoji-picker";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";

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

export default EmojiInput;
