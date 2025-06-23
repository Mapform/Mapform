import { SmilePlusIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { DrawerPrimitive } from "@mapform/ui/components/drawer";
import { projectSearchParams, projectSearchParamsUrlKeys } from "../../params";
import { useProject } from "../../context";
import { useQueryStates } from "nuqs";
import { DRAWER_WIDTH } from "../constants";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";

interface FeatureDrawerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function FeatureDrawer({ containerRef }: FeatureDrawerProps) {
  const { feature } = useProject();
  const [{ rowId }, setProjectSearchParams] = useQueryStates(
    projectSearchParams,
    {
      urlKeys: projectSearchParamsUrlKeys,
      shallow: false,
    },
  );

  if (!feature) {
    return (
      <div className="flex flex-1 flex-col justify-center rounded-lg bg-gray-50 p-8">
        <div className="text-center">
          <h3 className="text-foreground mt-2 text-sm font-medium">
            No feature found
          </h3>
        </div>
      </div>
    );
  }

  return (
    <DrawerPrimitive.NestedRoot
      container={containerRef.current}
      open={!!rowId}
      direction="left"
      modal={false}
      dismissible={false}
      onOpenChange={(open) => {
        if (!open) {
          void setProjectSearchParams({ rowId: null });
        }
      }}
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Content
          // point-events-auto needed to work around Vaul bug: https://github.com/emilkowalski/vaul/pull/576
          className="!pointer-events-auto absolute bottom-2 left-2 top-2 z-20 flex !select-text outline-none"
          style={
            {
              width: DRAWER_WIDTH - 16,
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full grow flex-col rounded-lg border bg-white p-6">
            <header>
              <div className="-m-2 mb-0">
                <Tooltip>
                  <EmojiPopover onIconChange={() => {}}>
                    <TooltipTrigger asChild>
                      <Button size="icon-sm" type="button" variant="ghost">
                        <SmilePlusIcon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                  </EmojiPopover>
                  <TooltipContent>Add emoji</TooltipContent>
                </Tooltip>
              </div>
              <AutoSizeTextArea
                className="text-4xl font-bold"
                placeholder="Untitled"
                value={feature.name ?? ""}
                onChange={(value) => {
                  console.log(value);
                }}
              />
            </header>
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.NestedRoot>
  );
}
