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
import { type StateServiceProps } from "~/lib/use-state-service";
import type { GetRow } from "@mapform/backend/data/rows/get-row";
import type { UpdateRowSchema } from "@mapform/backend/data/rows/update-row/schema";
import { Marker, useMap } from "react-map-gl/mapbox";
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
import { useEffect } from "react";

interface CoordinatesProps {
  coordinates: [number, number] | null;
}

export function Coordinates({ coordinates }: CoordinatesProps) {
  const map = useMap();
  const { isPending, drawerDepth, setQueryStates } = useParamsContext();

  const latitude = coordinates?.[0];
  const longitude = coordinates?.[1];

  useEffect(() => {
    if (!latitude || !longitude) return;

    try {
      map.current?.easeTo({
        center: [longitude, latitude],
      });
    } catch (error) {
      console.error("Error while easing to coordinates:", error);
    }
  }, [latitude, longitude, map]);

  return (
    <>
      <MapDrawer open={!!coordinates} depth={drawerDepth.get("latitude") ?? 0}>
        {isPending ? (
          <>
            <MapDrawerToolbar>
              <Button
                className="ml-auto"
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={() => {
                  void setQueryStates({ latitude: null, longitude: null });
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </MapDrawerToolbar>
            <BasicSkeleton className="p-6" />
          </>
        ) : (
          <>
            <MapDrawerToolbar>
              <Button
                className="ml-auto"
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={() => {
                  void setQueryStates({ latitude: null, longitude: null });
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </MapDrawerToolbar>
          </>
        )}
      </MapDrawer>

      {coordinates && (
        <Marker
          longitude={coordinates[1]}
          latitude={coordinates[0]}
          scale={1.5}
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
      />
    </div>
  );
};
