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
      onChange={onChange}
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

  return (
    <DragHandleMenu {...props}>
      {props.block.type === "textInput" ? (
        <TextInputMenu blockId={props.block.id} />
      ) : props.block.type === "pin" ? (
        <PinMenu blockId={props.block.id} />
      ) : null}
      <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
    </DragHandleMenu>
  );
}