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
import { DialogContent, DialogTrigger } from "@mapform/ui/components/dialog";
import { Dialog } from "@mapform/ui/components/dialog";

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
      const { isEditing, imageBlock } = useCustomBlockContext();

      const renderImage = () => (
        <Dialog>
          <DialogTrigger>
            <NextImage
              alt="Image"
              height={0}
              sizes="100vw"
              src={block.props.imageUrl}
              style={{
                width: "100%",
                height: "auto",
                margin: 0,
                borderRadius: "0.25rem",
              }}
              width={0}
            />
          </DialogTrigger>
          <DialogContent className="border-none bg-transparent p-0">
            <NextImage
              alt="Image"
              height={0}
              sizes="100vw"
              src={block.props.imageUrl}
              style={{
                width: "100%",
                height: "auto",
                margin: 0,
                borderRadius: "0.25rem",
              }}
              width={0}
            />
          </DialogContent>
        </Dialog>
      );

      const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
          return;
        }

        if (imageBlock?.onImageUpload) {
          setIsUploading(true);
          const image = await imageBlock.onImageUpload(file);
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

      if (isEditing) {
        if (block.props.imageUrl) {
          return renderImage();
        }

        return (
          <Popover modal defaultOpen>
            <PopoverTrigger className="w-full">
              <div className="flex w-full items-center gap-2 rounded-md bg-gray-100 p-2 text-sm font-medium text-stone-500">
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
          <div className="flex w-full justify-center rounded bg-gray-100 p-2 text-sm text-stone-500">
            <ImageOffIcon />
          </div>
        );
      }

      return renderImage();
    },
  },
);
