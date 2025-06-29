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
import { schema, type CustomBlock } from "./schema";

interface BlocknoteProps {
  content: CustomBlock[] | null;
  onChange: (content: CustomBlock[] | null) => void;
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
