"use client";

import type { ViewState } from "react-map-gl";
import {
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

/**
 * Context needed to support custom blocks
 */
export interface CustomBlockContextProps {
  editable: boolean;
  viewState: ViewState;
  setViewState: Dispatch<SetStateAction<ViewState>>;
  onImageUpload?: (file: File) => Promise<string | null>;
  isSelectingPinLocationFor: string | null;
  setIsSelectingPinLocationFor: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

export const CustomBlockContext = createContext<CustomBlockContextProps>(
  {} as CustomBlockContextProps
);
export const useCustomBlockContext = () => useContext(CustomBlockContext);
