import {
  LocationSearch,
  LocationSearchButton,
} from "~/components/location-search";
import {
  MapformDrawer,
  useMapform,
  useMapformContent,
} from "~/components/new-mapform";
import { useProject } from "../project-context";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";

interface LocationSearchDrawerProps {
  currentPage: NonNullable<GetPageWithLayers["data"]>;
}

export function LocationSearchDrawer({
  currentPage,
}: LocationSearchDrawerProps) {
  const { map } = useMapform();
  const { drawerValues, onDrawerValuesChange } = useMapformContent();
  const { updatePageServer, updatePageOptimistic } = useProject();

  return (
    <MapformDrawer positionDesktop="absolute" value="location-search">
      <LocationSearch>
        <LocationSearchButton
          disabled={!updatePageServer.isPending}
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

              onDrawerValuesChange(
                drawerValues.filter((value) => value !== "location-search"),
              );
            }
          }}
        >
          Save Map Position
        </LocationSearchButton>
      </LocationSearch>
    </MapformDrawer>
  );
}
