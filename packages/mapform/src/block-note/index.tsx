"use client";

import { useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { TextIcon, ChevronLeftIcon, ImageIcon, MapPinIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { schema, type CustomBlock } from "@mapform/blocknote";
import "./style.css";
import { AutoSizeTextArea } from "./autosize-text-area";

interface BlocknoteProps {
  editable: boolean;
  title?: string | null;
  description?: {
    content: CustomBlock[];
  };
  defaultFormValues?: Record<string, string>;
  onNext?: () => void;
  onPrev?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
}

export function Blocknote({
  title,
  onPrev,
  editable,
  description,
  onTitleChange,
  onDescriptionChange,
}: BlocknoteProps) {
  const [uncontrolledTitle, setUncontrolledTitle] = useState<string>(
    title || ""
  );

  const editor = useCreateBlockNote({
    initialContent: description?.content,
    placeholders: {
      default: "Write something, or press '/' for commands...",
    },
    schema,
  });

  const insertPin = (edtr: typeof schema.BlockNoteEditor) => ({
    title: "Pin",
    onItemClick: () => {
      insertOrUpdateBlock(edtr, {
        type: "pin",
      });
    },
    aliases: ["location", "pins"],
    group: "Inputs",
    icon: <MapPinIcon />,
  });

  const insertTextInput = (edtr: typeof schema.BlockNoteEditor) => ({
    title: "Text Input",
    onItemClick: () => {
      insertOrUpdateBlock(edtr, {
        type: "textInput",
      });
    },
    aliases: ["input", "short-text"],
    group: "Inputs",
    icon: <TextIcon />,
  });

  const insertImage = (edtr: typeof schema.BlockNoteEditor) => ({
    title: "Image",
    onItemClick: () => {
      insertOrUpdateBlock(edtr, {
        type: "image",
      });
    },
    aliases: ["photo"],
    group: "Media",
    icon: <ImageIcon />,
  });

  // Renders the editor instance using a React component.
  return (
    <div className="h-full flex flex-col prose mx-auto">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Content */}
        <div className="overflow-y-auto p-4 pb-0">
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
            <h1 className="border-0 text-2xl font-bold w-full mb-2 p-0">
              {title ?? "Untitled"}
            </h1>
          )}

          {/* Description */}
          <BlockNoteView
            className="flex-1"
            editable={editable}
            editor={editor}
            onChange={() => {
              onDescriptionChange &&
                onDescriptionChange({
                  content: editor.document,
                });
            }}
            slashMenu={false}
          >
            <SuggestionMenuController
              // eslint-disable-next-line @typescript-eslint/require-await -- Needs to return a Promise
              getItems={async (query) => {
                return filterSuggestionItems(
                  [
                    ...getDefaultReactSlashMenuItems(editor),

                    insertPin(editor),
                    insertTextInput(editor),
                    insertImage(editor),
                  ],
                  query
                );
              }}
              triggerCharacter="/"
            />
          </BlockNoteView>
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Disable a11y checks here */}
        <div
          className="flex-1"
          onClick={() => {
            editor.focus();
          }}
        />
      </div>
      <div className="mt-auto flex justify-between p-4">
        <div className="gap-2">
          <Button
            disabled={editable}
            onClick={onPrev}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeftIcon />
          </Button>
        </div>
        <Button disabled={editable} type="submit">
          Next
        </Button>
      </div>
    </div>
  );
}
