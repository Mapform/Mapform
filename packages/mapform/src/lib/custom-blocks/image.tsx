import { createReactBlockSpec } from "@blocknote/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Input } from "@mapform/ui/components/input";
import { Switch } from "@mapform/ui/components/switch";
import { EllipsisIcon, ImageIcon } from "lucide-react";
import { Label } from "@mapform/ui/components/label";
import { useStepContext } from "../../mapform/block-note/context";

export const Image = createReactBlockSpec(
  {
    type: "image",
    propSchema: {
      // label: {
      //   default: "My Label",
      //   type: "string",
      // },
      // placeholder: {
      //   default: "",
      //   type: "string",
      // },
      // required: {
      //   default: false,
      //   type: "boolean",
      // },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const { editable } = useStepContext();

      return (
        <Popover>
          <PopoverTrigger className="w-full">
            <div className="w-full p-2 bg-gray-100 rounded text-gray-500 text-sm flex gap-2 items-center font-medium">
              <ImageIcon />
              <span>Add an image</span>
            </div>
          </PopoverTrigger>
          <PopoverContent>Upload</PopoverContent>
        </Popover>
      );
    },
  }
);
