import { type MapRef } from "@mapform/mapform";
import { useRouter, usePathname } from "next/navigation";
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useCreateQueryString } from "~/lib/create-query-string";
import type { FormWithSteps } from "~/server/actions/forms/get-form-with-steps";

export interface ContainerContextProps {
  map: React.RefObject<MapRef>;
  dragSteps: string[];
  setDragSteps: Dispatch<SetStateAction<string[]>>;
  setCurrentStep: (step: string) => void;
}

export const ContainerContext = createContext<ContainerContextProps>(
  {} as ContainerContextProps
);
export const useContainerContext = () => useContext(ContainerContext);

export function ContainerProvider({
  map,
  formWithSteps,
  children,
}: {
  map: React.RefObject<MapRef>;
  formWithSteps: FormWithSteps;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCreateQueryString();
  const setCurrentStep = (stepId: string) => {
    const step = formWithSteps.steps.find((s) => s.id === stepId);

    if (!step) return;

    map.current?.flyTo({
      center: [step.longitude, step.latitude],
      zoom: step.zoom,
      pitch: step.pitch,
      bearing: step.bearing,
      duration: 1000,
    });
    router.replace(`${pathname}?${createQueryString("s", step.id)}`);
  };
  // We hold the steps in its own React state due to this issue: https://github.com/clauderic/dnd-kit/issues/921
  const [dragSteps, setDragSteps] = useState<string[]>(
    formWithSteps.steps.map((step) => step.id)
  );

  return (
    <ContainerContext.Provider
      value={{
        map,
        setCurrentStep,
        dragSteps,
        setDragSteps,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}
