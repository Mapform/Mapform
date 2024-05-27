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
import { useStepContext } from "../context";

export const ShortTextInput = createReactBlockSpec(
  {
    type: "short-text-input",
    propSchema: {
      label: {
        default: "Labelll",
        type: "string",
      },
      placeholder: {
        default: "",
        type: "string",
      },
      required: {
        default: true,
        type: "boolean",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const form = useFormContext();
      const { editable } = useStepContext();

      return (
        <FormField
          control={form.control}
          // disabled
          // This is what allows us to match the user value back to the input
          name={block.id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {editable ? (
                  <input
                    className="text-sm font-medium border-0 w-full p-0 outline-none border-transparent focus:border-transparent focus:ring-0 placeholder-gray-300"
                    onChange={(e) => {
                      editor.updateBlock(block, {
                        type: "short-text-input",
                        props: { label: e.target.value },
                      });
                    }}
                    placeholder="Label"
                    value={block.props.label}
                  />
                ) : (
                  <>{block.props.label}</>
                )}
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
