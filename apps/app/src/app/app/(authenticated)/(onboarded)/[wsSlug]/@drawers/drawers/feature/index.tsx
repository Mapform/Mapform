"use client";

import { Button } from "@mapform/ui/components/button";
import {
  EllipsisVerticalIcon,
  Trash2Icon,
  XIcon,
  ExternalLinkIcon,
} from "lucide-react";
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
import { BasicSkeleton } from "~/components/skeletons/basic";
import { Feature as FeatureComponent } from "~/components/feature";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { openInAppleMaps } from "~/lib/external-links/apple";
import { openInGoogleMaps } from "~/lib/external-links/google";
import { useAction } from "next-safe-action/hooks";
import { deleteRowsAction } from "~/data/rows/delete-rows";
import { MapPositioner } from "~/lib/map/map-positioner";
import type { GetProject } from "@mapform/backend/data/projects/get-project";

interface FeatureDrawerProps {
  feature: GetRow["data"];
  project: GetProject["data"];
}

export function Feature({ feature, project }: FeatureDrawerProps) {
  const { params, isPending, drawerDepth, setQueryStates } = useParamsContext();
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

  const longitude = featureService.optimisticState?.center.coordinates[0];
  const latitude = featureService.optimisticState?.center.coordinates[1];

  return (
    <>
      <MapDrawer open={!!params.rowId} depth={drawerDepth.get("rowId") ?? 0}>
        <MapPositioner
          viewState={{
            ...(longitude && latitude && { center: [longitude, latitude] }),
          }}
        >
          {isPending && params.rowId !== featureService.optimisticState?.id ? (
            <>
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
              <BasicSkeleton className="p-6" />
            </>
          ) : featureService.optimisticState ? (
            <FeatureContent
              featureService={featureService}
              project={project}
              key={featureService.optimisticState.id}
            />
          ) : (
            <>
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
              <div className="flex flex-1 flex-col justify-center rounded-lg bg-gray-50 p-8">
                <div className="text-center">
                  <h3 className="text-foreground mt-2 text-sm font-medium">
                    No feature found
                  </h3>
                </div>
              </div>
            </>
          )}
        </MapPositioner>
      </MapDrawer>

      {longitude && latitude && (
        <Marker longitude={longitude} latitude={latitude} scale={1.5} />
      )}
    </>
  );
}

const FeatureContent = ({
  featureService,
  project,
}: {
  featureService: StateServiceProps<GetRow["data"], UpdateRowSchema>;
  project: GetProject["data"];
}) => {
  const { setQueryStates } = useParamsContext();
  const { executeAsync } = useAction(deleteRowsAction, {
    onSuccess: () => {
      void setQueryStates({ rowId: null });
    },
  });

  const columns = project?.columns.map((column) => ({
    columnId: column.id,
    columnName: column.name,
    columnType: column.type,
  }));

  const properties = columns?.map((column) => ({
    columnId: column.columnId,
    columnName: column.columnName,
    columnType: column.columnType,
    rowId: featureService.optimisticState!.id,
    value:
      featureService.optimisticState?.cells.find(
        (cell) => cell.columnId === column.columnId,
      )?.stringCell?.value ??
      featureService.optimisticState?.cells.find(
        (cell) => cell.columnId === column.columnId,
      )?.numberCell?.value ??
      featureService.optimisticState?.cells.find(
        (cell) => cell.columnId === column.columnId,
      )?.booleanCell?.value ??
      featureService.optimisticState?.cells.find(
        (cell) => cell.columnId === column.columnId,
      )?.dateCell?.value ??
      null,
  }));

  console.log("featureService.optimisticState", featureService.optimisticState);

  return (
    <div>
      <MapDrawerToolbar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="ml-auto"
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ExternalLinkIcon className="size-4" /> Open In
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    const { center } = featureService.optimisticState!;
                    const [longitude, latitude] = center.coordinates;

                    openInGoogleMaps(latitude, longitude);
                  }}
                >
                  Google Maps
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const { center } = featureService.optimisticState!;
                    const [longitude, latitude] = center.coordinates;

                    openInAppleMaps(
                      latitude,
                      longitude,
                      featureService.optimisticState?.name ?? "Location",
                    );
                  }}
                >
                  Apple Maps
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={async () => {
                await executeAsync({
                  rowIds: [featureService.optimisticState!.id],
                });
              }}
            >
              <Trash2Icon className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
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
        rowId={featureService.optimisticState!.id}
        title={featureService.optimisticState!.name ?? ""}
        description={featureService.optimisticState!.description ?? undefined}
        icon={featureService.optimisticState!.icon ?? undefined}
        osmId={featureService.optimisticState!.osmId ?? undefined}
        onTitleChange={(value) => {
          featureService.execute({
            ...featureService.optimisticState,
            id: featureService.optimisticState!.id,
            name: value,
          });
        }}
        onIconChange={(value) => {
          featureService.execute({
            ...featureService.optimisticState,
            id: featureService.optimisticState!.id,
            icon: value,
          });
        }}
        onDescriptionChange={(value) => {
          featureService.execute({
            ...featureService.optimisticState,
            id: featureService.optimisticState!.id,
            description: value.blocks,
            descriptionAsMarkdown: value.markdown ?? undefined,
          });
        }}
        imageData={{
          images: featureService.optimisticState!.blobs.map((blob) => ({
            imageUrl: blob.url,
          })),
        }}
        properties={properties}
        projectId={featureService.optimisticState!.project.id}
      />
    </div>
  );
};
