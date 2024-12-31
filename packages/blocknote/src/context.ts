"use client";

import { useContext, createContext } from "react";

/**
 * Context needed to support custom blocks
 */
export interface CustomBlockContextProps {
  editable: boolean;
  onImageUpload?: (file: File) => Promise<string | null>;
  isSelectingPinLocationFor?: string | null;
  setIsSelectingPinLocationFor?: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

export const CustomBlockContext = createContext<CustomBlockContextProps>(
  {} as CustomBlockContextProps,
);
export const useCustomBlockContext = () => useContext(CustomBlockContext);
