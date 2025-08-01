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
import { LoadingSkeleton } from "~/components/loading-skeleton";
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
            <DropdownMenuItem>
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
        imageData={{
          images: featureService.optimisticState!.blobs.map((blob) => ({
            imageUrl: blob.url,
          })),
        }}
      />
    </div>
  );
};
