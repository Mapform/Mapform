import {
  LocationSearch,
  LocationSearchButton,
  useLocationSearch,
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
  const { drawerValues, onDrawerValuesChange } = useMapformContent();

  const handleOnClick = async () => {
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

      updatePageOptimistic({
        ...currentPage,
        ...payload,
      });

      await updatePageServer.executeAsync(payload);

      onDrawerValuesChange(
        drawerValues.filter((value) => value !== "location-search"),
      );
    }
  };

  return (
    <LocationSearchButton
      disabled={updatePageServer.isPending || !selectedFeature?.properties}
      onClick={() => void handleOnClick()}
    >
      Save Map Position
    </LocationSearchButton>
  );
}
