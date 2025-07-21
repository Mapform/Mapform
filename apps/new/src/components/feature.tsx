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
import { SmilePlusIcon } from "lucide-react";
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
  images?: {
    imageUrl: string;
    caption?: string;
    attribution?: string;
  }[];
  properties?: Property[];
  onTitleChange?: (title: string) => void;
  onIconChange?: (icon: string | null) => void;
  onDescriptionChange?: (content: {
    blocks: CustomBlock[] | null;
    markdown: string | null;
  }) => void;
}

export function Feature({
  title,
  description,
  icon,
  images,
  properties,
  onTitleChange,
  onIconChange,
  onDescriptionChange,
}: FeatureProps) {
  const editor = useCreateBlockNote({
    schema,
    animations: false,
    initialContent:
      typeof description === "string" ? [] : (description as CustomBlock[]),
  });

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
      <Carousel className="m-0">
        <CarouselContent>
          {images?.map((image) => (
            <CarouselItem className="h-[200px] w-full" key={image.imageUrl}>
              <Image
                className="m-0 size-full"
                src={image.imageUrl}
                alt={image.attribution ?? ""}
                fill
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="px-6 pb-6">
        <Tooltip>
          <EmojiPopover onIconChange={onIconChange}>
            <TooltipTrigger asChild>
              {icon ? (
                <button
                  className="hover:bg-muted rounded-lg text-6xl"
                  type="button"
                >
                  {icon}
                </button>
              ) : onIconChange ? (
                <Button size="icon-sm" type="button" variant="ghost">
                  <SmilePlusIcon className="size-4" />
                </Button>
              ) : null}
            </TooltipTrigger>
          </EmojiPopover>
          <TooltipContent>Add emoji</TooltipContent>
        </Tooltip>
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
