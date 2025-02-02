/* eslint-disable react-hooks/rules-of-hooks -- Valid */
import { createReactBlockSpec } from "@blocknote/react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  useFormContext,
} from "@mapform/ui/components/form";
import { Input } from "@mapform/ui/components/input";
import { useCustomBlockContext } from "../../context";
import { Label } from "../../components/label";
import { Disconnected } from "~/components/disconnected";

export const TextInput = createReactBlockSpec(
  {
    type: "textInput",
    propSchema: {
      label: {
        default: "",
        type: "string",
      },
      placeholder: {
        default: "",
        type: "string",
      },
      required: {
        default: false,
        type: "boolean",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const form = useFormContext();
      const { editable, submissionColBlockIds } = useCustomBlockContext();

      if (!submissionColBlockIds.includes(block.id)) {
        return <Disconnected label={block.props.label} />;
      }

      return (
        <FormField
          control={form.control}
          // disabled
          // This is what allows us to match the user value back to the input
          name={block.id}
          render={({ field }) => (
            <FormItem className="mb-4 w-full">
              <Label
                editable={editable}
                label={block.props.label}
                required={block.props.required}
                onLabelChange={(label) => {
                  editor.updateBlock(block, {
                    type: "textInput",
                    props: { label },
                  });
                }}
              />
              <FormControl>
                {editable ? (
                  <Input
                    className="text-muted-foreground bg-white"
                    onChange={(e) => {
                      editor.updateBlock(block, {
                        type: "textInput",
                        props: { placeholder: e.target.value },
                      });
                    }}
                    placeholder="My placeholder text"
                    value={block.props.placeholder}
                  />
                ) : (
                  <Input
                    className="bg-white"
                    {...field}
                    placeholder={block.props.placeholder}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    },
  },
);
