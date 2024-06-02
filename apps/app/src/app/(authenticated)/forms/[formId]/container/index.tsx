"use client";

import { useEffect, useState, useRef } from "react";
import type { MapRef, ViewState } from "@mapform/mapform";
import { MapForm } from "@mapform/mapform";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@mapform/lib/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@mapform/ui/components/spinner";
import { cn } from "@mapform/lib/classnames";
import { env } from "~/env.mjs";
import { updateStep } from "~/server/actions/steps/update";
import { getFormWithSteps } from "~/server/actions/forms/get-form-with-steps";
import { useCreateQueryString } from "~/lib/create-query-string";
import { Steps } from "./steps";

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
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();
  const s = searchParams.get("s");
  const [mapformLoaded, setMapformLoaded] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(initialViewState);
  const map = useRef<MapRef>(null);
  // We hold the steps in its own React state due to this issue: https://github.com/clauderic/dnd-kit/issues/921
  const [dragSteps, setDragSteps] = useState<FormWithSteps["steps"]>([]);
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

  useEffect(() => {
    if (data?.steps[0] && !s) {
      router.push(`${pathname}?${createQueryString("s", data.steps[0].id)}`);
    }
  }, [s, data?.steps, pathname, router, createQueryString]);

  const debouncedUpdateStep = useDebounce(updateStep, 500);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  // if (!s) {
  //   return null;
  // }

  const currentStep = dragSteps.find((step) => step.id === s);

  return (
    <div className="relative flex flex-col flex-1 bg-slate-100 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
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
