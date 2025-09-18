import { Blocknote, useCreateBlockNote } from "@mapform/blocknote";
import type { Column } from "@mapform/db/schema";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { Button } from "@mapform/ui/components/button";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { ImagePlusIcon, PlusIcon, SmilePlusIcon } from "lucide-react";
import {
  type CustomBlock,
  schema,
} from "node_modules/@mapform/blocknote/schema";
import { useEffect, useMemo, useState } from "react";
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
import {
  PropertyAdder,
  PropertyAdderTrigger,
} from "./properties/property-adder";
import { useAction } from "next-safe-action/hooks";
import { updateColumnOrderAction } from "~/data/columns/update-column-order";
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DragHandle, DragItem } from "./draggable";

type Property =
  | {
      columnId: string;
      rowId: string;
      columnName: string;
      columnType: Column["type"];
      value: string | number | boolean | Date | null;
    }
  | {
      columnType: Column["type"];
      columnName: string;
      value: string | number | boolean | Date | null;
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
  projectId?: string;
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
  projectId,
}: FeatureProps) {
  const editor = useCreateBlockNote({
    schema,
    animations: false,
    initialContent:
      typeof description === "string" ? [] : (description as CustomBlock[]),
  });

  const wikiData = useWikidataImages(osmId);
  const images = [...(imageData?.images ?? []), ...wikiData.images];

  const { executeAsync: updateColumnOrderAsync, isPending } = useAction(
    updateColumnOrderAction,
  );

  usePreventPageUnload(isPending);

  // Extract column-backed properties and other properties
  const columnProperties = useMemo(
    () =>
      (properties ?? []).filter(
        (p): p is Extract<Property, { columnId: string }> => "columnId" in p,
      ),
    [properties],
  );
  const otherProperties = useMemo(
    () => (properties ?? []).filter((p) => !("columnId" in p)),
    [properties],
  );

  // Maintain local order for draggable column properties
  const [orderedColumnIds, setOrderedColumnIds] = useState<string[]>(
    columnProperties.map((p) => p.columnId),
  );

  // Sync when incoming properties change
  useEffect(() => {
    setOrderedColumnIds(columnProperties.map((p) => p.columnId));
  }, [columnProperties]);

  const orderedColumnProperties = useMemo(
    () =>
      orderedColumnIds
        .map((id) => columnProperties.find((p) => p.columnId === id))
        .filter(Boolean) as typeof columnProperties,
    [orderedColumnIds, columnProperties],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !projectId || active.id === over.id) return;

    const fromIndex = orderedColumnIds.indexOf(String(active.id));
    const toIndex = orderedColumnIds.indexOf(String(over.id));
    if (fromIndex === -1 || toIndex === -1) return;

    const newOrder = arrayMove(orderedColumnIds, fromIndex, toIndex);
    setOrderedColumnIds(newOrder);

    // Persist to backend
    await updateColumnOrderAsync({
      projectId,
      columnOrder: newOrder,
    });
  };

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
      {images.length > 0 ? (
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
          {images.length === 0 && rowId ? (
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
            className="text-3xl font-bold"
            placeholder="Untitled"
            value={title}
            onChange={onTitleChange}
          />
        ) : (
          <h1 className="text-3xl font-bold">{title}</h1>
        )}
        <div className="mb-4 mt-2 flex flex-col">
          {columnProperties.length ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={orderedColumnIds}
                strategy={verticalListSortingStrategy}
              >
                {orderedColumnProperties.map((property) => (
                  <DragItem id={property.columnId} key={property.columnId}>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <DragHandle
                          className="cursor-pointer"
                          id={property.columnId}
                        >
                          <PropertyColumnEditor
                            columnId={property.columnId}
                            columnName={property.columnName}
                            columnType={property.columnType}
                          />
                        </DragHandle>
                      </div>
                      <div className="col-span-2 flex w-full items-center">
                        <PropertyValueEditor
                          columnId={property.columnId}
                          rowId={property.rowId}
                          type={property.columnType}
                          value={property.value}
                          emptyText="Empty"
                        />
                      </div>
                    </div>
                  </DragItem>
                ))}
              </SortableContext>
            </DndContext>
          ) : null}

          {otherProperties.map((property) => (
            <div className="grid grid-cols-3 gap-4" key={property.columnName}>
              <div className="col-span-1">
                <PropertyColumnEditor
                  columnName={property.columnName}
                  columnType={property.columnType}
                />
              </div>
              <div className="col-span-2 text-wrap break-words">
                {property.value instanceof Date
                  ? format(property.value, "PP hh:mm b", { locale: enUS })
                  : property.value}
              </div>
            </div>
          ))}
          {projectId ? (
            <PropertyAdder projectId={projectId}>
              <PropertyAdderTrigger asChild>
                <Button
                  className="hover:bg-muted cursor-pointer !gap-1.5 self-start rounded !py-1 !pl-2 !pr-3 text-sm"
                  variant="ghost"
                >
                  <PlusIcon className="size-4" /> New
                </Button>
              </PropertyAdderTrigger>
            </PropertyAdder>
          ) : null}
        </div>
        <Blocknote editor={editor} onChange={onDescriptionChange} />
      </div>
    </>
  );
}
