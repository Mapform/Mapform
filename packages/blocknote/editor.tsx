import { BlockNoteView } from "@blocknote/mantine";
// Note: CSS imports have been moved to blocknote.css
// Import this file in your app's main CSS or layout file:
// import "@mapform/blocknote/blocknote.css";

import {
  DefaultReactSuggestionItem,
  DragHandleButton,
  getDefaultReactSlashMenuItems,
  SideMenu,
  SideMenuController,
  SuggestionMenuController,
  SuggestionMenuProps,
} from "@blocknote/react";
import { schema, type CustomBlock } from "./schema";
import { filterSuggestionItems } from "@blocknote/core";
import { cn } from "../lib/classnames";

interface BlocknoteProps {
  editor: typeof schema.BlockNoteEditor;
  onChange?: (content: {
    blocks: CustomBlock[] | null;
    markdown: string | null;
  }) => void;
}

export function Blocknote({ onChange, editor }: BlocknoteProps) {
  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      editable={!!onChange}
      sideMenu={false}
      slashMenu={false}
      className="h-full"
      theme="light"
      onChange={async () => {
        onChange?.({
          blocks: editor.document,
          markdown: await editor.blocksToMarkdownLossy(editor.document),
        });
      }}
    >
      <SuggestionMenuController
        getItems={async (query) => {
          return filterSuggestionItems(
            [
              ...getDefaultReactSlashMenuItems(editor).filter((i) =>
                [
                  "Heading 1",
                  "Heading 2",
                  "Heading 3",
                  "Quote",
                  "Toggle List",
                  "Number List",
                  "Bulleted List",
                  "Check List",
                  "Paragraph",
                ].includes(i.title),
              ),
            ],
            query,
          );
        }}
        suggestionMenuComponent={SuggestionMenu}
        triggerCharacter="/"
      />
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

function SuggestionMenu({
  items,
  selectedIndex,
  onItemClick,
}: SuggestionMenuProps<DefaultReactSuggestionItem>) {
  const groupedItems = Object.groupBy(items, (item) => item.group!);

  const renderItem = (item: (typeof items)[0]) => (
    <div
      className={cn(
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        {
          "bg-accent text-accent-foreground":
            items.indexOf(item) === selectedIndex,
        },
      )}
      key={item.title}
      onClick={() => {
        onItemClick?.(item);
      }}
    >
      <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <span className="size-4">{item.icon}</span>
      </div>
      <div className="flex flex-col">
        <div>{item.title}</div>
        <div className="text-muted-foreground text-xs">{item.subtext}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-popover text-popover-foreground z-50 w-[300px] space-y-1 overflow-hidden overflow-y-auto rounded-md border shadow-md">
      {Object.entries(groupedItems).map(([group, items]) => (
        <div key={group} className="border-b last:border-0">
          <div className="space-y-1 p-1">
            <div className="text-sidebar-foreground/70 ring-sidebar-ring ml-2 flex h-6 shrink-0 items-center rounded-md text-xs font-medium outline-none transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2">
              {group}
            </div>
            {items?.map(renderItem)}
          </div>
        </div>
      ))}
    </div>
  );
}
