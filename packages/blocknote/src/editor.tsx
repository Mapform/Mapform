"use client";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { insertOrUpdateBlock, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import type {
  DefaultReactSuggestionItem,
  DragHandleMenuProps,
  SideMenuProps,
  SuggestionMenuProps,
} from "@blocknote/react";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  SideMenuController,
  DragHandleMenu,
  RemoveBlockItem,
  SideMenu,
  useComponentsContext,
} from "@blocknote/react";
import { MapPinIcon, TextIcon, ImageIcon } from "lucide-react";
import type { schema } from "./block-note-schema";
import { PinMenu, TextInputMenu } from "./block-note-schema";
import { cn } from "../../lib/classnames";
import "./style.css";
import { useCustomBlockContext } from "./context";
import React from "react";

const insertPin = (edtr: typeof schema.BlockNoteEditor) => ({
  title: "Location Input",
  onItemClick: () => {
    insertOrUpdateBlock(edtr, {
      type: "pin",
    });
  },
  aliases: ["location", "pins"],
  group: "Form blocks",
  icon: <MapPinIcon className="size-4" />,
  subtext: "Capture location from user",
});

const insertTextInput = (edtr: typeof schema.BlockNoteEditor) => ({
  title: "Text Input",
  onItemClick: () => {
    insertOrUpdateBlock(edtr, {
      type: "textInput",
    });
  },
  aliases: ["input", "short-text"],
  group: "Form blocks",
  icon: <TextIcon className="size-4" />,
  subtext: "Capture text from user",
});

const insertImage = (edtr: typeof schema.BlockNoteEditor) => ({
  title: "Image",
  onItemClick: () => {
    insertOrUpdateBlock(edtr, {
      type: "image",
    });
  },
  aliases: ["photo"],
  group: "Basic blocks",
  icon: <ImageIcon className="size-4" />,
  subtext: "Upload an image",
});

interface BlocknoteEditorProps {
  editor: typeof schema.BlockNoteEditor;
  includeFormBlocks?: boolean;
  onChange?: () => void;
}

export const BlocknoteEditor = React.memo(function BlocknoteEditor({
  editor,
  onChange,
  includeFormBlocks = false,
}: BlocknoteEditorProps) {
  const { isEditing } = useCustomBlockContext();

  return (
    <BlockNoteView
      className="flex-1"
      editable={isEditing}
      editor={editor}
      emojiPicker={false}
      onChange={onChange}
      sideMenu={false}
      slashMenu={false}
      // Force Blocknote to use light mode
      theme="light"
    >
      <SuggestionMenuController
        getItems={async (query) => {
          return filterSuggestionItems(
            [
              ...getDefaultReactSlashMenuItems(editor).filter(
                (i) => i.title !== "Emoji",
              ),
              insertImage(editor),
              // Only provide inputs for pages
              ...(includeFormBlocks
                ? [insertTextInput(editor), insertPin(editor)]
                : []),
            ],
            query,
          );
        }}
        suggestionMenuComponent={SuggestionMenu}
        triggerCharacter="/"
      />
      <SideMenuController sideMenu={CustomSideMenu} />
    </BlockNoteView>
  );
});

function CustomSideMenu(props: SideMenuProps) {
  return <SideMenu {...props} dragHandleMenu={CustomDragMenu} />;
}

function CustomDragMenu(props: DragHandleMenuProps) {
  const Components = useComponentsContext();

  if (!Components) {
    return null;
  }

  const renderBlock = (block: DragHandleMenuProps["block"]) => {
    // @ts-ignore -- TS might have a bug, need to ignore
    if (block.type === "textInput") {
      return <TextInputMenu blockId={props.block.id} />;
    }

    // @ts-ignore -- TS might have a bug, need to ignore
    if (block.type === "pin") {
      return <PinMenu blockId={props.block.id} />;
    }

    return null;
  };

  return (
    <DragHandleMenu {...props}>
      {renderBlock(props.block)}
      <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
    </DragHandleMenu>
  );
}

function SuggestionMenu({
  items,
  selectedIndex,
  onItemClick,
}: SuggestionMenuProps<DefaultReactSuggestionItem>) {
  const groupedItems = Object.groupBy(items, (item) => item.group!);

  const renderItem = (item: (typeof items)[0]) => (
    <div
      className={cn(
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        {
          "bg-accent text-accent-foreground":
            items.indexOf(item) === selectedIndex,
        },
      )}
      key={item.title}
      onClick={() => {
        onItemClick?.(item);
      }}
    >
      <div className="flex items-center justify-center flex-shrink-0 rounded-lg size-10 bg-gray-50">
        <span className="size-4">{item.icon}</span>
      </div>
      <div className="flex flex-col">
        <div>{item.title}</div>
        <div className="text-xs text-muted-foreground">{item.subtext}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-popover text-popover-foreground z-50 w-[300px] space-y-1 overflow-hidden overflow-y-auto rounded-md border shadow-md">
      {Object.entries(groupedItems).map(([group, items]) => (
        <div key={group} className="border-b last:border-0">
          <div className="p-1 space-y-1">
            <div className="text-sidebar-foreground/70 ring-sidebar-ring ml-2 flex h-6 shrink-0 items-center rounded-md text-xs font-medium outline-none transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2">
              {group}
            </div>
            {items?.map(renderItem)}
          </div>
        </div>
      ))}
    </div>
  );
}
