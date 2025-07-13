import { BlockNoteView } from "@blocknote/mantine";
// Note: CSS imports have been moved to blocknote.css
// Import this file in your app's main CSS or layout file:
// import "@mapform/blocknote/blocknote.css";

import {
  DragHandleButton,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { schema, type CustomBlock } from "./schema";

interface BlocknoteProps {
  content: CustomBlock[] | null;
  onChange: (content: {
    blocks: CustomBlock[] | null;
    markdown: string | null;
  }) => void;
}

export function Blocknote({ content, onChange }: BlocknoteProps) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    animations: false,
    initialContent: content ?? undefined,
  });

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      sideMenu={false}
      className="h-full"
      onChange={async () => {
        onChange({
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
