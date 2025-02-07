"use client";

import { useContext, createContext } from "react";

/**
 * Context needed to support custom blocks
 */
export interface CustomBlockContextProps {
  isEditing: boolean;

  imageBlock?: {
    onImageUpload?: (file: File) => Promise<string | null>;
  };

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

type CustomBlockProviderProps = CustomBlockContextProps & {
  children: React.ReactNode;
};

export const CustomBlockProvider = ({
  children,
  ...props
}: CustomBlockProviderProps) => {
  return (
    <CustomBlockContext.Provider value={props}>
      {children}
    </CustomBlockContext.Provider>
  );
};
