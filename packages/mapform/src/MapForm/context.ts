import { createContext, useContext } from "react";

export interface MapFormContextProps {
  editable: boolean;
  onImageUpload?: (file: File) => Promise<string | null>;
}

export const MapFormContext = createContext<MapFormContextProps>(
  {} as MapFormContextProps
);
export const useMapFormContext = () => useContext(MapFormContext);
