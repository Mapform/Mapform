"use client";

import { useContext, createContext } from "react";

/**
 * Context needed to support custom blocks
 */
export interface CustomBlockContextProps {
  editable: boolean;
  onImageUpload?: (file: File) => Promise<string | null>;

  // Used to establish a connection between an input block (Text, pin, etc) and
  // the dataset. If no connection is established, the form connection is null
  // and a warning must be displayed.
  submissionColBlockIds: string[];

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
