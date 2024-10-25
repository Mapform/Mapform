"use client";

import { useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import {
  SideMenuController,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { TextIcon, ImageIcon, MapPinIcon, XIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import type { Page } from "@mapform/db/schema";
import { schema, type CustomBlock } from "@mapform/blocknote";
import { AutoSizeTextArea } from "../components/autosize-text-area";
import { CustomSideMenu } from "../components/side-menu";

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
    <div className="flex h-full flex-1 flex-col overflow-y-auto">
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
      <div className="overflow-y-auto p-4">
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
          sideMenu={false}
          slashMenu={false}
        >
          <SuggestionMenuController
            // eslint-disable-next-line @typescript-eslint/require-await -- Needs to return a Promise
            getItems={async (query) => {
              return filterSuggestionItems(
                [
                  ...getDefaultReactSlashMenuItems(editor),
                  // Only provide inputs for pages
                  ...(isPage
                    ? [insertTextInput(editor), insertPin(editor)]
                    : []),
                  insertImage(editor),
                ],
                query,
              );
            }}
            triggerCharacter="/"
          />
          <SideMenuController sideMenu={CustomSideMenu} />
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
  );
}
