"use client";

import { MapDrawer, MapDrawerToolbar } from "~/components/map-drawer";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";
import { useParamsContext } from "~/lib/params/client";
import { Marker } from "react-map-gl/mapbox";
import { Button } from "@mapform/ui/components/button";
import { PlusIcon, XIcon } from "lucide-react";
import { LoadingSkeleton } from "~/components/loading-skeleton";
import { Feature } from "~/components/feature";
import { PropertyColumnEditor } from "~/components/properties/property-column-editor";
import { PropertyValueEditor } from "~/components/properties/property-value-editor";
import { useWikidataImages } from "~/lib/wikidata-image";

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
  const { params, setQueryStates } = useParamsContext();
  const wikiData = useWikidataImages(
    geoapifyPlaceDetails?.features[0]?.properties.datasource?.raw?.wikidata,
  );

  if (!geoapifyPlaceDetails) return null;

  const longitude = geoapifyPlaceDetails.features[0]?.properties.lon;
  const latitude = geoapifyPlaceDetails.features[0]?.properties.lat;

  const place = geoapifyPlaceDetails.features[0]?.properties;

  if (!longitude || !latitude || !place) return null;

  return (
    <>
      <MapDrawerToolbar>
        <Button
          className="ml-auto"
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void setQueryStates({ geoapifyPlaceId: null });
          }}
        >
          <PlusIcon className="size-4" />
        </Button>
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
        wikiData={wikiData}
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
