import { createReactBlockSpec } from "@blocknote/react";
import {
  FormField,
  FormItem,
  FormControl,
  useFormContext,
} from "@mapform/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Switch } from "@mapform/ui/components/switch";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { useState } from "react";
import { Input } from "@mapform/ui/components/input";
import { useMapFormContext } from "../../mapform/context";

export const Pin = createReactBlockSpec(
  {
    type: "pin",
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
      const {
        editable,
        isSelectingPinLocationFor,
        setIsSelectingPinLocationFor,
      } = useMapFormContext();

      return (
        <>
          {isSelectingPinLocationFor ? (
            <Button
              className="w-full"
              onClick={() => {
                setIsSelectingPinLocationFor(null);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                setIsSelectingPinLocationFor(block.id);
              }}
              variant="secondary"
            >
              Pick a Location
            </Button>
          )}
          <FormField
            control={form.control}
            // disabled
            // This is what allows us to match the user value back to the input
            name={`${block.id}.latitude`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="" {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            // disabled
            // This is what allows us to match the user value back to the input
            name={`${block.id}.longitude`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="" {...field} type="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      );
    },
  }
);
