import {
  LocationSearch,
  LocationSearchButton,
  useLocationSearch,
} from "~/components/location-search";
import { MapformDrawer, useMapform } from "~/components/new-mapform";
import { useProject } from "../project-context";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";

interface LocationSearchDrawerProps {
  currentPage: NonNullable<GetPageWithLayers["data"]>;
}

export function LocationSearchDrawer({
  currentPage,
}: LocationSearchDrawerProps) {
  return (
    <MapformDrawer positionDesktop="absolute" value="location-search">
      <LocationSearch>
        <LocationSearchDrawerInner currentPage={currentPage} />
      </LocationSearch>
    </MapformDrawer>
  );
}

export function LocationSearchDrawerInner({
  currentPage,
}: LocationSearchDrawerProps) {
  const { map } = useMapform();
  const { selectedFeature } = useLocationSearch();
  const { updatePageServer, updatePageOptimistic } = useProject();

  // const roundLocation = (num: number) => Math.round(num * 1000000) / 1000000;

  // const hasMoved =
  //   roundLocation(movedCoords.lat) !== roundLocation(currentPage.center.y) ||
  //   roundLocation(movedCoords.lng) !== roundLocation(currentPage.center.x) ||
  //   movedCoords.zoom !== currentPage.zoom ||
  //   movedCoords.pitch !== currentPage.pitch ||
  //   movedCoords.bearing !== currentPage.bearing;

  return (
    <LocationSearchButton
      disabled={updatePageServer.isPending || !selectedFeature?.properties}
      onClick={() => {
        const center = map?.getCenter();
        const zoom = map?.getZoom();
        const pitch = map?.getPitch();
        const bearing = map?.getBearing();

        if (
          center !== undefined &&
          zoom !== undefined &&
          pitch !== undefined &&
          bearing !== undefined
        ) {
          const payload = {
            id: currentPage.id,
            center: {
              x: center.lng,
              y: center.lat,
            },
            zoom,
            pitch,
            bearing,
          };

          updatePageServer.execute(payload);

          updatePageOptimistic({
            ...currentPage,
            ...payload,
          });
        }
      }}
    >
      Save Map Position
    </LocationSearchButton>
  );
}
