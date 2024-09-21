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
import { cn } from "@mapform/lib/classnames";
import type { Page } from "@mapform/db/schema";
import { schema, type CustomBlock } from "@mapform/blocknote";
import { AutoSizeTextArea } from "./autosize-text-area";
import { CustomSideMenu } from "./side-menu";

interface BlocknoteProps {
  isProduction: boolean;
  title?: string | null;
  description?: {
    content: CustomBlock[];
  };
  isPage?: boolean;
  children?: React.ReactNode;
  contentViewType: Page["contentViewType"];
  locationEditorProps?: {
    onClose: () => void;
  };
  onPrev?: () => void;
  onTitleChange?: (content: string) => void;
  onContentChange?: (content: { content: CustomBlock[] }) => void;
}

export function Blocknote({
  title,
  children,
  description,
  isProduction,
  onTitleChange,
  isPage = false,
  contentViewType,
  onContentChange,
  locationEditorProps,
}: BlocknoteProps) {
  const [uncontrolledTitle, setUncontrolledTitle] = useState<string>(
    title || ""
  );

  const editor = useCreateBlockNote({
    initialContent: description?.content,
    placeholders: {
      default: "Write, or press '/' for commands...",
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
    <div
      className={cn("h-full flex flex-col prose mx-auto relative", {
        "max-h-[300px]": contentViewType === "map",
      })}
    >
      <div className="flex-1 flex flex-col overflow-y-auto">
        {locationEditorProps ? (
          <Button
            className="absolute top-2 right-2"
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
          {!isProduction ? (
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
            editable={!isProduction}
            editor={editor}
            onChange={() => {
              onContentChange &&
                onContentChange({
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
                  query
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
      {children}
    </div>
  );
}
