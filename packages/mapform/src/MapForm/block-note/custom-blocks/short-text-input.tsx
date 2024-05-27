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
import { EllipsisIcon } from "lucide-react";

export const ShortTextInput = createReactBlockSpec(
  {
    type: "short-text-input",
    propSchema: {
      label: {
        default: "Labelll",
        type: "string",
      },
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
    render: ({ block, editor }) => {
      const form = useFormContext();

      return (
        <FormField
          control={form.control}
          // disabled
          // This is what allows us to match the user value back to the input
          name={block.id}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                onClick={() =>
                  editor.updateBlock(block, {
                    type: "short-text-input",
                    props: { label: "New Label" },
                  })
                }
              >
                {block.props.label}
              </FormLabel>
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
