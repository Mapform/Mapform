import { SmilePlusIcon, XIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { useProject } from "../../../context";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import { Skeleton } from "@mapform/ui/components/skeleton";
import { Blocknote } from "@mapform/blocknote/editor";
import { PropertyValueEditor } from "../../../properties/property-value-editor";
import { PropertyColumnEditor } from "../../../properties/property-column-editor";
import { useParamsContext } from "~/lib/params/client";
import { MapDrawer, MapDrawerActions } from "~/components/map-drawer";

export function FeatureDrawer() {
  const { featureService, projectService } = useProject();
  const {
    isPending,
    params: { rowId },
    setQueryStates,
  } = useParamsContext();

  return (
    <MapDrawer open={!!rowId}>
      <MapDrawerActions>
        <Button
          className="ml-auto"
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ rowId: null });
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </MapDrawerActions>
      {isPending ? (
        <>
          <Skeleton className="mb-2 size-8 rounded-full" />
          <Skeleton className="h-6" />
        </>
      ) : featureService.optimisticState ? (
        <div>
          <header>
            <div>
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
                      <Button size="icon-sm" type="button" variant="ghost">
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
              {projectService.optimisticState.columns.map((column) => (
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
            onChange={({ blocks, markdown }) => {
              featureService.execute({
                id: featureService.optimisticState!.id,
                description: blocks,
                descriptionAsMarkdown: markdown ?? undefined,
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
    </MapDrawer>
  );
}
