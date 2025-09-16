import { Blocknote, useCreateBlockNote } from "@mapform/blocknote";
import type { Column } from "@mapform/db/schema";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { Button } from "@mapform/ui/components/button";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { ImagePlusIcon, SmilePlusIcon } from "lucide-react";
import {
  type CustomBlock,
  schema,
} from "node_modules/@mapform/blocknote/schema";
import { useEffect } from "react";
import { PropertyColumnEditor } from "./properties/property-column-editor";
import { PropertyValueEditor } from "./properties/property-value-editor";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@mapform/ui/components/carousel";
import Image from "next/image";
import { Skeleton } from "@mapform/ui/components/skeleton";
import {
  ImageUploaderContent,
  ImageUploaderPopover,
  ImageUploaderTrigger,
} from "./image-uploder";
import { cn } from "@mapform/lib/classnames";
import { useWikidataImages } from "~/lib/wikidata-image";

type Property =
  | {
      columnId: string;
      rowId: string;
      columnName: string;
      columnType: Column["type"];
      value: string | number | boolean | null;
    }
  | {
      columnType: Column["type"];
      columnName: string;
      value: string | number | boolean | null;
    };

interface FeatureProps {
  title: string;
  description?: string | CustomBlock[];
  icon?: string;
  imageData?: {
    images: {
      imageUrl: string;
    }[];
    isLoading?: boolean;
    error?: string | null;
  };
  properties?: Property[];
  onTitleChange?: (title: string) => void;
  onIconChange?: (icon: string | null) => void;
  onDescriptionChange?: (content: {
    blocks: CustomBlock[] | null;
    markdown: string | null;
  }) => void;
  rowId?: string;
  osmId?: string;
}

export function Feature({
  title,
  description,
  icon,
  imageData,
  properties,
  onTitleChange,
  onIconChange,
  onDescriptionChange,
  rowId,
  osmId,
}: FeatureProps) {
  const editor = useCreateBlockNote({
    schema,
    animations: false,
    initialContent:
      typeof description === "string" ? [] : (description as CustomBlock[]),
  });

  const wikiData = useWikidataImages(osmId);
  const images = [...(imageData?.images ?? []), ...(wikiData.images ?? [])];

  // As per https://www.blocknotejs.org/docs/editor-api/converting-blocks#parsing-markdown-to-blocks
  useEffect(() => {
    void (async () => {
      if (!description) {
        return [];
      }

      if (typeof description === "string") {
        const blocks = await editor.tryParseMarkdownToBlocks(description);
        editor.replaceBlocks(editor.document, blocks);
      }

      return description;
    })();
  }, [description, editor]);

  return (
    <>
      {imageData?.isLoading ? (
        <Skeleton className="mb-4 h-[200px] w-full" />
      ) : null}
      {images?.length ? (
        <Carousel className="m-0 mb-4">
          <CarouselContent className="m-0">
            {images.map((image) => (
              <CarouselItem
                className="relative h-[200px] w-full flex-shrink-0 p-0"
                key={image.imageUrl}
              >
                <Image
                  className="m-0 size-full"
                  src={image.imageUrl}
                  alt={""}
                  fill
                  objectFit="cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : null}
      <div className="z-10 px-6 pb-6">
        <div>
          <Tooltip>
            {icon ? (
              <div
                className={cn("relative z-10 mb-2", {
                  "-mt-12": images.length,
                })}
              >
                <EmojiPopover onIconChange={onIconChange}>
                  <TooltipTrigger asChild>
                    <button
                      className="rounded-lg text-6xl hover:bg-gray-200/50"
                      type="button"
                    >
                      {icon}
                    </button>
                  </TooltipTrigger>
                </EmojiPopover>
              </div>
            ) : onIconChange ? (
              <EmojiPopover onIconChange={onIconChange}>
                <TooltipTrigger asChild>
                  <Button size="icon-sm" type="button" variant="ghost">
                    <SmilePlusIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
              </EmojiPopover>
            ) : null}
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
          {!images.length && rowId ? (
            <Tooltip>
              <ImageUploaderPopover>
                <ImageUploaderTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <ImagePlusIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                </ImageUploaderTrigger>
                <ImageUploaderContent rowId={rowId} />
              </ImageUploaderPopover>
              <TooltipContent>Add cover photo</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        {onTitleChange ? (
          <AutoSizeTextArea
            className="text-4xl font-bold"
            placeholder="Untitled"
            value={title ?? ""}
            onChange={onTitleChange}
          />
        ) : (
          <h1 className="text-4xl font-bold">{title ?? "Untitled"}</h1>
        )}
        <div className="mb-4 mt-2 flex flex-col gap-2">
          {properties?.map((property) =>
            "columnId" in property ? (
              <div className="grid grid-cols-3 gap-4" key={property.columnId}>
                <div className="col-span-1">
                  <PropertyColumnEditor
                    columnId={property.columnId}
                    columnName={property.columnName}
                    columnType={property.columnType}
                  />
                </div>
                <div className="col-span-2">
                  <PropertyValueEditor
                    columnId={property.columnId}
                    rowId={property.rowId}
                    type={property.columnType}
                    value={property.value}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4" key={property.columnName}>
                <div className="col-span-1">
                  <PropertyColumnEditor
                    columnName={property.columnName}
                    columnType={property.columnType}
                  />
                </div>
                <div className="col-span-2 text-wrap break-words">
                  {property.value}
                </div>
              </div>
            ),
          )}
        </div>
        <Blocknote editor={editor} onChange={onDescriptionChange} />
      </div>
    </>
  );
}
