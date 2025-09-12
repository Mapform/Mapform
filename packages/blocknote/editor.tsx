import { BlockNoteView } from "@blocknote/mantine";
// Note: CSS imports have been moved to blocknote.css
// Import this file in your app's main CSS or layout file:
// import "@mapform/blocknote/blocknote.css";

import {
  DragHandleButton,
  SideMenu,
  SideMenuController,
} from "@blocknote/react";
import { schema, type CustomBlock } from "./schema";

interface BlocknoteProps {
  editor: typeof schema.BlockNoteEditor;
  onChange?: (content: {
    blocks: CustomBlock[] | null;
    markdown: string | null;
  }) => void;
}

export function Blocknote({ onChange, editor }: BlocknoteProps) {
  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      editable={!!onChange}
      sideMenu={false}
      className="h-full"
      theme="light"
      onChange={async () => {
        onChange?.({
          blocks: editor.document,
          markdown: await editor.blocksToMarkdownLossy(editor.document),
        });
      }}
    >
      <SideMenuController
        sideMenu={(props) => (
          <SideMenu {...props}>
            {/* Button which removes the hovered block. */}
            <DragHandleButton {...props} />
          </SideMenu>
        )}
      />
    </BlockNoteView>
  );
}
