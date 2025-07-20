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

interface FeatureProps {
  title: string | null;
  description: string | CustomBlock[] | null;
  icon: string | null;
  images: {
    url: string;
    attribution: string;
  }[];
  properties: {
    id?: string;
    type: Column["type"];
    name: string;
    value: string | number | boolean | null;
  }[];
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
      {/* <div className="mb-4 mt-2 flex flex-col gap-2">
              {projectService.optimisticState.columns.map((column) => (
                <div className="grid grid-cols-2 gap-4" key={column.id}>
                  <PropertyColumnEditor
                    columnId={column.id}
                    columnName={column.name}
                    columnType={column.type}
                  />
                  <PropertyValueEditor
                    columnId={column.id}
                    rowId={featureService.optimisticState!.id}
                    type={column.type}
                    value={
                      featureService.optimisticState?.cells.find(
                        (cell) => cell.columnId === column.id,
                      )?.stringCell?.value ??
                      featureService.optimisticState?.cells.find(
                        (cell) => cell.columnId === column.id,
                      )?.numberCell?.value ??
                      featureService.optimisticState?.cells.find(
                        (cell) => cell.columnId === column.id,
                      )?.booleanCell?.value ??
                      featureService.optimisticState?.cells.find(
                        (cell) => cell.columnId === column.id,
                      )?.dateCell?.value ??
                      null
                    }
                    key={column.id}
                  />
                </div>
              ))}
            </div> */}
      <Blocknote editor={editor} onChange={onDescriptionChange} />
    </div>
  );
}
