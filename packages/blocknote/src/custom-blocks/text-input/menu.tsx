import { Label } from "@mapform/ui/components/label";
import { Switch } from "@mapform/ui/components/switch";
import { useBlockNoteEditor } from "@blocknote/react";
import type { TextInputBlock } from "./types";

export function TextInputMenu({ blockId }: { blockId: string }) {
  const editor = useBlockNoteEditor();
  const block = editor.getBlock(blockId) as TextInputBlock | undefined;

  if (!block) {
    return null;
  }

  return (
    <Label className="flex justify-between items-center">
      Required
      <Switch
        checked={block.props.required}
        onCheckedChange={(e) => {
          editor.updateBlock(block, {
            type: "textInput",
            props: { required: e },
          });
        }}
      />
    </Label>
  );
}
