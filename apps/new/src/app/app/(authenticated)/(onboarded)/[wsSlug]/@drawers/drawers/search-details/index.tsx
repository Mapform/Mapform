"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";
import { useParamsContext } from "~/lib/params/client";
import { Marker } from "react-map-gl/mapbox";
import { Button } from "@mapform/ui/components/button";
import {
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { LoadingSkeleton } from "~/components/loading-skeleton";
import { Feature } from "~/components/feature";
import { PropertyColumnEditor } from "~/components/properties/property-column-editor";
import { PropertyValueEditor } from "~/components/properties/property-value-editor";
import { useWikidataImages } from "~/lib/wikidata-image";
import {
  DropdownMenu,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@mapform/ui/components/dropdown-menu";
import { openInGoogleMaps } from "~/lib/external-links/google";
import { openInAppleMaps } from "~/lib/external-links/apple";
import { useAction } from "next-safe-action/hooks";
import { createRowAction } from "~/data/rows/create-row";
import { useParams } from "next/navigation";

interface SearchDetailsProps {
  geoapifyPlaceDetails: GetPlaceDetails["data"];
}

export function SearchDetails({ geoapifyPlaceDetails }: SearchDetailsProps) {
  const { params, drawerDepth, isPending } = useParamsContext();

  return (
    <MapDrawer
      open={!!params.geoapifyPlaceId}
      depth={drawerDepth.get("geoapifyPlaceId") ?? 0}
    >
      {isPending ? (
        <LoadingSkeleton />
      ) : (
        <SearchDetailsInner geoapifyPlaceDetails={geoapifyPlaceDetails} />
      )}
    </MapDrawer>
  );
}

function SearchDetailsInner({ geoapifyPlaceDetails }: SearchDetailsProps) {
  const { setQueryStates } = useParamsContext();
  const { pId } = useParams<{ pId: string }>();
  const { execute, isPending } = useAction(createRowAction, {
    onSuccess: ({ data }) => {
      void setQueryStates({ geoapifyPlaceId: null, rowId: data?.id });
    },
  });

  const wikiData = useWikidataImages(
    geoapifyPlaceDetails?.features[0]?.properties.datasource?.raw?.wikidata,
  );

  if (!geoapifyPlaceDetails) return null;

  const longitude = geoapifyPlaceDetails.features[0]?.properties.lon;
  const latitude = geoapifyPlaceDetails.features[0]?.properties.lat;

  const place = geoapifyPlaceDetails.features[0]?.properties;

  if (!longitude || !latitude || !place || !pId) return null;

  return (
    <>
      <MapDrawerToolbar>
        <Button
          className="ml-auto"
          size="icon-sm"
          type="button"
          variant="ghost"
          disabled={isPending}
          onClick={() => {
            execute({
              projectId: pId,
              name: place.name_international?.en,
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
            });
          }}
        >
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <PlusIcon className="size-4" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" type="button" variant="ghost">
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
                    openInGoogleMaps(latitude, longitude);
                  }}
                >
                  Google Maps
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    openInAppleMaps(
                      latitude,
                      longitude,
                      place.name_international?.en ?? place.name ?? "Location",
                    );
                  }}
                >
                  Apple Maps
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ geoapifyPlaceId: null });
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </MapDrawerToolbar>
      <Feature
        imageData={wikiData}
        title={place.name_international?.en ?? place.name ?? ""}
        // description={geoapifyPlaceDetails.features[0]?.properties.description}
        // icon={geoapifyPlaceDetails.features[0]?.properties.icon}
        properties={[
          {
            columnName: "Address",
            columnType: "string",
            value: place.address_line2,
          },
          ...(place.phone
            ? ([
                {
                  columnName: "Phone",
                  columnType: "string",
                  value: place.phone,
                },
              ] as const)
            : []),
          ...(place.website
            ? ([
                {
                  columnName: "Website",
                  columnType: "string",
                  value: place.website,
                },
              ] as const)
            : []),
          ...(place.population
            ? ([
                {
                  columnName: "Population",
                  columnType: "number",
                  value: place.population,
                },
              ] as const)
            : []),
        ]}
      />

      <Marker longitude={longitude} latitude={latitude} />
    </>
  );
}
