import { StepWithLocation } from "@mapform/db/extentsions/steps";
import { useDebounce } from "@mapform/lib/use-debounce";
import type { ViewState, MapRef } from "@mapform/mapform";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useCreateQueryString } from "~/lib/create-query-string";
import { type FormWithSteps } from "~/server/actions/forms/get-form-with-steps";
import { updateStep } from "~/server/actions/steps/update";

export interface ContainerContextProps {
  map: React.RefObject<MapRef>;
  dragSteps: string[];
  formWithSteps: FormWithSteps;
  currentStep: StepWithLocation | undefined;
  viewState: ViewState;
  setViewState: Dispatch<SetStateAction<ViewState>>;
  setDragSteps: Dispatch<SetStateAction<string[]>>;
  setCurrentStep: (stepId: string) => void;
  debouncedUpdateStep: (args: any) => Promise<any>;
}

export const ContainerContext = createContext<ContainerContextProps>(
  {} as ContainerContextProps
);
export const useContainerContext = () => useContext(ContainerContext);

// TODO. Temporary. Should get initial view state from previous step, or from user location
const initialViewState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 14,
  bearing: 0,
  pitch: 0,
  padding: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
};

export function ContainerProvider({
  formWithSteps,
  children,
}: {
  formWithSteps: FormWithSteps;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const s = searchParams.get("s");
  const map = useRef<MapRef>(null);

  const { mutateAsync: updateStepMutation } = useMutation({
    mutationFn: updateStep,
    onMutate: async ({ stepId, data: d }) => {
      const queryKey = ["forms", d.formId];
      await queryClient.cancelQueries({ queryKey });

      const prevForm: FormWithSteps = queryClient.getQueryData(queryKey)!;
      const newForm = {
        ...prevForm,
        steps: prevForm.steps.map((step) =>
          step.id === stepId ? { ...step, ...d } : step
        ),
      };

      queryClient.setQueryData(queryKey, () => newForm);

      return { prevForm, newForm };
    },
  });
  const debouncedUpdateStep = useDebounce(updateStepMutation, 500);

  useEffect(() => {
    if (formWithSteps.steps[0] && !s) {
      router.push(
        `${pathname}?${createQueryString("s", formWithSteps.steps[0].id)}`
      );
    }
  }, [s, formWithSteps.steps, pathname, router, createQueryString]);

  const setCurrentStep = (stepId: string) => {
    router.replace(`${pathname}?${createQueryString("s", stepId)}`);
    const step = formWithSteps.steps.find((s) => s.id === stepId);

    if (!step) return;

    map.current?.flyTo({
      center: [step.longitude, step.latitude],
      zoom: step.zoom,
      pitch: step.pitch,
      bearing: step.bearing,
      duration: 1000,
    });
  };
  // We hold the steps in its own React state due to this issue: https://github.com/clauderic/dnd-kit/issues/921
  const [dragSteps, setDragSteps] = useState<string[]>(
    formWithSteps.steps.map((step) => step.id)
  );

  const currentStep = formWithSteps.steps.find((step) => step.id === s);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: currentStep?.latitude ?? initialViewState.latitude,
    longitude: currentStep?.longitude ?? initialViewState.longitude,
    zoom: currentStep?.zoom ?? initialViewState.zoom,
    bearing: currentStep?.bearing ?? initialViewState.bearing,
    pitch: currentStep?.pitch ?? initialViewState.pitch,
    padding: initialViewState.padding,
  });

  return (
    <ContainerContext.Provider
      value={{
        map,
        currentStep,
        setCurrentStep,
        dragSteps,
        setDragSteps,
        viewState,
        setViewState,
        formWithSteps,
        debouncedUpdateStep,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}
