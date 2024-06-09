import { createReactBlockSpec } from "@blocknote/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Input } from "@mapform/ui/components/input";
import { Switch } from "@mapform/ui/components/switch";
import { EllipsisIcon, ImageIcon, ImageOffIcon } from "lucide-react";
import { Label } from "@mapform/ui/components/label";
import { useMapFormContext } from "../../mapform/context";

export const Image = createReactBlockSpec(
  {
    type: "image",
    propSchema: {
      imageUrl: {
        default: "",
        type: "string",
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const { editable, onImageUpload } = useMapFormContext();

      const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
          return;
        }

        if (onImageUpload) {
          const image = await onImageUpload(file);

          if (!image) {
            return;
          }

          editor.updateBlock(block, {
            type: "image",
            props: { imageUrl: image },
          });
        }
      };

      if (editable) {
        if (block.props.imageUrl) {
          return (
            <div>
              <img alt="Image" src={block.props.imageUrl} />
            </div>
          );
        }

        return (
          <Popover>
            <PopoverTrigger className="w-full">
              <div className="w-full p-2 bg-gray-100 rounded text-gray-500 text-sm flex gap-2 items-center font-medium">
                <ImageIcon />
                <span>Add an image</span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Input onChange={onFileChange} type="file" />
            </PopoverContent>
          </Popover>
        );
      }

      if (!block.props.imageUrl) {
        return (
          <div className="w-full p-2 bg-gray-100 rounded text-gray-500 text-sm flex justify-center">
            <ImageOffIcon />
          </div>
        );
      }

      return (
        <div>
          <img alt="Image" src={block.props.imageUrl} />
        </div>
      );
    },
  }
);
