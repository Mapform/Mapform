/* eslint-disable react-hooks/rules-of-hooks -- Valid */
import { createReactBlockSpec } from "@blocknote/react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useFormContext,
} from "@mapform/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Input } from "@mapform/ui/components/input";
import { Switch } from "@mapform/ui/components/switch";
import { EllipsisIcon } from "lucide-react";
import { Label } from "@mapform/ui/components/label";
import { useCustomBlockContext } from "../context";

export const TextInput = createReactBlockSpec(
  {
    type: "textInput",
    propSchema: {
      label: {
        default: "My Label",
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
      const { editable } = useCustomBlockContext();

      return (
        <FormField
          control={form.control}
          // disabled
          // This is what allows us to match the user value back to the input
          name={block.id}
          render={({ field }) => (
            <FormItem className="w-full">
              {editable ? (
                <div className="flex justify-between">
                  <input
                    className="text-sm font-medium border-0 w-full p-0 outline-none border-transparent focus:border-transparent focus:ring-0 placeholder-gray-300"
                    onChange={(e) => {
                      editor.updateBlock(block, {
                        type: "textInput",
                        props: { label: e.target.value },
                      });
                    }}
                    placeholder="Label"
                    value={block.props.label}
                  />
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisIcon className="h-4 w-4" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="text-xs font-semibold leading-6 text-gray-400 mb-2">
                        Settings
                      </div>
                      <Label className="flex justify-between items-center">
                        Required
                        <Switch
                          checked={block.props.required}
                          onCheckedChange={(e) => {
                            editor.updateBlock(block, {
                              type: "textInput",
                              props: { required: e },
                            });
                          }}
                        />
                      </Label>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <FormLabel>{block.props.label}</FormLabel>
              )}
              <FormControl>
                {editable ? (
                  <Input
                    className="text-muted-foreground"
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
                  <Input {...field} placeholder={block.props.placeholder} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    },
  }
);
