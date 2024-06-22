import { useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import type { TextInputBlock } from "./types";

export function TextInputMenu({ blockId }: { blockId: string }) {
  const editor = useBlockNoteEditor();
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

  // TODO: Implement switches when fully customized menu is supported.
  // return (
  //   <Label className="flex justify-between items-center">
  //     Required
  //     <Switch
  //       checked={block.props.required}
  //       onCheckedChange={(e) => {
  // editor.updateBlock(block, {
  //   type: "pin",
  //   props: { required: e },
  // });
  //       }}
  //     />
  //   </Label>
  // );
}
