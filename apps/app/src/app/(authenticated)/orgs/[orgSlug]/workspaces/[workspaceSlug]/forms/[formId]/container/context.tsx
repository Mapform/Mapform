import { type StepWithLocation } from "@mapform/db/extentsions/steps";
import { useDebounce } from "@mapform/lib/use-debounce";
import type {
  ViewState,
  MapRef,
  ViewStateChangeEvent,
  LngLatBounds,
} from "@mapform/mapform";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { type FormWithSteps } from "~/data/forms/get-form-with-steps";
import { type Points, getLayerData } from "~/data/datatracks/get-layer-data";
import { updateStep } from "~/data/steps/update";

export interface ContainerContextProps {
  map: React.RefObject<MapRef>;
  dragSteps: string[];
  formWithSteps: NonNullable<FormWithSteps>;
  currentStep: StepWithLocation | undefined;
  currentStepIndex: number;
  currentEditableStep: StepWithLocation | undefined;
  viewState: ViewState;
  setViewState: Dispatch<SetStateAction<ViewState>>;
  setDragSteps: Dispatch<SetStateAction<string[]>>;
  debouncedUpdateStep: typeof updateStep;
  setQueryParamFor: (param: "d" | "e" | "s", value?: string) => void;
  onMoveEnd?: ((e: ViewStateChangeEvent) => void) | undefined;
  points: Points;
  bounds: LngLatBounds | undefined;
  setBounds: Dispatch<SetStateAction<LngLatBounds | undefined>>;
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
  formWithSteps: NonNullable<FormWithSteps>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  // Selected step view
  const s = searchParams.get("s");
  // Selected editable step
  const e = searchParams.get("e");

  const currentStepIndex = formWithSteps.steps.findIndex(
    (step) => step.id === s
  );

  const currentEditableStep = formWithSteps.steps.find((step) => step.id === e);

  // const activeStepLayers = formWithSteps.

  const map = useRef<MapRef>(null);
  const initialBounds = map.current?.getBounds();
  const [bounds, setBounds] = useState<LngLatBounds | undefined>(initialBounds);

  const { mutateAsync: updateStepMutation } = useMutation({
    mutationFn: updateStep,
    onMutate: async ({ stepId, data }) => {
      const queryKey = ["forms", data.formId];
      await queryClient.cancelQueries({ queryKey });

      const prevForm: FormWithSteps | undefined =
        queryClient.getQueryData(queryKey);

      // This should never happen
      if (!prevForm) return;

      const newForm = {
        ...prevForm,
        steps: prevForm.steps.map((step) =>
          step.id === stepId ? { ...step, ...data } : step
        ),
      };

      queryClient.setQueryData(queryKey, () => newForm);

      return { prevForm, newForm };
    },
  });

  // const { data } = useQuery({
  //   placeholderData: (prevData) =>
  //     dataTrackForActiveStep && prevData ? prevData : { data: { points: [] } },
  //   queryKey: ["pointData", dataTrackForActiveStep?.id, bounds],
  //   queryFn: () =>
  //     getLayerData({
  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //       dataTrackId: dataTrackForActiveStep!.id,
  //       bounds: {
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //         minLng: bounds!._sw.lng,
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //         minLat: bounds!._sw.lat,
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //         maxLng: bounds!._ne.lng,
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Handled via enabled
  //         maxLat: bounds!._ne.lat,
  //       },
  //     }),
  //   enabled: Boolean(bounds) && Boolean(dataTrackForActiveStep),
  //   staleTime: Infinity,
  // });

  // const points = data?.data?.points.filter(notEmpty) || [];
  const debouncedUpdateStep = useDebounce(updateStepMutation, 500);

  useEffect(() => {
    if (formWithSteps.steps[0] && !s) {
      router.push(
        `${pathname}?${createQueryString("s", formWithSteps.steps[0].id)}`
      );
    }
  }, [s, formWithSteps.steps, pathname, router, createQueryString]);

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

  const setQueryParamFor = (param: "d" | "e" | "s", value?: string) => {
    // Get current search params
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Clear the param if value is not provided
    if (!value) {
      current.delete(param);
    } else {
      if (param === "e") {
        current.set("s", value);
        current.set("e", value);
      }

      if (param === "s") {
        current.set("s", value);
        current.delete("e");

        const step = formWithSteps.steps.find((s2) => s2.id === value);

        if (!step) return;

        map.current?.flyTo({
          center: [step.longitude, step.latitude],
          zoom: step.zoom,
          pitch: step.pitch,
          bearing: step.bearing,
          duration: 1000,
        });
      }
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  const onMoveEnd = () => {
    const newBounds = map.current?.getBounds();
    if (!newBounds) return;

    setBounds(newBounds);
  };

  return (
    <ContainerContext.Provider
      value={{
        map,
        currentStep,
        currentStepIndex,
        dragSteps,
        setDragSteps,
        viewState,
        setViewState,
        formWithSteps,
        debouncedUpdateStep,
        currentEditableStep,
        setQueryParamFor,
        onMoveEnd,
        // points,
        bounds,
        setBounds,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
