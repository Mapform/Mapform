import { useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import type { TextInputBlock } from "./types";

export function TextInputMenu({ blockId }: { blockId: string }) {
  const editor = useBlockNoteEditor<any>();
  const Components = useComponentsContext();
  const block = editor.getBlock(blockId) as TextInputBlock | undefined;

  if (!block) {
    return null;
  }

  if (!Components) {
    return null;
  }

  return (
    <Components.Generic.Menu.Item
      onClick={() => {
        editor.updateBlock(block, {
          type: "textInput",
          props: { required: !block.props.required },
        });
      }}
    >
      {block.props.required ? "Unrequire" : "Require"}
    </Components.Generic.Menu.Item>
  );
}
