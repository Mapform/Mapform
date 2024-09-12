import {
  SideMenu,
  DragHandleMenu,
  useComponentsContext,
  type SideMenuProps,
  type DragHandleMenuProps,
  RemoveBlockItem,
} from "@blocknote/react";
import { TextInputMenu, PinMenu } from "@mapform/blocknote";

export function CustomSideMenu(props: SideMenuProps) {
  return <SideMenu {...props} dragHandleMenu={CustomDragMenu} />;
}

function CustomDragMenu(props: DragHandleMenuProps) {
  const Components = useComponentsContext();

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
}
