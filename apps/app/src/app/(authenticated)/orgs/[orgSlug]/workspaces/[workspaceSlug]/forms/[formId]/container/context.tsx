import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type StepWithLocation } from "@mapform/db/extentsions/steps";
import { useMap, type MBMap } from "@mapform/mapform";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import { type FormWithSteps } from "~/data/forms/get-form-with-steps";
import type { GetStepData } from "~/data/steps/get-step-data";
import { updateStep } from "~/data/steps/update";

export interface ContainerContextProps {
  map: MBMap | undefined;
  dragSteps: string[];
  formWithSteps: NonNullable<FormWithSteps>;
  currentStep: StepWithLocation | undefined;
  currentStepIndex: number;
  currentEditableStep: StepWithLocation | undefined;
  setDragSteps: Dispatch<SetStateAction<string[]>>;
  debouncedUpdateStep: typeof updateStep;
  setQueryParamFor: (
    param: "e" | "s",
    step?: NonNullable<FormWithSteps>["steps"][number]
  ) => void;
  points: GetStepData;
}

export const ContainerContext = createContext<ContainerContextProps>(
  {} as ContainerContextProps
);
export const useContainerContext = () => useContext(ContainerContext);

export function ContainerProvider({
  formWithSteps,
  points,
  children,
}: {
  formWithSteps: NonNullable<FormWithSteps>;
  points: GetStepData;
  children: React.ReactNode;
}) {
  const { map } = useMap();
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

  const setQueryParamFor = (
    param: "e" | "s",
    step?: NonNullable<FormWithSteps>["steps"][number]
  ) => {
    // Get current search params
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Clear the param if value is not provided
    if (!step) {
      current.delete(param);
    } else {
      if (param === "e") {
        current.set("s", step.id);
        current.set("e", step.id);
      }

      if (param === "s") {
        current.set("s", step.id);
        current.delete("e");

        map?.flyTo({
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

  return (
    <ContainerContext.Provider
      value={{
        map,
        currentStep,
        currentStepIndex,
        dragSteps,
        setDragSteps,
        formWithSteps,
        debouncedUpdateStep,
        currentEditableStep,
        setQueryParamFor,
        points,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}
