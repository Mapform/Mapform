/* eslint-disable react-hooks/rules-of-hooks -- Valid */
import { createReactBlockSpec } from "@blocknote/react";
import {
  FormField,
  FormItem,
  FormControl,
  useFormContext,
  FormLabel,
  FormMessage,
} from "@mapform/ui/components/form";
import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
import { AsteriskIcon } from "lucide-react";
import { useCustomBlockContext } from "../../context";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";

export const Pin = createReactBlockSpec(
  {
    type: "pin",
    propSchema: {
      label: {
        default: "",
        type: "string",
      },
      text: {
        default: "Pick a Location",
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
      const { isEditing, pinBlock } = useCustomBlockContext();

      if (isEditing) {
        return (
          <div className="mb-4 flex w-full flex-col gap-2">
            <div className="flex flex-1 justify-between">
              <AutoSizeTextArea
                className="p-0 text-base font-medium placeholder-gray-300"
                value={block.props.label}
                onChange={(label) =>
                  editor.updateBlock(block, {
                    type: "pin",
                    props: { label },
                  })
                }
              />
              {block.props.required ? (
                <AsteriskIcon height={14} width={14} />
              ) : null}
            </div>
            <Button
              className="relative w-full cursor-default"
              variant="secondary"
            >
              <input
                className="w-full border-0 border-transparent bg-transparent p-0 text-center text-sm font-medium outline-none focus:border-transparent focus:ring-0"
                onChange={(e) => {
                  editor.updateBlock(block, {
                    type: "pin",
                    props: { text: e.target.value },
                  });
                }}
                value={block.props.text}
              />
            </Button>
          </div>
        );
      }

      const currentLatitude = form.watch(`${block.id}.y`) as number;
      const currentLongitude = form.watch(`${block.id}.x`) as number;

      const hasLocation = currentLatitude && currentLongitude;

      return (
        <FormField
          control={form.control}
          // disabled
          // This is what allows us to match the user value back to the input
          name={`${block.id}.x`}
          render={({ field: longitudeField }) => (
            <FormField
              control={form.control}
              // disabled
              // This is what allows us to match the user value back to the input
              name={`${block.id}.y`}
              render={({ field: latitudeField }) => (
                <div className="fiex mb-4 w-full flex-col space-y-2">
                  <FormLabel className="flex justify-between text-base font-medium">
                    {block.props.label}
                    {block.props.required ? (
                      <AsteriskIcon height={14} width={14} />
                    ) : null}
                  </FormLabel>
                  <Button
                    className="relative w-full"
                    onClick={() => {
                      pinBlock?.setIsSelectingLocationFor(block.id);
                    }}
                    type="button"
                    variant="secondary"
                  >
                    {hasLocation
                      ? `Selected: ${currentLatitude.toFixed(5)},${currentLongitude.toFixed(5)}`
                      : block.props.text}
                  </Button>

                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="" {...longitudeField} type="hidden" />
                    </FormControl>
                  </FormItem>

                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="" {...latitudeField} type="hidden" />
                    </FormControl>
                  </FormItem>
                  <FormMessage />
                </div>
              )}
            />
          )}
        />
      );
    },
  },
);
