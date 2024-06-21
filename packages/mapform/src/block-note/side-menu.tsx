import {
  SideMenu,
  DragHandleMenu,
  useComponentsContext,
  type SideMenuProps,
  type DragHandleMenuProps,
} from "@blocknote/react";
import { TextInputMenu } from "@mapform/blocknote";

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
      <div className="min-w-[200px] p-2">
        {props.block.type === "textInput" ? (
          <TextInputMenu blockId={props.block.id} />
        ) : null}
      </div>
    </DragHandleMenu>
  );
}
