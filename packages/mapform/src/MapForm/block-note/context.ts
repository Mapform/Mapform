import { createContext, useContext } from "react";

export interface StepContextProps {
  editable: boolean;
}

export const StepContext = createContext<StepContextProps>(
  {} as StepContextProps
);
export const useStepContext = () => useContext(StepContext);
