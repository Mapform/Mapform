import { useState } from "react";
import { useMapform } from "./context";
import { SearchPicker } from "./search-picker";

interface LocationPickerProps {
  isSelectingPinBlockLocation: boolean;
  setIsSelectingPinBlockLocation: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LocationPicker({
  isSelectingPinBlockLocation,
  setIsSelectingPinBlockLocation,
}: LocationPickerProps) {
  const { map } = useMapform();
  const [pinPickerOpen, setPinPickerOpen] = useState(false);

  if (!map) {
    return null;
  }

  return (
    <SearchPicker
      map={map}
      open={isSelectingPinBlockLocation && !pinPickerOpen}
      onClose={() => setIsSelectingPinBlockLocation(false)}
      onOpenPinPicker={() => setPinPickerOpen(true)}
    />
  );
}
