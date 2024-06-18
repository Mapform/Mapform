import type { ViewState } from "react-map-gl";
import {
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export interface MapFormContextProps {
  editable: boolean;
  viewState: ViewState;
  setViewState: Dispatch<SetStateAction<ViewState>>;
  onImageUpload?: (file: File) => Promise<string | null>;
  isSelectingPinLocationFor: string | null;
  setIsSelectingPinLocationFor: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

export const MapFormContext = createContext<MapFormContextProps>(
  {} as MapFormContextProps
);
export const useMapFormContext = () => useContext(MapFormContext);
