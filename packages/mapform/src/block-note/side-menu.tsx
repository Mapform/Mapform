import {
  SideMenu,
  DragHandleMenu,
  useComponentsContext,
  type SideMenuProps,
  type DragHandleMenuProps,
} from "@blocknote/react";
import { TextInputMenu, type TextInputBlock } from "@mapform/blocknote";

export function CustomSideMenu(props: SideMenuProps) {
  return <SideMenu {...props} dragHandleMenu={CustomDragMenu} />;
}

function CustomDragMenu(props: DragHandleMenuProps) {
  const Components = useComponentsContext();

  if (!Components) {
    return null;
  }

  console.log(11111, props.block.props);

  return (
    <DragHandleMenu {...props}>
      <div className="min-w-[200px] p-2">
        {props.block.type === "textInput" ? (
          <TextInputMenu block={props.block as unknown as TextInputBlock} />
        ) : null}
      </div>
    </DragHandleMenu>
  );
}
