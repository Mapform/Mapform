import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  DragHandleButton,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import "./style.css";
import type { PartialBlock } from "@blocknote/core";

interface BlocknoteProps {
  content: PartialBlock[];
  onChange: (content: PartialBlock[]) => void;
}

export function Blocknote({ content, onChange }: BlocknoteProps) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    animations: false,
    initialContent: content,
  });

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      sideMenu={false}
      className="h-full"
      onChange={() => {
        onChange(editor.document);
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
