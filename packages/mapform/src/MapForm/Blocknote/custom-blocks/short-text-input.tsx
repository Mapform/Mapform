import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormContext,
} from "@mapform/ui/components/form";
import { Input } from "@mapform/ui/components/input";

export const ShortTextInput = createReactBlockSpec(
  {
    type: "short-text-input",
    propSchema: {
      // textAlignment: defaultProps.textAlignment,
      // textColor: defaultProps.textColor,
      // type: {
      //   default: "warning",
      //   values: ["warning", "error", "info", "success"],
      // },
    },
    content: "none",
  },
  {
    render: ({ block }) => {
      const form = useFormContext();

      return (
        <FormField
          control={form.control}
          // disabled
          name={block.id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    },
  }
);
