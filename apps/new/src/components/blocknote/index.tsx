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

export function Blocknote() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    animations: false,
  });

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView editor={editor} sideMenu={false} className="h-full">
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
