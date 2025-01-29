"use client";

import { useContext, createContext } from "react";

/**
 * Context needed to support custom blocks
 */
export interface CustomBlockContextProps {
  editable: boolean;
  onImageUpload?: (file: File) => Promise<string | null>;

  pinBlock?: {
    isSelectingLocationFor: string | null;
    setIsSelectingLocationFor: React.Dispatch<
      React.SetStateAction<string | null>
    >;
  };
}

export const CustomBlockContext = createContext<CustomBlockContextProps>(
  {} as CustomBlockContextProps,
);
export const useCustomBlockContext = () => useContext(CustomBlockContext);
