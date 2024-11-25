"use client";

import { useState } from "react";
import {
  schema,
  type CustomBlock,
  BlocknoteEditor,
  useCreateBlockNote,
} from "@mapform/blocknote";
import { ImagePlusIcon, SmilePlusIcon, XIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import type { Page } from "@mapform/db/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AutoSizeTextArea } from "../components/autosize-text-area";

interface BlocknoteProps {
  editable: boolean;
  title?: string | null;
  currentPage: Page;
  description?: {
    content: CustomBlock[];
  };
  isPage?: boolean;
  locationEditorProps?: {
    onClose: () => void;
  };
  onPrev?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
}

export function Blocknote({
  title,
  editable,
  description,
  onTitleChange,
  isPage = false,
  onDescriptionChange,
  locationEditorProps,
}: BlocknoteProps) {
  const [uncontrolledTitle, setUncontrolledTitle] = useState<string>(
    title || "",
  );

  const editor = useCreateBlockNote({
    initialContent: description?.content,
    placeholders: {
      default: editable ? "Write, or press '/' for commands..." : "",
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
        {editable ? (
          <div className="text-muted-foreground -ml-2 -mt-2 flex gap-0.5 pb-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <SmilePlusIcon className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full overflow-hidden bg-none p-0">
                <Picker data={data} onEmojiSelect={console.log} theme="light" />
              </PopoverContent>
            </Popover>
            <Button size="icon-sm" variant="ghost">
              <ImagePlusIcon className="size-4" />
            </Button>
          </div>
        ) : (
          <></>
        )}

        {/* Title */}
        {editable ? (
          <AutoSizeTextArea
            onChange={(val) => {
              setUncontrolledTitle(val);
              onTitleChange && onTitleChange(val);
            }}
            onEnter={() => {
              if (description?.content[0]) {
                editor.setTextCursorPosition(description.content[0], "start");
              }
              editor.focus();
            }}
            value={uncontrolledTitle}
          />
        ) : (
          <h1 className="mb-2 w-full border-0 p-0 text-2xl font-bold">
            {title ?? "Untitled"}
          </h1>
        )}

        {/* Description */}
        <BlocknoteEditor
          editable={editable}
          editor={editor}
          includeFormBlocks={!isPage}
          onChange={() => {
            onDescriptionChange &&
              onDescriptionChange({
                content: editor.document,
              });
          }}
        />
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Disable a11y checks here */}
      <div
        className="flex-1"
        onClick={() => {
          editor.focus();
        }}
      />
    </div>
  );
}
