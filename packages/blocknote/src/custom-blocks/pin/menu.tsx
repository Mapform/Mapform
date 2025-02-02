import { useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import type { PinBlock } from "./types";

export function PinMenu({ blockId }: { blockId: string }) {
  const editor = useBlockNoteEditor<any>();
  const Components = useComponentsContext();
  const block = editor.getBlock(blockId) as PinBlock | undefined;

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
          type: "pin",
          props: { required: !block.props.required },
        });
      }}
    >
      {block.props.required ? "Unrequire" : "Require"}
    </Components.Generic.Menu.Item>
  );
}
