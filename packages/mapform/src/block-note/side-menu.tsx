import {
  SideMenu,
  DragHandleMenu,
  useComponentsContext,
  type SideMenuProps,
  type DragHandleMenuProps,
  useBlockNoteEditor,
  RemoveBlockItem,
} from "@blocknote/react";
import { TextInputMenu, PinMenu } from "@mapform/blocknote";
import { Button } from "@mapform/ui/components/button";

export function CustomSideMenu(props: SideMenuProps) {
  return <SideMenu {...props} dragHandleMenu={CustomDragMenu} />;
}

function CustomDragMenu(props: DragHandleMenuProps) {
  const Components = useComponentsContext();
  const editor = useBlockNoteEditor();

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

  // return (
  //   <DragHandleMenu {...props}>
  //     <div className="min-w-[200px]">
  // {props.block.type === "textInput" ? (
  //   <TextInputMenu blockId={props.block.id} />
  // ) : props.block.type === "pin" ? (
  //   <PinMenu blockId={props.block.id} />
  // ) : null}
  //       <Button onClick={() => editor.removeBlocks([props.block])}>
  //         Delete
  //       </Button>
  //     </div>
  //   </DragHandleMenu>
  // );
}
