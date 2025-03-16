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
    setIsSelectingLocationFor: React.Dispatch<string | null>;
  };
}

export const CustomBlockContext = createContext<CustomBlockContextProps>(
  {} as CustomBlockContextProps,
);
export const useCustomBlockContext = () => useContext(CustomBlockContext);

type CustomBlockProviderProps = Partial<CustomBlockContextProps> & {
  children: React.ReactNode;
};

export const CustomBlockProvider = ({
  children,
  isEditing = false,
  ...props
}: CustomBlockProviderProps) => {
  return (
    <CustomBlockContext.Provider value={{ isEditing, ...props }}>
      {children}
    </CustomBlockContext.Provider>
  );
};
