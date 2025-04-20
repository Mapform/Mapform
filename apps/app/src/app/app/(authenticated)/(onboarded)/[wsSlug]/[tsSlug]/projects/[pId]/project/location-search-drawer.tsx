import {
  LocationSearch,
  LocationSearchButton,
  useLocationSearch,
} from "~/components/location-search";
import { MapformDrawer, useMapform } from "~/components/mapform";
import { useProject } from "../project-context";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";
import { BookmarkIcon, ScanIcon } from "lucide-react";
import { LayerSavePopover } from "./layer-save-popover";

interface LocationSearchDrawerProps {
  currentPage: NonNullable<GetPageWithLayers["data"]>;
  onClose: () => void;
}

export function LocationSearchDrawer({
  currentPage,
  onClose,
}: LocationSearchDrawerProps) {
  return (
    <MapformDrawer
      onClose={() => {
        onClose();
      }}
      value="location-search"
      hideDragBar
    >
      <LocationSearch>
        <LocationSearchDrawerInner
          currentPage={currentPage}
          onClose={onClose}
        />
      </LocationSearch>
    </MapformDrawer>
  );
}

export function LocationSearchDrawerInner({
  currentPage,
  onClose,
}: LocationSearchDrawerProps) {
  const { map } = useMapform();
  const { selectedFeature } = useLocationSearch();
  const { updatePageServerAction } = useProject();

  const location = {
    x: selectedFeature?.properties?.lon,
    y: selectedFeature?.properties?.lat,
  };

  const title =
    selectedFeature?.properties?.name ??
    selectedFeature?.properties?.address_line1;

  const handleSaveMapPosition = () => {
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

      updatePageServerAction.execute({
        ...currentPage,
        ...payload,
      });

      onClose();
    }
  };

  return (
    <div className="flex">
      <LocationSearchButton
        className="mr-1"
        disabled={
          updatePageServerAction.isPending || !selectedFeature?.properties
        }
        onClick={() => void handleSaveMapPosition()}
        size="sm"
        variant="outline"
      >
        <ScanIcon className="mr-1 size-4" />
        Set View
      </LocationSearchButton>
      <LayerSavePopover location={location} title={title}>
        <LocationSearchButton
          className="w-full"
          disabled={!selectedFeature?.properties}
          role="combobox"
          size="sm"
          variant="outline"
        >
          <BookmarkIcon className="mr-1 size-4" />
          Save to
        </LocationSearchButton>
      </LayerSavePopover>
    </div>
  );
}
