import { SmilePlusIcon, XIcon } from "lucide-react";
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
import { Skeleton } from "@mapform/ui/components/skeleton";
import { Blocknote } from "@mapform/blocknote/editor";
import { PropertyValueEditor } from "../../properties/property-value-editor";
import { PropertyColumnEditor } from "../../properties/property-column-editor";

interface FeatureDrawerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function FeatureDrawer({ containerRef }: FeatureDrawerProps) {
  const { isFeaturePending, setSelectedFeature, featureService, project } =
    useProject();
  const [{ rowId }] = useQueryStates(projectSearchParams, {
    urlKeys: projectSearchParamsUrlKeys,
    shallow: false,
  });

  return (
    <DrawerPrimitive.NestedRoot
      container={containerRef.current}
      open={!!rowId}
      direction="left"
      modal={false}
      dismissible={false}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedFeature(null);
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
            <Button
              className="absolute right-4 top-4"
              size="icon-sm"
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedFeature(null);
              }}
            >
              <XIcon className="size-4" />
            </Button>
            {isFeaturePending ? (
              <>
                <Skeleton className="mb-2 size-8 rounded-full" />
                <Skeleton className="h-6" />
              </>
            ) : featureService.optimisticState ? (
              <div>
                <header>
                  <div className="-m-2 mb-0">
                    <Tooltip>
                      <EmojiPopover
                        onIconChange={(emoji) => {
                          featureService.execute({
                            id: featureService.optimisticState!.id,
                            icon: emoji,
                          });
                        }}
                      >
                        <TooltipTrigger asChild>
                          {featureService.optimisticState.icon ? (
                            <button
                              className="hover:bg-muted rounded-lg text-6xl"
                              type="button"
                            >
                              {featureService.optimisticState.icon}
                            </button>
                          ) : (
                            <Button
                              size="icon-sm"
                              type="button"
                              variant="ghost"
                            >
                              <SmilePlusIcon className="size-4" />
                            </Button>
                          )}
                        </TooltipTrigger>
                      </EmojiPopover>
                      <TooltipContent>Add emoji</TooltipContent>
                    </Tooltip>
                  </div>
                  <AutoSizeTextArea
                    className="text-4xl font-bold"
                    placeholder="Untitled"
                    value={featureService.optimisticState.name ?? ""}
                    onChange={(value) => {
                      featureService.execute({
                        id: featureService.optimisticState!.id,
                        name: value,
                      });
                    }}
                  />
                  <div className="mb-4 mt-2 flex flex-col gap-2">
                    {project.columns.map((column) => (
                      <div className="grid grid-cols-2 gap-4" key={column.id}>
                        <PropertyColumnEditor
                          columnId={column.id}
                          columnName={column.name}
                          columnType={column.type}
                        />
                        <PropertyValueEditor
                          columnId={column.id}
                          rowId={featureService.optimisticState!.id}
                          type={column.type}
                          value={
                            featureService.optimisticState?.cells.find(
                              (cell) => cell.columnId === column.id,
                            )?.stringCell?.value ??
                            featureService.optimisticState?.cells.find(
                              (cell) => cell.columnId === column.id,
                            )?.numberCell?.value ??
                            featureService.optimisticState?.cells.find(
                              (cell) => cell.columnId === column.id,
                            )?.booleanCell?.value ??
                            featureService.optimisticState?.cells.find(
                              (cell) => cell.columnId === column.id,
                            )?.dateCell?.value ??
                            null
                          }
                          key={column.id}
                        />
                      </div>
                    ))}
                  </div>
                </header>
                <Blocknote
                  content={featureService.optimisticState.description}
                  onChange={(content) => {
                    featureService.execute({
                      id: featureService.optimisticState!.id,
                      description: content,
                    });
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-center rounded-lg bg-gray-50 p-8">
                <div className="text-center">
                  <h3 className="text-foreground mt-2 text-sm font-medium">
                    No feature found
                  </h3>
                </div>
              </div>
            )}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.NestedRoot>
  );
}
