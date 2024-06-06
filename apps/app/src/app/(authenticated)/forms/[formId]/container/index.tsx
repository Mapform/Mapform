"use client";

import { useEffect, useState, useRef } from "react";
import type { MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@mapform/lib/use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@mapform/ui/components/spinner";
import { cn } from "@mapform/lib/classnames";
import { env } from "~/env.mjs";
import { updateStep } from "~/server/actions/steps/update";
import { getFormWithSteps } from "~/server/actions/forms/get-form-with-steps";
import { useCreateQueryString } from "~/lib/create-query-string";
import { Steps } from "./steps";
import { Sidebar } from "./sidebar";

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

type FormWithSteps = NonNullable<
  Awaited<ReturnType<typeof getFormWithSteps>>["data"]
>;

export function Container({ formId }: { formId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const s = searchParams.get("s");
  const [mapformLoaded, setMapformLoaded] = useState(false);
  const map = useRef<MapRef>(null);
  // We hold the steps in its own React state due to this issue: https://github.com/clauderic/dnd-kit/issues/921
  const { data, error, isLoading } = useQuery({
    queryKey: ["forms", formId],
    queryFn: async () => {
      const formWithSteps = await getFormWithSteps({ formId });

      if (formWithSteps.data) {
        setDragSteps(formWithSteps.data.steps);
      }
      return formWithSteps.data;
    },
  });
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

  const [dragSteps, setDragSteps] = useState<FormWithSteps["steps"]>(
    data?.steps ?? []
  );

  const currentStep = data?.steps.find((step) => step.id === s);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: currentStep?.latitude ?? initialViewState.latitude,
    longitude: currentStep?.longitude ?? initialViewState.longitude,
    zoom: currentStep?.zoom ?? initialViewState.zoom,
    bearing: currentStep?.bearing ?? initialViewState.bearing,
    pitch: currentStep?.pitch ?? initialViewState.pitch,
    padding: initialViewState.padding,
  });

  useEffect(() => {
    if (data?.steps[0] && !s) {
      router.push(`${pathname}?${createQueryString("s", data.steps[0].id)}`);
    }
  }, [s, data?.steps, pathname, router, createQueryString]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    // Radial gradient in case I want to add back bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    <div className="relative flex flex-col flex-1 bg-gray-50">
      {mapformLoaded ? null : (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner variant="dark" />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col flex-1  transition-all duration-300 ease-in-out",
          {
            invisible: !mapformLoaded,
            opacity: mapformLoaded ? 1 : 0,
          }
        )}
      >
        <div className="flex flex-1">
          {/* MAP */}
          <div className="p-8 flex-1 flex justify-center">
            <div className="max-w-screen-lg flex-1 border overflow-hidden">
              <MapForm
                currentStep={currentStep}
                editable
                mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                onDescriptionChange={async (content: { content: any[] }) => {
                  if (!s) {
                    return;
                  }

                  await debouncedUpdateStep({
                    stepId: s,
                    data: {
                      description: content,
                      formId: data.id,
                    },
                  });
                }}
                onLoad={() => {
                  setMapformLoaded(true);
                }}
                onTitleChange={async (content: string) => {
                  if (!s) {
                    return;
                  }

                  await debouncedUpdateStep({
                    stepId: s,
                    data: {
                      title: content,
                      formId: data.id,
                    },
                  });
                }}
                ref={map}
                setViewState={(evt) => {
                  setViewState(evt.viewState);
                }}
                viewState={viewState}
              />
            </div>
          </div>

          {/* SIDEBAR */}
          <Sidebar
            currentStep={currentStep}
            setDragSteps={setDragSteps}
            setViewState={setViewState}
            viewState={viewState}
          />
        </div>

        {/* STEPS */}
        <Steps
          currentStep={currentStep}
          dragSteps={dragSteps}
          formId={formId}
          map={map}
          setDragSteps={setDragSteps}
          viewState={viewState}
        />
      </div>
    </div>
  );
}
