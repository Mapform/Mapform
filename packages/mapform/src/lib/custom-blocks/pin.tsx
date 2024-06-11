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
import { useMapFormContext } from "../../mapform/context";
import { Button } from "@mapform/ui/components/button";

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

      return (
        <Button className="w-full" variant="secondary">
          Pick a Location
        </Button>
      );
    },
  }
);
