"use client";

import {
  schema,
  type CustomBlock,
  BlocknoteEditor,
  useCreateBlockNote,
  useCustomBlockContext,
} from "@mapform/blocknote";
import { SmilePlusIcon, XIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";

interface BlocknoteProps {
  icon?: string | null;
  title?: string | null;
  description?: {
    content: CustomBlock[];
  };
  includeFormBlocks?: boolean;
  locationEditorProps?: {
    onClose: () => void;
  };
  onPrev?: () => void;
  onIconChange?: (icon: string | null) => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
}

export function Blocknote({
  icon,
  title,
  description,
  onIconChange,
  onTitleChange,
  includeFormBlocks = false,
  onDescriptionChange,
  locationEditorProps,
}: BlocknoteProps) {
  const { isEditing } = useCustomBlockContext();

  const editor = useCreateBlockNote({
    animations: false,
    initialContent: description?.content,
    placeholders: {
      default: isEditing ? "Write, or press '/' for commands..." : "",
    },
    schema,
  });

  // Renders the editor instance using a React component.
  return (
    <div className="flex max-h-full flex-1 flex-col md:overflow-y-auto">
      {locationEditorProps ? (
        <Button
          className="absolute right-2 top-2"
          onClick={locationEditorProps.onClose}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <XIcon className="size-4" />
        </Button>
      ) : null}

      {/* Content */}
      <div className="p-4 md:overflow-y-auto">
        {/* Emoji */}
        {isEditing ? (
          <div className="text-muted-foreground -ml-2 -mt-2 flex gap-0.5 pb-2">
            {!icon ? (
              <EmojiPopover onIconChange={onIconChange}>
                <Button size="icon-sm" type="button" variant="ghost">
                  <SmilePlusIcon className="size-4" />
                </Button>
              </EmojiPopover>
            ) : null}
            {/* <Button size="icon-sm" type="button" variant="ghost">
              <ImagePlusIcon className="size-4" />
            </Button> */}
          </div>
        ) : null}
        {icon ? (
          isEditing ? (
            <EmojiPopover onIconChange={onIconChange}>
              <button className="mb-2 text-6xl" type="button">
                {icon}
              </button>
            </EmojiPopover>
          ) : (
            <div className="mb-2 text-6xl">{icon}</div>
          )
        ) : null}

        {/* Title */}
        {isEditing ? (
          <AutoSizeTextArea
            className="mb-2 text-3xl font-bold placeholder-gray-300"
            onChange={(val) => {
              if (onTitleChange) onTitleChange(val);
            }}
            onEnter={() => {
              if (description?.content[0]) {
                editor.setTextCursorPosition(description.content[0], "start");
              }
              editor.focus();
            }}
            value={title ?? ""}
          />
        ) : (
          <h1 className="mb-2 w-full border-0 p-0 text-3xl font-bold">
            {title ?? "Untitled"}
          </h1>
        )}

        {/* Description */}
        <BlocknoteEditor
          editor={editor}
          includeFormBlocks={includeFormBlocks}
          onChange={() => {
            if (onDescriptionChange)
              onDescriptionChange({
                content: editor.document,
              });
          }}
        />
      </div>
      <div
        className="flex-1"
        onClick={() => {
          editor.focus();
        }}
      />
    </div>
  );
}
