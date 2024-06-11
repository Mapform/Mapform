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
import { Switch } from "@mapform/ui/components/switch";
import { EllipsisIcon } from "lucide-react";
import { Label } from "@mapform/ui/components/label";
import { Button } from "@mapform/ui/components/button";
import { useMapFormContext } from "../../mapform/context";
import { useState } from "react";
import { Input } from "@mapform/ui/components/input";

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
      const { editable } = useMapFormContext();
      const [isSelecting, setIsSelecting] = useState(false);

      return (
        <>
          {isSelecting ? (
            <Button
              className="w-full"
              onClick={() => {
                setIsSelecting(false);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                setIsSelecting(true);
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
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} type="number" />
                </FormControl>
                <FormMessage />
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
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    },
  }
);
