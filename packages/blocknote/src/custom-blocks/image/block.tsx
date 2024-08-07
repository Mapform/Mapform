/* eslint-disable react-hooks/rules-of-hooks -- Valid */
import { useState } from "react";
import { createReactBlockSpec } from "@blocknote/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Input } from "@mapform/ui/components/input";
import NextImage from "next/image";
import { ImageIcon, ImageOffIcon } from "lucide-react";
import { useCustomBlockContext } from "../../context";

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
      const [isUploading, setIsUploading] = useState(false);
      const { editable, onImageUpload } = useCustomBlockContext();

      const renderImage = () => (
        <NextImage
          alt="Image"
          height={0}
          sizes="100vw"
          src={block.props.imageUrl}
          style={{ width: "100%", height: "auto" }} // optional
          width={0}
        />
      );

      const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
          return;
        }

        if (onImageUpload) {
          setIsUploading(true);
          const image = await onImageUpload(file);
          setIsUploading(false);

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
          return renderImage();
        }

        return (
          <Popover defaultOpen>
            <PopoverTrigger className="w-full">
              <div className="w-full p-2 bg-gray-100 rounded-md text-stone-500 text-sm flex gap-2 items-center font-medium">
                <ImageIcon />
                <span>Add an image</span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Input
                disabled={isUploading}
                onChange={onFileChange}
                type="file"
              />
            </PopoverContent>
          </Popover>
        );
      }

      if (!block.props.imageUrl) {
        return (
          <div className="w-full p-2 bg-gray-100 rounded text-stone-500 text-sm flex justify-center">
            <ImageOffIcon />
          </div>
        );
      }

      return renderImage();
    },
  }
);
