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
        console.log(11111, e.target.files?.[0]);

        if (onImageUpload) {
          const image = await onImageUpload(e.target.files?.[0] as File);

          if (!image) {
            return;
          }

          console.log(111111, image);

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
