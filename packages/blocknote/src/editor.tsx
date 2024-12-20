"use client";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { insertOrUpdateBlock, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import type { DragHandleMenuProps, SideMenuProps } from "@blocknote/react";
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

interface BlocknoteEditorProps {
  editor: typeof schema.BlockNoteEditor;
  editable?: boolean;
  includeFormBlocks?: boolean;
  onChange?: () => void;
}

export function BlocknoteEditor({
  editor,
  onChange,
  editable = true,
  includeFormBlocks = false,
}: BlocknoteEditorProps) {
  return (
    <BlockNoteView
      className="flex-1"
      editable={editable}
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
              // Only provide inputs for pages
              ...(includeFormBlocks
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
  );
}

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
