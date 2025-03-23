"use client";

import {
  schema,
  type CustomBlock,
  BlocknoteEditor,
  useCreateBlockNote,
  useCustomBlockContext,
} from "@mapform/blocknote";
import { XIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { cn } from "@mapform/lib/classnames";
import { useMemo } from "react";

interface BlocknoteProps {
  // null means the property exists but no value, undefined means the property does not exist
  icon?: string | null;
  // null means the property exists but no value, undefined means the property does not exist
  title?: string | null;
  // null means the property exists but no value, undefined means the property does not exist
  description?: {
    content: CustomBlock[];
  } | null;
  includeFormBlocks?: boolean;
  locationEditorProps?: {
    onClose: () => void;
  };
  isFeature?: boolean;
  controls?: React.ReactNode;
  onPrev?: () => void;
  onIconChange?: (icon: string | null) => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
}

export function Blocknote({
  icon,
  title,
  controls,
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

  const iconElement = useMemo(() => {
    if (icon === undefined) {
      return null;
    }

    if (isEditing) {
      return (
        <EmojiPopover onIconChange={onIconChange}>
          <button className="mb-2 text-6xl" type="button">
            {icon}
          </button>
        </EmojiPopover>
      );
    }

    return <div className="mb-2 text-6xl">{icon}</div>;
  }, [icon, isEditing, onIconChange]);

  const titleElement = useMemo(() => {
    if (title === undefined) {
      return null;
    }

    if (isEditing) {
      return (
        <AutoSizeTextArea
          className="mb-4 text-3xl font-bold placeholder-gray-300"
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
      );
    }

    return (
      <h1 className="mb-2 w-full border-0 p-0 text-3xl font-bold">
        {title ?? "Untitled"}
      </h1>
    );
  }, [title, isEditing, onTitleChange, description?.content, editor]);

  const descriptionElement = useMemo(() => {
    if (description === undefined) {
      return null;
    }

    return (
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
    );
  }, [description, includeFormBlocks, editor, onDescriptionChange]);

  // Renders the editor instance using a React component.
  return (
    <div className="relative flex max-h-full flex-1 flex-col">
      {controls ? (
        <div className="text-muted-foreground absolute left-2 top-2 flex gap-0.5">
          {controls}
        </div>
      ) : null}

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
      <div className={cn("p-4 md:overflow-y-auto", controls ? "mt-8" : "")}>
        {iconElement}
        {titleElement}
        {descriptionElement}
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
