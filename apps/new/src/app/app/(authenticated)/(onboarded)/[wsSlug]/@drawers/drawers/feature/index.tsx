"use client";

import { Blocknote, useCreateBlockNote, schema } from "@mapform/blocknote";
import { AutoSizeTextArea } from "@mapform/ui/components/autosize-text-area";
import { Button } from "@mapform/ui/components/button";
import { EmojiPopover } from "@mapform/ui/components/emoji-picker";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { SmilePlusIcon, XIcon } from "lucide-react";
import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import { useParamsContext } from "~/lib/params/client";
import {
  type StateServiceProps,
  useStateService,
} from "~/lib/use-state-service";
import { updateRowAction } from "~/data/rows/update-row";
import type { GetRow } from "@mapform/backend/data/rows/get-row";
import type { UpdateRowSchema } from "@mapform/backend/data/rows/update-row/schema";
import { Marker } from "react-map-gl/mapbox";
import { LoadingSkeleton } from "~/components/loading-skeleton";
import { Feature as FeatureComponent } from "~/components/feature";

interface FeatureDrawerProps {
  feature: GetRow["data"];
}

export function Feature({ feature }: FeatureDrawerProps) {
  const { params, isPending, drawerDepth } = useParamsContext();

  const featureService = useStateService<GetRow["data"], UpdateRowSchema>(
    updateRowAction,
    {
      currentState: feature,
      updateFn: (state, newRow) => {
        if (!state) return state;
        return {
          ...state,
          ...newRow,
        };
      },
    },
  );

  return (
    <>
      <MapDrawer open={!!params.rowId} depth={drawerDepth.get("rowId") ?? 0}>
        {isPending ? (
          <LoadingSkeleton />
        ) : featureService.optimisticState ? (
          <FeatureContent
            featureService={featureService}
            key={featureService.optimisticState.id}
          />
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

      {featureService.optimisticState?.center.coordinates[0] &&
        featureService.optimisticState.center.coordinates[1] && (
          <Marker
            longitude={featureService.optimisticState.center.coordinates[0]}
            latitude={featureService.optimisticState.center.coordinates[1]}
          />
        )}
    </>
  );
}

const FeatureContent = ({
  featureService,
}: {
  featureService: StateServiceProps<GetRow["data"], UpdateRowSchema>;
}) => {
  const { setQueryStates } = useParamsContext();
  const editor = useCreateBlockNote({
    schema,
    animations: false,
    initialContent: featureService.optimisticState!.description ?? undefined,
  });

  return (
    <div>
      <MapDrawerToolbar>
        <Button
          className="ml-auto"
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ rowId: null });
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </MapDrawerToolbar>
      <FeatureComponent
        title={featureService.optimisticState!.name ?? ""}
        description={featureService.optimisticState!.description ?? undefined}
        icon={featureService.optimisticState!.icon ?? undefined}
        onTitleChange={(value) => {
          featureService.execute({
            id: featureService.optimisticState!.id,
            name: value,
          });
        }}
        onIconChange={(value) => {
          featureService.execute({
            id: featureService.optimisticState!.id,
            icon: value,
          });
        }}
        onDescriptionChange={(value) => {
          featureService.execute({
            id: featureService.optimisticState!.id,
            description: value.blocks,
            descriptionAsMarkdown: value.markdown ?? undefined,
          });
        }}
      />
      {/* <div className="px-6 pb-6">
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
              {featureService.optimisticState!.icon ? (
                <button
                  className="hover:bg-muted rounded-lg text-6xl"
                  type="button"
                >
                  {featureService.optimisticState!.icon}
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
        <AutoSizeTextArea
          className="text-4xl font-bold"
          placeholder="Untitled"
          value={featureService.optimisticState!.name ?? ""}
          onChange={async (value) => {
            featureService.execute({
              id: featureService.optimisticState!.id,
              name: value,
              description: editor.document,
              descriptionAsMarkdown: await editor.blocksToMarkdownLossy(
                editor.document,
              ),
            });
          }}
        />

        <Blocknote
          editor={editor}
          onChange={({ blocks, markdown }) => {
            featureService.execute({
              id: featureService.optimisticState!.id,
              description: blocks,
              descriptionAsMarkdown: markdown ?? undefined,
            });
          }}
        />
      </div> */}
    </div>
  );
};
